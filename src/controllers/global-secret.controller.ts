/**
 * 全域 API 金鑰管理（僅系統管理員）
 */
import type { Context } from "hono";
import type { HonoEnv } from "../types";
import { getPrisma } from "../lib/db";
import { encrypt } from "../utils/crypto";

const PROVIDER_OPTIONS = [
  { value: "GEMINI", label: "Gemini (Google AI)" },
  { value: "GOOGLE", label: "Google" },
  { value: "GOOGLE_OAUTH", label: "Google 登入 (OAuth)" },
  { value: "LINE", label: "Line" },
  { value: "LINE_OAUTH", label: "Line 登入" },
  { value: "OPENAI", label: "OpenAI" },
  { value: "OTHER", label: "其他" },
];

const KEY_NAME_BY_PROVIDER: Record<string, string[]> = {
  GEMINI: ["GEMINI_API_KEY"],
  GOOGLE: ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
  GOOGLE_OAUTH: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET"],
  LINE: ["LINE_CHANNEL_SECRET", "LINE_CHANNEL_ACCESS_TOKEN"],
  LINE_OAUTH: ["LINE_CHANNEL_ID", "LINE_CHANNEL_SECRET"],
  OPENAI: ["OPENAI_API_KEY"],
  OTHER: [],
};

export async function listGlobalSecrets(c: Context<HonoEnv>): Promise<Response> {
  const prisma = getPrisma(c.env.DB);
  const secrets = await prisma.globalSecret.findMany({
    orderBy: { created_at: "desc" },
    include: {
      project_grants: {
        include: { project: { select: { id: true, name: true } } },
      },
    },
  });
  const data = secrets.map((s) => ({
    id: s.id,
    provider_type: s.provider_type,
    key_name: s.key_name,
    created_at: s.created_at,
    project_ids: s.project_grants.map((g) => g.project_id),
    projects: s.project_grants.map((g) => ({ id: g.project.id, name: g.project.name })),
  }));
  return c.json({
    success: true,
    data: { secrets: data, provider_options: PROVIDER_OPTIONS },
  });
}

export async function createGlobalSecret(c: Context<HonoEnv>): Promise<Response> {
  const masterKey = c.env.MASTER_KEY;
  if (!masterKey?.trim()) {
    return c.json(
      { success: false, code: "MASTER_KEY_NOT_CONFIGURED", message: "伺服器未設定 MASTER_KEY" },
      503
    );
  }

  let body: { provider_type?: string; key_name?: string; value?: string; project_ids?: string[] };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ success: false, code: "INVALID_JSON", message: "無效的 JSON" }, 400);
  }

  const { provider_type, key_name, value, project_ids } = body;
  if (!provider_type?.trim() || !key_name?.trim() || !value?.trim()) {
    return c.json(
      { success: false, code: "VALIDATION_ERROR", message: "缺少 provider_type, key_name 或 value" },
      400
    );
  }

  const prisma = getPrisma(c.env.DB);
  const userId = c.get("user")?.id;

  try {
    const payload = await encrypt(value.trim(), masterKey);
    const secret = await prisma.globalSecret.upsert({
      where: {
        provider_type_key_name: {
          provider_type: provider_type.trim(),
          key_name: key_name.trim(),
        },
      },
      create: {
        provider_type: provider_type.trim(),
        key_name: key_name.trim(),
        encrypted_data: payload.encryptedData,
        iv: payload.iv,
        auth_tag: payload.authTag,
        created_by: userId ?? null,
      },
      update: {
        encrypted_data: payload.encryptedData,
        iv: payload.iv,
        auth_tag: payload.authTag,
      },
    });

    await prisma.projectGlobalSecretMap.deleteMany({
      where: { global_secret_id: secret.id },
    });
    if (Array.isArray(project_ids) && project_ids.length > 0) {
      await prisma.projectGlobalSecretMap.createMany({
        data: project_ids.map((pid) => ({
          project_id: pid,
          global_secret_id: secret.id,
        })),
      });
    }

    await prisma.auditLog.create({
      data: {
        user_id: userId,
        action: "CREATE_GLOBAL_SECRET",
        target: secret.id,
        payload: JSON.stringify({ provider_type: secret.provider_type, key_name: secret.key_name }),
      },
    });

    return c.json({
      success: true,
      data: {
        id: secret.id,
        provider_type: secret.provider_type,
        key_name: secret.key_name,
        created_at: secret.created_at,
      },
    }, 201);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return c.json(
      { success: false, code: "CREATE_FAILED", message: "建立失敗：" + msg },
      500
    );
  }
}

export async function updateGlobalSecretGrants(c: Context<HonoEnv>): Promise<Response> {
  const secretId = c.req.param("secretId") ?? "";
  let body: { project_ids?: string[] };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ success: false, code: "INVALID_JSON", message: "無效的 JSON" }, 400);
  }

  const prisma = getPrisma(c.env.DB);
  const secret = await prisma.globalSecret.findUnique({
    where: { id: secretId },
  });
  if (!secret) {
    return c.json({ success: false, code: "NOT_FOUND", message: "全域金鑰不存在" }, 404);
  }

  const projectIds = Array.isArray(body.project_ids) ? body.project_ids : [];
  await prisma.projectGlobalSecretMap.deleteMany({
    where: { global_secret_id: secretId },
  });
  if (projectIds.length > 0) {
    await prisma.projectGlobalSecretMap.createMany({
      data: projectIds.map((pid) => ({
        project_id: pid,
        global_secret_id: secretId,
      })),
    });
  }

  await prisma.auditLog.create({
    data: {
      user_id: c.get("user")?.id,
      action: "UPDATE_GLOBAL_SECRET_GRANTS",
      target: secretId,
      payload: JSON.stringify({ project_ids: projectIds }),
    },
  });

  return c.json({ success: true, data: { project_ids: projectIds } });
}

export async function deleteGlobalSecret(c: Context<HonoEnv>): Promise<Response> {
  const secretId = c.req.param("secretId");
  const prisma = getPrisma(c.env.DB);
  const secret = await prisma.globalSecret.findUnique({
    where: { id: secretId },
  });
  if (!secret) {
    return c.json({ success: false, code: "NOT_FOUND", message: "全域金鑰不存在" }, 404);
  }

  await prisma.globalSecret.delete({ where: { id: secretId } });
  await prisma.auditLog.create({
    data: {
      user_id: c.get("user")?.id,
      action: "DELETE_GLOBAL_SECRET",
      target: secretId,
      payload: JSON.stringify({ key_name: secret.key_name }),
    },
  });

  return c.json({ success: true });
}

export { PROVIDER_OPTIONS, KEY_NAME_BY_PROVIDER };
