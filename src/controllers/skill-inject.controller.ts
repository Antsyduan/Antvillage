/**
 * 自動化 Skill 注入 API
 * 開發環境透過 API 自動註冊與校驗 AI Skills
 * 需設定 ENABLE_SKILL_INJECT=true 或 X-Inject-Key header 驗證
 */
import type { Context } from "hono";
import type { HonoEnv } from "../types";
import { getPrisma } from "../lib/db";
import { findByThirdPartyKey } from "../repository/project.repository";

interface SkillDef {
  name: string;
  system_prompt: string;
  input_schema: string;
  output_schema?: string;
  version?: string;
}

export async function injectSkills(c: Context<HonoEnv>): Promise<Response> {
  const enableInject = c.env.ENABLE_SKILL_INJECT === "true";
  const injectKey = c.env.SKILL_INJECT_SECRET;
  const headerKey = c.req.header("X-Inject-Key")?.trim();

  if (!enableInject && !injectKey) {
    return c.json(
      {
        success: false,
        code: "INJECT_DISABLED",
        message: "Skill 注入 API 未啟用，請設定 ENABLE_SKILL_INJECT 或 SKILL_INJECT_SECRET",
      },
      403
    );
  }

  if (injectKey && headerKey !== injectKey) {
    return c.json(
      {
        success: false,
        code: "INVALID_INJECT_KEY",
        message: "X-Inject-Key 驗證失敗",
      },
      401
    );
  }

  let body: {
    project_id?: string;
    project_key?: string;
    skills?: SkillDef[];
  };

  try {
    body = await c.req.json();
  } catch {
    return c.json(
      { success: false, code: "INVALID_JSON", message: "無效的 JSON" },
      400
    );
  }

  const prisma = getPrisma(c.env.DB);
  let projectId = body.project_id?.trim();

  if (!projectId && body.project_key?.trim()) {
    const project = await findByThirdPartyKey(prisma, body.project_key.trim());
    if (!project) {
      return c.json(
        { success: false, code: "INVALID_PROJECT_KEY", message: "專案金鑰無效" },
        401
      );
    }
    projectId = project.id;
  }

  if (!projectId) {
    return c.json(
      { success: false, code: "MISSING_PROJECT", message: "請提供 project_id 或 project_key" },
      400
    );
  }

  const skills = body.skills;
  if (!Array.isArray(skills) || skills.length === 0) {
    return c.json(
      { success: false, code: "MISSING_SKILLS", message: "請提供 skills 陣列" },
      400
    );
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return c.json(
      { success: false, code: "PROJECT_NOT_FOUND", message: "專案不存在" },
      404
    );
  }

  const results: Array<{ name: string; version: string; status: string; id: string }> = [];
  const errors: Array<{ name: string; error: string }> = [];

  for (const s of skills) {
    if (!s.name || !s.system_prompt || !s.input_schema) {
      errors.push({ name: s.name || "?", error: "缺少 name, system_prompt 或 input_schema" });
      continue;
    }

    try {
      JSON.parse(s.input_schema);
    } catch {
      errors.push({ name: s.name, error: "input_schema 必須為有效 JSON" });
      continue;
    }

    const version = s.version ?? "1.0.0";
    let output_schema: string | null = s.output_schema?.trim() || null;
    if (output_schema) {
      try {
        JSON.parse(output_schema);
      } catch {
        errors.push({ name: s.name, error: "output_schema 必須為有效 JSON" });
        continue;
      }
    }

    const skill = await prisma.aiSkill.upsert({
      where: {
        project_id_name_version: {
          project_id: projectId,
          name: s.name,
          version,
        },
      },
      create: {
        project_id: projectId,
        name: s.name,
        version,
        system_prompt: s.system_prompt,
        input_schema: s.input_schema,
        output_schema,
        is_verified: true,
      },
      update: {
        system_prompt: s.system_prompt,
        input_schema: s.input_schema,
        output_schema,
        is_verified: true,
      },
    });

    results.push({
      name: skill.name,
      version: skill.version,
      status: "registered",
      id: skill.id,
    });
  }

  for (const r of results) {
    await prisma.auditLog.create({
      data: {
        project_id: projectId,
        action: "INJECT_SKILL",
        target: r.id,
        payload: JSON.stringify({ name: r.name, version: r.version }),
      },
    });
  }

  return c.json({
    success: true,
    data: {
      project_id: projectId,
      injected: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
    },
  });
}
