/**
 * Dashboard API Controllers
 */
import type { Context } from "hono";
import type { HonoEnv } from "../types";
import { getPrisma } from "../lib/db";

function getDateKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export async function listProjects(c: Context<HonoEnv>): Promise<Response> {
  try {
    const prisma = getPrisma(c.env.DB);
    const projects = await prisma.project.findMany({
      orderBy: { created_at: "desc" },
      include: {
        _count: { select: { users: true, skills: true } },
      },
    });

    const dateKey = getDateKey();
    const usages = await prisma.projectDailyUsage.findMany({
      where: {
        project_id: { in: projects.map((p) => p.id) },
        date_key: dateKey,
      },
    });
    const usageByProject = Object.fromEntries(
      usages.map((u) => [u.project_id, u])
    );

    const data = projects.map((p) => {
      const usage = usageByProject[p.id];
      const callsUsed = usage?.count ?? 0;
      const tokensUsed = usage?.token_count ?? 0;
      const callsLimit = p.max_daily_calls ?? null;
      const tokenLimit = p.daily_token_limit ?? null;

      const callsRemainingPct =
        callsLimit != null && callsLimit > 0
          ? Math.max(0, 100 - (callsUsed / callsLimit) * 100)
          : null;
      const tokenRemainingPct =
        tokenLimit != null && tokenLimit > 0
          ? Math.max(0, 100 - (tokensUsed / tokenLimit) * 100)
          : null;

      return {
        ...p,
        quota: {
          calls_used: callsUsed,
          calls_limit: callsLimit,
          calls_remaining_pct: callsRemainingPct,
          tokens_used: tokensUsed,
          token_limit: tokenLimit,
          token_remaining_pct: tokenRemainingPct,
        },
      };
    });

    return c.json({ success: true, data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return c.json(
      { success: false, code: "DB_ERROR", message: "載入專案失敗：" + msg },
      500
    );
  }
}

export async function listSkills(c: Context<HonoEnv>): Promise<Response> {
  const prisma = getPrisma(c.env.DB);
  const skills = await prisma.aiSkill.findMany({
    orderBy: { created_at: "desc" },
    include: {
      project: { select: { name: true } },
    },
  });
  return c.json({ success: true, data: skills });
}

export async function listAuditLogs(c: Context<HonoEnv>): Promise<Response> {
  const prisma = getPrisma(c.env.DB);
  const logs = await prisma.auditLog.findMany({
    orderBy: { timestamp: "desc" },
    take: 100,
    include: {
      project: { select: { name: true, id: true } },
      user: { select: { email: true, name: true } },
    },
  });
  return c.json({ success: true, data: logs });
}

/** 各專案 AI 調用次數統計（EXECUTE_AI + TEST_SKILL） */
export async function listAuditStats(c: Context<HonoEnv>): Promise<Response> {
  const prisma = getPrisma(c.env.DB);
  const rows = await prisma.auditLog.groupBy({
    by: ["project_id"],
    where: {
      action: { in: ["EXECUTE_AI", "TEST_SKILL"] },
      project_id: { not: null },
    },
    _count: { id: true },
  });
  const projectIds = rows.map((r) => r.project_id).filter(Boolean) as string[];
  const projects =
    projectIds.length > 0
      ? await prisma.project.findMany({
          where: { id: { in: projectIds } },
          select: { id: true, name: true },
        })
      : [];
  const byProject: Record<string, { name: string; count: number }> = {};
  for (const r of rows) {
    if (r.project_id) {
      const p = projects.find((x) => x.id === r.project_id);
      byProject[r.project_id] = {
        name: p?.name ?? "未知專案",
        count: r._count.id,
      };
    }
  }
  return c.json({ success: true, data: byProject });
}
