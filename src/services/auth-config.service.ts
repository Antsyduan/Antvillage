/**
 * Auth Config Service
 * 依專案金鑰取得 Google OAuth、Line 登入等設定（從全域金鑰解密）
 */
import type { PrismaClient } from "@prisma/client";
import { decrypt } from "../utils/crypto";
import { findByThirdPartyKey } from "../repository/project.repository";

const AUTH_PROVIDERS = ["GOOGLE_OAUTH", "LINE_OAUTH"] as const;
const AUTH_KEYS = {
  GOOGLE_OAUTH: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET"],
  LINE_OAUTH: ["LINE_CHANNEL_ID", "LINE_CHANNEL_SECRET"],
} as const;

export interface AuthConfigResult {
  valid: boolean;
  project?: { id: string; name: string };
  auth?: {
    google?: { client_id: string; client_secret: string };
    line?: { channel_id: string; channel_secret: string };
  };
}

export async function getAuthConfigForProject(
  prisma: PrismaClient,
  projectKey: string,
  masterKey: string
): Promise<AuthConfigResult> {
  const project = await findByThirdPartyKey(prisma, projectKey);
  if (!project) {
    return { valid: false };
  }

  const grants = await prisma.projectGlobalSecretMap.findMany({
    where: { project_id: project.id },
    include: {
      global_secret: true,
    },
  });

  const auth: AuthConfigResult["auth"] = {};
  for (const g of grants) {
    const s = g.global_secret;
    if (!AUTH_PROVIDERS.includes(s.provider_type as (typeof AUTH_PROVIDERS)[number])) continue;

    try {
      const value = await decrypt(
        {
          encryptedData: s.encrypted_data,
          iv: s.iv,
          authTag: s.auth_tag,
        },
        masterKey
      );

      if (s.provider_type === "GOOGLE_OAUTH") {
        if (!auth.google) auth.google = { client_id: "", client_secret: "" };
        if (s.key_name === "GOOGLE_OAUTH_CLIENT_ID") auth.google.client_id = value;
        if (s.key_name === "GOOGLE_OAUTH_CLIENT_SECRET") auth.google.client_secret = value;
      }
      if (s.provider_type === "LINE_OAUTH") {
        if (!auth.line) auth.line = { channel_id: "", channel_secret: "" };
        if (s.key_name === "LINE_CHANNEL_ID") auth.line.channel_id = value;
        if (s.key_name === "LINE_CHANNEL_SECRET") auth.line.channel_secret = value;
      }
    } catch {
      // 解密失敗則略過該金鑰
    }
  }

  // 僅回傳有完整設定的 provider
  if (auth.google && (!auth.google.client_id || !auth.google.client_secret)) {
    delete auth.google;
  }
  if (auth.line && (!auth.line.channel_id || !auth.line.channel_secret)) {
    delete auth.line;
  }

  return {
    valid: true,
    project: { id: project.id, name: project.name },
    auth: Object.keys(auth).length > 0 ? auth : undefined,
  };
}
