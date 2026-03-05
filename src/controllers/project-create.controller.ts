/**
 * 專案建立 API
 * 建立專案時自動加入預設 AI Skills（general_assistant、summarizer）
 */
import type { Context } from "hono";
import type { HonoEnv } from "../types";
import { getPrisma } from "../lib/db";
import { generateThirdPartyKey } from "../utils/keygen";
import { DEFAULT_STARTER_SKILLS } from "../config/default-skills";

export async function createProject(c: Context<HonoEnv>): Promise<Response> {
  let body: { name?: string; description?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json(
      { success: false, code: "INVALID_JSON", message: "無效的 JSON" },
      400
    );
  }

  const name = body.name?.trim();
  if (!name) {
    return c.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "請填寫專案名稱",
      },
      400
    );
  }

  const prisma = getPrisma(c.env.DB);

  try {
    let thirdPartyKey: string;
    let attempts = 0;
    const maxAttempts = 5;
    do {
      thirdPartyKey = generateThirdPartyKey();
      const existing = await prisma.project.findUnique({
        where: { third_party_key: thirdPartyKey },
      });
      if (!existing) break;
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      return c.json(
        {
          success: false,
          code: "KEY_GEN_FAILED",
          message: "無法產生唯一金鑰，請稍後再試",
        },
        500
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: body.description?.trim() || null,
        third_party_key: thirdPartyKey,
        status: "active",
      },
      include: {
        _count: { select: { users: true, skills: true } },
      },
    });

    // 自動加入預設 AI Skills
    for (const skill of DEFAULT_STARTER_SKILLS) {
      const created = await prisma.aiSkill.create({
        data: {
          project_id: project.id,
          name: skill.name,
          version: skill.version,
          system_prompt: skill.system_prompt,
          input_schema: skill.input_schema,
          output_schema: skill.output_schema,
          is_verified: skill.is_verified,
          is_active: true,
        },
      });
      await prisma.auditLog.create({
        data: {
          project_id: project.id,
          action: "CREATE_SKILL",
          target: created.id,
          payload: JSON.stringify({ name: skill.name, version: skill.version, auto: true }),
        },
      });
    }

    // 重新查詢以取得正確的 skills 數量
    const projectWithCount = await prisma.project.findUnique({
      where: { id: project.id },
      include: { _count: { select: { users: true, skills: true } } },
    });

    await prisma.auditLog.create({
      data: {
        project_id: project.id,
        action: "CREATE_PROJECT",
        target: project.id,
        payload: JSON.stringify({ name: project.name }),
      },
    });

    return c.json({ success: true, data: projectWithCount ?? project }, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : "建立專案失敗";
    return c.json(
      {
        success: false,
        code: "CREATE_PROJECT_ERROR",
        message,
      },
      500
    );
  }
}
