/**
 * Auth Service
 * 驗證 Project_3rd_Party_Key 與權限查詢
 */
import type { PrismaClient } from "@prisma/client";
import { findByThirdPartyKey } from "../repository/project.repository";
import { findByProjectAndUser } from "../repository/permission.repository";

export interface VerifyKeyResult {
  valid: boolean;
  project?: {
    id: string;
    name: string;
    description: string | null;
    domain_whitelist: string | null;
    status: string;
  };
  permission?: {
    role: string;
    scopes: string;
  };
}

/**
 * 驗證 3rd Party Key 是否有效
 * 可選：若提供 userId，一併回傳該使用者在專案中的權限
 */
export async function verifyProjectKey(
  prisma: PrismaClient,
  projectKey: string,
  userId?: string
): Promise<VerifyKeyResult> {
  const project = await findByThirdPartyKey(prisma, projectKey);

  if (!project) {
    return { valid: false };
  }

  const result: VerifyKeyResult = {
    valid: true,
    project: {
      id: project.id,
      name: project.name,
      description: project.description,
      domain_whitelist: project.domain_whitelist,
      status: project.status,
    },
  };

  if (userId) {
    const permission = await findByProjectAndUser(
      prisma,
      project.id,
      userId
    );
    if (permission) {
      result.permission = {
        role: permission.role,
        scopes: permission.scopes,
      };
    }
  }

  return result;
}
