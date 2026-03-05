/**
 * /v1/ai/execute - 外部子網站調用 API
 * 驗證 Project_Key、Skill_ID、Params，代理呼叫 Gemini，金鑰不離開伺服器
 */
import type { Context } from "hono";
import type { HonoEnv } from "../types";
import { getPrisma } from "../lib/db";
import { generateContent } from "../services/gemini.service";
import { resolveGeminiApiKey } from "../services/secret-resolver.service";
import { validateParams } from "../utils/validate-schema";
import { findByThirdPartyKey } from "../repository/project.repository";
import { checkAndIncrement } from "../services/rate-limit.service";
import { findAllowedSkill } from "../services/skill-scope.service";
import { checkAndIncrementDaily } from "../services/daily-usage.service";
import {
  checkTokenQuota,
  addTokenUsage,
} from "../services/token-quota.service";

const HEADER_PROJECT_KEY = "x-project-key";

export async function executeAi(c: Context<HonoEnv>): Promise<Response> {
  const masterKey = c.env.MASTER_KEY;
  if (!masterKey?.trim()) {
    return c.json(
      {
        success: false,
        code: "SERVICE_UNAVAILABLE",
        message: "服務暫時無法使用",
      },
      503
    );
  }

  // 取得 Project_Key
  let projectKey =
    c.req.header(HEADER_PROJECT_KEY)?.trim() ??
    c.req.query("project_key")?.trim();

  let body: {
    project_key?: string;
    skill_id?: string;
    skill_version?: string;
    params?: unknown;
  };
  try {
    body = await c.req.json();
  } catch {
    return c.json(
      { success: false, code: "INVALID_JSON", message: "無效的 JSON" },
      400
    );
  }

  projectKey ??= body.project_key?.trim();
  const skillId = body.skill_id?.trim();
  const skillVersion = body.skill_version?.trim();
  const params = body.params;

  if (!projectKey) {
    return c.json(
      {
        success: false,
        code: "MISSING_PROJECT_KEY",
        message: "請提供 X-Project-Key header 或 body.project_key",
      },
      401
    );
  }

  if (!skillId) {
    return c.json(
      {
        success: false,
        code: "MISSING_SKILL_ID",
        message: "請提供 body.skill_id",
      },
      400
    );
  }

  const prisma = getPrisma(c.env.DB);

  // 驗證 Project_Key 合法且專案狀態為 active
  const project = await findByThirdPartyKey(prisma, projectKey);
  if (!project) {
    return c.json(
      {
        success: false,
        code: "INVALID_PROJECT_KEY",
        message: "無效或已停用的專案金鑰",
      },
      401
    );
  }

  // 每日額度：max_daily_calls 檢查
  const daily = await checkAndIncrementDaily(
    prisma,
    project.id,
    project.max_daily_calls ?? null
  );
  if (!daily.allowed) {
    await prisma.auditLog.create({
      data: {
        project_id: project.id,
        action: "DAILY_LIMIT_EXCEEDED",
        target: null,
        payload: JSON.stringify({ used: daily.used, limit: daily.limit }),
      },
    });
    return c.json(
      {
        success: false,
        code: "DAILY_LIMIT_EXCEEDED",
        message: `今日調用次數已達上限（${daily.used}/${daily.limit}）`,
      },
      429
    );
  }

  // 多租戶配額控管：依專案 quota_per_minute 限制
  const { allowed, count, limit } = await checkAndIncrement(
    prisma,
    project.id,
    project.quota_per_minute ?? undefined
  );
  if (!allowed) {
    await prisma.auditLog.create({
      data: {
        project_id: project.id,
        action: "RATE_LIMIT_EXCEEDED",
        target: null,
        payload: JSON.stringify({ count, limit }),
      },
    });
    return c.json(
      {
        success: false,
        code: "RATE_LIMIT_EXCEEDED",
        message: `請求過於頻繁，請稍後再試（每分鐘最多 ${limit} 次）`,
      },
      429
    );
  }

  // Token 額度：daily_token_limit 檢查（在實際調用前）
  const tokenQuota = await checkTokenQuota(
    prisma,
    project.id,
    project.daily_token_limit ?? null
  );
  if (!tokenQuota.allowed) {
    await prisma.auditLog.create({
      data: {
        project_id: project.id,
        action: "TOKEN_QUOTA_EXCEEDED",
        target: null,
        payload: JSON.stringify({
          used: tokenQuota.used,
          limit: tokenQuota.limit,
        }),
      },
    });
    return c.json(
      {
        success: false,
        code: "TOKEN_QUOTA_EXCEEDED",
        message: `今日 Token 消耗已達上限（${tokenQuota.used}/${tokenQuota.limit}）`,
      },
      429
    );
  }

  // 取得 Skill（支援 skill_id 或 skill_name + skill_version，僅已驗證的 Skill 可對外調用）
  // 作用域：專案自己建立的 Skill 或 ProjectSkillMap 授權的 Skill
  const skill = await findAllowedSkill(
    prisma,
    project.id,
    skillId,
    skillVersion || undefined
  );

  if (!skill) {
    return c.json(
      {
        success: false,
        code: "SKILL_NOT_FOUND",
        message: "Skill 不存在、尚未驗證或此專案無權調用",
      },
      404
    );
  }

  // 使用 Input_Schema 校驗 Params
  const validation = validateParams(skill.input_schema, params ?? {});
  if (!validation.valid) {
    return c.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: validation.errors?.join("; ") ?? "Params 驗證失敗",
      },
      400
    );
  }

  // 取得 Gemini API Key（專案金鑰優先，其次全域金鑰）
  let apiKey: string | null;
  try {
    apiKey = await resolveGeminiApiKey(prisma, project.id, masterKey);
  } catch {
    return c.json(
      {
        success: false,
        code: "DECRYPT_FAILED",
        message: "金鑰解密失敗",
      },
      500
    );
  }

  if (!apiKey) {
    return c.json(
      {
        success: false,
        code: "NO_GEMINI_KEY",
        message: "此專案尚未設定 Gemini API 金鑰（專案金鑰或全域金鑰）",
      },
      503
    );
  }

  // 將 params 轉為 user content 送給 Gemini
  const userContent =
    typeof params === "object" && params !== null
      ? JSON.stringify(params)
      : String(params ?? "");

  try {
    const result = await generateContent({
      apiKey,
      systemInstruction: skill.system_prompt,
      userContent,
    });

    // 累加 Token 消耗
    const tokensUsed = result.totalTokenCount ?? 0;
    if (tokensUsed > 0) {
      await addTokenUsage(prisma, project.id, tokensUsed);
    }

    // Audit
    await prisma.auditLog.create({
      data: {
        project_id: project.id,
        action: "EXECUTE_AI",
        target: skillId,
        payload: JSON.stringify({ skill_name: skill.name }),
      },
    });

    return c.json({
      success: true,
      data: {
        skill_id: skill.id,
        skill_name: skill.name,
        skill_version: skill.version,
        result: result.text,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI 呼叫失敗";
    await prisma.auditLog.create({
      data: {
        project_id: project.id,
        action: "EXECUTE_AI_ERROR",
        target: skillId,
        payload: JSON.stringify({ skill_name: skill.name, error: message }),
      },
    });
    return c.json(
      {
        success: false,
        code: "AI_ERROR",
        message,
      },
      502
    );
  }
}
