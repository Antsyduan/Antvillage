/**
 * Project Repository
 * 依 third_party_key 查詢專案
 */
import type { PrismaClient } from "@prisma/client";

export async function findByThirdPartyKey(
  prisma: PrismaClient,
  thirdPartyKey: string
) {
  return prisma.project.findUnique({
    where: {
      third_party_key: thirdPartyKey,
      status: "active",
    },
    select: {
      id: true,
      name: true,
      description: true,
      domain_whitelist: true,
      status: true,
      quota_per_minute: true,
      max_daily_calls: true,
      daily_token_limit: true,
    },
  });
}
