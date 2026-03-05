/**
 * AI 測試沙盒 Controller
 * 使用專案金鑰 + Skill 呼叫 Gemini，並寫入 AuditLog
 * 支援 X-Debug: 1 回傳底層 API 溝通日誌
 */
import type { Context } from "hono";
import type { HonoEnv } from "../types";
import { getPrisma } from "../lib/db";
import { generateContent } from "../services/gemini.service";
import { resolveGeminiApiKey } from "../services/secret-resolver.service";

export async function testSkill(c: Context<HonoEnv>): Promise<Response> {
  const debugMode = c.req.header("X-Debug") === "1" || c.req.query("debug") === "1";
  const debugLog: { step: string; status: string; detail?: string }[] = [];

  const masterKey = c.env.MASTER_KEY;
  if (!masterKey?.trim()) {
    if (debugMode) debugLog.push({ step: "MASTER_KEY", status: "FAIL", detail: "未設定" });
    return c.json(
      {
        success: false,
        code: "MASTER_KEY_NOT_CONFIGURED",
        message: "伺服器未設定 MASTER_KEY，無法解密金鑰",
        ...(debugMode && { _debug: { request: null, decryption_trace: debugLog } }),
      },
      503
    );
  }

  const projectId = c.req.param("id");
  const skillId = c.req.param("skillId");
  if (!projectId) {
    return c.json({ success: false, code: "VALIDATION_ERROR", message: "專案 ID 必填" }, 400);
  }

  let body: { input?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json(
      { success: false, code: "INVALID_JSON", message: "無效的 JSON" },
      400
    );
  }

  const input = typeof body.input === "string" ? body.input.trim() : "";
  if (!input) {
    return c.json(
      { success: false, code: "VALIDATION_ERROR", message: "input 不可為空" },
      400
    );
  }

  const reqUrl = new URL(c.req.url);
  const reqForDebug = debugMode
    ? (() => {
        const headers: Record<string, string> = {};
        c.req.raw.headers.forEach((v, k) => {
          headers[k] = /^(authorization|x-project-key|x-inject-key)$/i.test(k) ? "***" : v;
        });
        return { url: reqUrl.pathname, method: c.req.method, headers, body: { input } };
      })()
    : null;

  const prisma = getPrisma(c.env.DB);

  const skill = await prisma.aiSkill.findFirst({
    where: { id: skillId, project_id: projectId },
  });

  if (!skill) {
    if (debugMode) debugLog.push({ step: "SKILL_LOOKUP", status: "FAIL", detail: "Skill 不存在" });
    return c.json(
      {
        success: false,
        code: "SKILL_NOT_FOUND",
        message: "Skill 不存在或無權限",
        ...(debugMode && { _debug: { request: reqForDebug, decryption_trace: debugLog } }),
      },
      404
    );
  }
  if (debugMode) debugLog.push({ step: "SKILL_LOOKUP", status: "OK", detail: skill.name });

  let apiKey: string | null;
  try {
    apiKey = await resolveGeminiApiKey(prisma, projectId, masterKey);
  } catch (err) {
    if (debugMode) debugLog.push({ step: "DECRYPT", status: "FAIL", detail: String(err) });
    return c.json(
      {
        success: false,
        code: "DECRYPT_FAILED",
        message: "金鑰解密失敗",
        ...(debugMode && { _debug: { request: reqForDebug, decryption_trace: debugLog } }),
      },
      500
    );
  }

  if (!apiKey) {
    if (debugMode) debugLog.push({ step: "SECRET_LOOKUP", status: "FAIL", detail: "無 GEMINI_API_KEY" });
    return c.json(
      {
        success: false,
        code: "NO_GEMINI_KEY",
        message: "此專案尚未設定 Gemini API 金鑰，請在金鑰保險箱或全域 API 金鑰新增",
        ...(debugMode && { _debug: { request: reqForDebug, decryption_trace: debugLog } }),
      },
      400
    );
  }
  if (debugMode) debugLog.push({ step: "SECRET_LOOKUP", status: "OK", detail: "專案或全域金鑰" });

  try {
    const result = await generateContent({
      apiKey,
      systemInstruction: skill.system_prompt,
      userContent: input,
    });

    if (debugMode) debugLog.push({ step: "GEMINI_API", status: "OK", detail: "呼叫成功" });

    await prisma.auditLog.create({
      data: {
        project_id: projectId,
        action: "TEST_SKILL",
        target: skillId,
        payload: JSON.stringify({ skill_name: skill.name, input_length: input.length }),
      },
    });

    const responseData = {
      success: true,
      data: {
        skill_id: skill.id,
        skill_name: skill.name,
        response: result.text,
      },
    };

    if (debugMode) {
      (responseData as Record<string, unknown>)._debug = {
        request: reqForDebug,
        response: { status: 200, body: responseData },
        decryption_trace: debugLog,
      };
    }

    return c.json(responseData);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gemini 呼叫失敗";
    if (debugMode) debugLog.push({ step: "GEMINI_API", status: "FAIL", detail: message });

    await prisma.auditLog.create({
      data: {
        project_id: projectId,
        action: "TEST_SKILL_ERROR",
        target: skillId,
        payload: JSON.stringify({ skill_name: skill.name, error: message }),
      },
    });

    return c.json(
      {
        success: false,
        code: "GEMINI_ERROR",
        message,
        ...(debugMode && {
          _debug: {
            request: reqForDebug,
            response: { status: 502, body: { message } },
            decryption_trace: debugLog,
          },
        }),
      },
      502
    );
  }
}
