/**
 * 多租戶配額控管：依 Project 限制每分鐘調用次數
 */
import type { PrismaClient } from "@prisma/client";

const DEFAULT_QUOTA = 100;

function getWindowKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}T${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

export async function checkAndIncrement(
  prisma: PrismaClient,
  projectId: string,
  quotaLimit?: number | null
): Promise<{ allowed: boolean; count: number; limit: number }> {
  const limit = quotaLimit ?? DEFAULT_QUOTA;
  const windowKey = getWindowKey();

  const bucket = await prisma.rateLimitBucket.upsert({
    where: {
      project_id_window_key: { project_id: projectId, window_key: windowKey },
    },
    create: {
      project_id: projectId,
      window_key: windowKey,
      count: 1,
    },
    update: {
      count: { increment: 1 },
    },
  });

  return {
    allowed: bucket.count <= limit,
    count: bucket.count,
    limit,
  };
}
