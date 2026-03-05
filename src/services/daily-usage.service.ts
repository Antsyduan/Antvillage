/**
 * 每日使用額度：max_daily_calls 監控
 */
import type { PrismaClient } from "@prisma/client";

function getDateKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export async function checkAndIncrementDaily(
  prisma: PrismaClient,
  projectId: string,
  maxDailyCalls: number | null
): Promise<{ allowed: boolean; used: number; limit: number }> {
  if (maxDailyCalls == null || maxDailyCalls <= 0) {
    return { allowed: true, used: 0, limit: 0 };
  }

  const dateKey = getDateKey();

  const existing = await prisma.projectDailyUsage.findUnique({
    where: {
      project_id_date_key: { project_id: projectId, date_key: dateKey },
    },
  });

  const currentCount = existing?.count ?? 0;
  if (currentCount >= maxDailyCalls) {
    return {
      allowed: false,
      used: currentCount,
      limit: maxDailyCalls,
    };
  }

  const usage = await prisma.projectDailyUsage.upsert({
    where: {
      project_id_date_key: { project_id: projectId, date_key: dateKey },
    },
    create: {
      project_id: projectId,
      date_key: dateKey,
      count: 1,
    },
    update: {
      count: { increment: 1 },
    },
  });

  return {
    allowed: true,
    used: usage.count,
    limit: maxDailyCalls,
  };
}
