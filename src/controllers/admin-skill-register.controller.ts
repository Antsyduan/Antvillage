/**
 * 開發者自動註冊端點
 * POST /v1/admin/skills/register
 * 受 3rdPKey 保護，供 Vibe coding 時由 AI 直接提交並註冊新技能定義
 */
import type { Context } from "hono";
import type { HonoEnv } from "../types";
import { getPrisma } from "../lib/db";
import { findByThirdPartyKey } from "../repository/project.repository";

const HEADER_PROJECT_KEY = "x-project-key";

interface SkillDef {
  name: string;
  system_prompt: string;
  input_schema: string;
  output_schema?: string;
  version?: string;
  set_active?: boolean; // 是否設為 active 版本（預設 true）
}

export async function registerSkill(c: Context<HonoEnv>): Promise<Response> {
  const projectKey =
    c.req.header(HEADER_PROJECT_KEY)?.trim() ??
    c.req.query("project_key")?.trim();

  if (!projectKey) {
    return c.json(
      {
        success: false,
        code: "MISSING_PROJECT_KEY",
        message: "請提供 X-Project-Key header 或 query project_key",
      },
      401
    );
  }

  let body: SkillDef & { project_key?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json(
      { success: false, code: "INVALID_JSON", message: "無效的 JSON" },
      400
    );
  }

  const keyFromBody = body.project_key?.trim();
  const effectiveKey = keyFromBody ?? projectKey;

  const prisma = getPrisma(c.env.DB);
  const project = await findByThirdPartyKey(prisma, effectiveKey);
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

  const {
    name,
    system_prompt,
    input_schema,
    output_schema,
    version,
    set_active = true,
  } = body;
  if (!name?.trim() || !system_prompt?.trim() || !input_schema?.trim()) {
    return c.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "缺少必填欄位：name, system_prompt, input_schema",
      },
      400
    );
  }

  try {
    JSON.parse(input_schema);
  } catch {
    return c.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "input_schema 必須為有效 JSON",
      },
      400
    );
  }

  let outputSchema: string | null = output_schema?.trim() || null;
  if (outputSchema) {
    try {
      JSON.parse(outputSchema);
    } catch {
      return c.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          message: "output_schema 必須為有效 JSON",
        },
        400
      );
    }
  }

  const ver = version?.trim() ?? "1.0.0";
  const activate = set_active !== false;

  if (activate) {
    await prisma.aiSkill.updateMany({
      where: {
        project_id: project.id,
        name: name.trim(),
      },
      data: { is_active: false },
    });
  }

  const skill = await prisma.aiSkill.upsert({
    where: {
      project_id_name_version: {
        project_id: project.id,
        name: name.trim(),
        version: ver,
      },
    },
    create: {
      project_id: project.id,
      name: name.trim(),
      version: ver,
      system_prompt: system_prompt.trim(),
      input_schema: input_schema.trim(),
      output_schema: outputSchema,
      is_verified: true,
      is_active: activate,
    },
    update: {
      system_prompt: system_prompt.trim(),
      input_schema: input_schema.trim(),
      output_schema: outputSchema,
      is_verified: true,
      is_active: activate,
    },
  });

  await prisma.auditLog.create({
    data: {
      project_id: project.id,
      action: "REGISTER_SKILL",
      target: skill.id,
      payload: JSON.stringify({ name: skill.name, version: skill.version }),
    },
  });

  return c.json({
    success: true,
    data: {
      skill_id: skill.id,
      name: skill.name,
      version: skill.version,
      status: "registered",
    },
  });
}
