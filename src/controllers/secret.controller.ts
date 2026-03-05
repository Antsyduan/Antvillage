/**
 * SecretVault 金鑰管理 Controller
 * 所有金鑰經 crypto.ts AES-256-GCM 加密後儲存
 */
import type { Context } from "hono";
import type { HonoEnv } from "../types";
import { getPrisma } from "../lib/db";
import { encrypt } from "../utils/crypto";

export async function createSecret(c: Context<HonoEnv>): Promise<Response> {
  const masterKey = c.env.MASTER_KEY;
  if (!masterKey || !masterKey.trim()) {
    return c.json(
      {
        success: false,
        code: "MASTER_KEY_NOT_CONFIGURED",
        message: "伺服器未設定 MASTER_KEY，無法加密儲存金鑰。請執行 wrangler secret put MASTER_KEY",
      },
      503
    );
  }

  const prisma = getPrisma(c.env.DB);

  let body: {
    project_id?: string;
    key_name?: string;
    provider_type?: string;
    value?: string;
  };

  try {
    body = await c.req.json();
  } catch {
    return c.json(
      { success: false, code: "INVALID_JSON", message: "無效的 JSON" },
      400
    );
  }

  const { project_id, key_name, provider_type, value } = body;

  if (!project_id || !key_name || !provider_type || !value) {
    return c.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "缺少必填欄位: project_id, key_name, provider_type, value",
      },
      400
    );
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return c.json(
      { success: false, code: "VALIDATION_ERROR", message: "金鑰內容不可為空" },
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

  try {
    const payload = await encrypt(trimmedValue, masterKey);

    const secret = await prisma.secretVault.upsert({
      where: {
        project_id_key_name: { project_id, key_name: key_name.trim() },
      },
      create: {
        project_id,
        key_name: key_name.trim(),
        provider_type: provider_type.trim(),
        encrypted_data: payload.encryptedData,
        iv: payload.iv,
        auth_tag: payload.authTag,
      },
      update: {
        provider_type: provider_type.trim(),
        encrypted_data: payload.encryptedData,
        iv: payload.iv,
        auth_tag: payload.authTag,
      },
    });

    // Audit: 每次寫入必須記錄
    await prisma.auditLog.create({
      data: {
        project_id,
        action: "CREATE_SECRET",
        target: secret.id,
        payload: JSON.stringify({ key_name: key_name.trim() }),
      },
    });

    return c.json(
      {
        success: true,
        data: {
          id: secret.id,
          key_name: secret.key_name,
          provider_type: secret.provider_type,
          created_at: secret.created_at,
        },
      },
      201
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "加密失敗";
    return c.json(
      {
        success: false,
        code: "ENCRYPTION_ERROR",
        message: `金鑰加密失敗: ${message}`,
      },
      500
    );
  }
}
