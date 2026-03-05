/**
 * Skills 作用域：僅被授權的專案可調用
 * 專案可調用：1) 自己建立的 Skill  2) 在 ProjectSkillMap 中被授權的 Skill
 * 版本控管：skillVersion 未指定時，取 is_active 版本；指定時依版本篩選
 */
import type { PrismaClient } from "@prisma/client";

export async function findAllowedSkill(
  prisma: PrismaClient,
  callerProjectId: string,
  skillIdOrName: string,
  skillVersion?: string
) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    skillIdOrName
  );

  const baseWhere = {
    ...(isUuid ? { id: skillIdOrName } : { name: skillIdOrName }),
    is_verified: true,
  };

  // 若指定版本，加入版本篩選
  const where = skillVersion
    ? { ...baseWhere, version: skillVersion }
    : baseWhere;

  const skills = await prisma.aiSkill.findMany({
    where,
    orderBy: [{ is_active: "desc" }, { updated_at: "desc" }],
    take: 20,
  });

  for (const skill of skills) {
    const isOwner = skill.project_id === callerProjectId;
    if (isOwner) return skill;

    const grant = await prisma.projectSkillMap.findUnique({
      where: {
        project_id_skill_id: {
          project_id: callerProjectId,
          skill_id: skill.id,
        },
      },
    });
    if (grant) return skill;
  }

  return null;
}
