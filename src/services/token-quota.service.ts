/**
 * 每日 Token 額度：daily_token_limit 監控
 */
import type { PrismaClient } from "@prisma/client";

function getDateKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export async function checkTokenQuota(
  prisma: PrismaClient,
  projectId: string,
  dailyTokenLimit: number | null
): Promise<{ allowed: boolean; used: number; limit: number }> {
  if (dailyTokenLimit == null || dailyTokenLimit <= 0) {
    return { allowed: true, used: 0, limit: 0 };
  }

  const dateKey = getDateKey();
  const usage = await prisma.projectDailyUsage.findUnique({
    where: {
      project_id_date_key: { project_id: projectId, date_key: dateKey },
    },
  });

  const used = usage?.token_count ?? 0;
  return {
    allowed: used < dailyTokenLimit,
    used,
    limit: dailyTokenLimit,
  };
}

export async function addTokenUsage(
  prisma: PrismaClient,
  projectId: string,
  tokensUsed: number
): Promise<void> {
  if (tokensUsed <= 0) return;

  const dateKey = getDateKey();
  await prisma.projectDailyUsage.upsert({
    where: {
      project_id_date_key: { project_id: projectId, date_key: dateKey },
    },
    create: {
      project_id: projectId,
      date_key: dateKey,
      count: 0,
      token_count: tokensUsed,
    },
    update: {
      token_count: { increment: tokensUsed },
    },
  });
}
