/**
 * 金鑰解析服務：專案金鑰優先，其次全域金鑰
 * 用於 AI 執行時取得 GEMINI_API_KEY 等
 */
import type { PrismaClient } from "@prisma/client";
import { decrypt } from "../utils/crypto";

export type SecretPayload = {
  encryptedData: string;
  iv: string;
  authTag: string;
};

/**
 * 取得專案可用的 Gemini API Key
 * 優先：專案 SecretVault → 專案授權的 GlobalSecret
 */
export async function resolveGeminiApiKey(
  prisma: PrismaClient,
  projectId: string,
  masterKey: string
): Promise<string | null> {
  // 1. 專案自有金鑰
  const projectSecret = await prisma.secretVault.findFirst({
    where: {
      project_id: projectId,
      OR: [{ key_name: "GEMINI_API_KEY" }, { provider_type: "GOOGLE" }],
    },
  });
  if (projectSecret) {
    return decrypt(
      {
        encryptedData: projectSecret.encrypted_data,
        iv: projectSecret.iv,
        authTag: projectSecret.auth_tag,
      },
      masterKey
    );
  }

  // 2. 專案授權的全域金鑰（GEMINI / GOOGLE）
  const globalGrant = await prisma.projectGlobalSecretMap.findFirst({
    where: {
      project_id: projectId,
      global_secret: {
        OR: [
          { key_name: "GEMINI_API_KEY" },
          { provider_type: "GOOGLE" },
          { provider_type: "GEMINI" },
        ],
      },
    },
    include: { global_secret: true },
  });
  if (!globalGrant) return null;

  const gs = globalGrant.global_secret;
  return decrypt(
    {
      encryptedData: gs.encrypted_data,
      iv: gs.iv,
      authTag: gs.auth_tag,
    },
    masterKey
  );
}

/**
 * 取得專案可用的指定金鑰（依 key_name 或 provider_type）
 */
export async function resolveSecret(
  prisma: PrismaClient,
  projectId: string,
  keyName: string,
  providerTypes: string[],
  masterKey: string
): Promise<string | null> {
  const projectSecret = await prisma.secretVault.findFirst({
    where: {
      project_id: projectId,
      OR: [
        { key_name: keyName },
        ...providerTypes.map((p) => ({ provider_type: p })),
      ],
    },
  });
  if (projectSecret) {
    return decrypt(
      {
        encryptedData: projectSecret.encrypted_data,
        iv: projectSecret.iv,
        authTag: projectSecret.auth_tag,
      },
      masterKey
    );
  }

  const globalGrant = await prisma.projectGlobalSecretMap.findFirst({
    where: {
      project_id: projectId,
      global_secret: {
        OR: [
          { key_name: keyName },
          ...providerTypes.map((p) => ({ provider_type: p })),
        ],
      },
    },
    include: { global_secret: true },
  });
  if (!globalGrant) return null;

  return decrypt(
    {
      encryptedData: globalGrant.global_secret.encrypted_data,
      iv: globalGrant.global_secret.iv,
      authTag: globalGrant.global_secret.auth_tag,
    },
    masterKey
  );
}
