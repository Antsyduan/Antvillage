/**
 * Project Detail API Controllers
 */
import type { Context } from "hono";
import type { HonoEnv } from "../types";
import { getPrisma } from "../lib/db";

export async function getProjectById(c: Context<HonoEnv>): Promise<Response> {
  const id = c.req.param("id");
  const prisma = getPrisma(c.env.DB);

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      secrets: {
        select: {
          id: true,
          key_name: true,
          provider_type: true,
          created_at: true,
        },
      },
      skills: {
        orderBy: { created_at: "desc" },
      },
    },
  });

  if (!project) {
    return c.json(
      { success: false, code: "NOT_FOUND", message: "專案不存在" },
      404
    );
  }

  return c.json({ success: true, data: project });
}

export async function createSkill(c: Context<HonoEnv>): Promise<Response> {
  const prisma = getPrisma(c.env.DB);

  let body: {
    project_id?: string;
    name?: string;
    version?: string;
    system_prompt?: string;
    input_schema?: string;
    output_schema?: string;
    is_verified?: boolean;
  };

  try {
    body = await c.req.json();
  } catch {
    return c.json(
      { success: false, code: "INVALID_JSON", message: "無效的 JSON" },
      400
    );
  }

  const { project_id, name, system_prompt, input_schema } = body;

  if (!project_id || !name || !system_prompt || !input_schema) {
    return c.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "缺少必填欄位: project_id, name, system_prompt, input_schema",
      },
      400
    );
  }

  // 驗證 input_schema 為有效 JSON
  try {
    JSON.parse(input_schema);
  } catch {
    return c.json(
      {
        success: false,
        code: "INVALID_SCHEMA",
        message: "input_schema 必須為有效的 JSON",
      },
      400
    );
  }

  // 驗證專案存在
  const project = await prisma.project.findUnique({
    where: { id: project_id },
  });

  if (!project) {
    return c.json(
      { success: false, code: "PROJECT_NOT_FOUND", message: "專案不存在" },
      404
    );
  }

  const version = body.version ?? "1.0.0";
  let output_schema: string | null = body.output_schema?.trim() || null;
  if (output_schema) {
    try {
      JSON.parse(output_schema);
    } catch {
      return c.json(
        { success: false, code: "INVALID_SCHEMA", message: "output_schema 必須為有效的 JSON" },
        400
      );
    }
  }
  const is_verified = body.is_verified ?? false;

  const skill = await prisma.aiSkill.create({
    data: {
      project_id,
      name,
      version,
      system_prompt,
      input_schema,
      output_schema,
      is_verified,
    },
  });

  // Audit: 每次寫入必須記錄
  await prisma.auditLog.create({
    data: {
      project_id,
      action: "CREATE_SKILL",
      target: skill.id,
      payload: JSON.stringify({ name, version }),
    },
  });

  return c.json({ success: true, data: skill }, 201);
}
