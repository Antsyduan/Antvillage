/**
 * Permission Repository
 * 查詢使用者在專案中的權限
 */
import type { PrismaClient } from "@prisma/client";

export async function findByProjectAndUser(
  prisma: PrismaClient,
  projectId: string,
  userId: string
) {
  return prisma.permission.findUnique({
    where: {
      project_id_user_id: { project_id: projectId, user_id: userId },
    },
    select: {
      id: true,
      role: true,
      scopes: true,
    },
  });
}

export async function listByProject(
  prisma: PrismaClient,
  projectId: string
) {
  return prisma.permission.findMany({
    where: { project_id: projectId },
    include: {
      user: {
        select: { id: true, email: true, name: true },
      },
    },
  });
}
