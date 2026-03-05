/**
 * Trust & Security Hub
 * 數據一致性檢核、文檔生成
 */
import type { Context } from "hono";
import type { HonoEnv } from "../types";
import { getPrisma } from "../lib/db";
import { decrypt } from "../utils/crypto";

/** 檢查 SecretVault 中所有金鑰是否可成功解密 */
export async function checkSecrets(c: Context<HonoEnv>): Promise<Response> {
  const masterKey = c.env.MASTER_KEY;
  if (!masterKey?.trim()) {
    return c.json(
      {
        success: false,
        code: "MASTER_KEY_NOT_CONFIGURED",
        message: "未設定 MASTER_KEY，無法執行檢核",
      },
      503
    );
  }

  const prisma = getPrisma(c.env.DB);
  const secrets = await prisma.secretVault.findMany({
    include: { project: { select: { name: true } } },
  });

  const results: Array<{
    id: string;
    project_id: string;
    project_name: string;
    key_name: string;
    ok: boolean;
    error?: string;
  }> = [];

  for (const s of secrets) {
    try {
      await decrypt(
        {
          encryptedData: s.encrypted_data,
          iv: s.iv,
          authTag: s.auth_tag,
        },
        masterKey
      );
      results.push({
        id: s.id,
        project_id: s.project_id,
        project_name: s.project?.name ?? "—",
        key_name: s.key_name,
        ok: true,
      });
    } catch (err) {
      results.push({
        id: s.id,
        project_id: s.project_id,
        project_name: s.project?.name ?? "—",
        key_name: s.key_name,
        ok: false,
        error: err instanceof Error ? err.message : "解密失敗",
      });
    }
  }

  const failed = results.filter((r) => !r.ok);
  return c.json({
    success: true,
    data: {
      total: results.length,
      ok: results.length - failed.length,
      failed: failed.length,
      results,
      alert: failed.length > 0 ? `發現 ${failed.length} 筆金鑰損壞，請立即處理` : null,
    },
  });
}

/** 自動產生 AI Skills 文檔 (HTML) */
export async function skillsDoc(c: Context<HonoEnv>): Promise<Response> {
  const prisma = getPrisma(c.env.DB);
  const skills = await prisma.aiSkill.findMany({
    orderBy: [{ project_id: "asc" }, { name: "asc" }],
    include: {
      project: { select: { name: true } },
    },
  });

  const byProject = new Map<string, typeof skills>();
  for (const s of skills) {
    const list = byProject.get(s.project_id) ?? [];
    list.push(s);
    byProject.set(s.project_id, list);
  }

  const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AI Skills 文檔 — AntVillageMgr</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
  <style>
    * { font-family: 'Inter', system-ui, sans-serif; box-sizing: border-box; }
    body { background: #f8fafc; color: #0f172a; margin: 0; padding: 2rem; line-height: 1.6; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
    h1 { font-size: 1.75rem; margin-bottom: 0.5rem; }
    .subtitle { color: #64748b; font-size: 0.875rem; margin-bottom: 2rem; }
    section { margin-bottom: 2.5rem; }
    h2 { font-size: 1.25rem; color: #1e293b; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #3b82f6; }
    .skill-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .skill-name { font-weight: 600; font-size: 1rem; }
    .skill-meta { font-size: 0.75rem; color: #64748b; margin-top: 0.25rem; }
    .skill-prompt { background: #f1f5f9; padding: 0.75rem; border-radius: 8px; font-size: 0.8125rem; margin-top: 0.75rem; white-space: pre-wrap; }
    .schema-block { background: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 8px; font-size: 0.75rem; overflow-x: auto; margin-top: 0.5rem; }
    .badge { display: inline-block; font-size: 0.6875rem; padding: 0.2rem 0.5rem; border-radius: 4px; margin-left: 0.5rem; }
    .badge-verified { background: #dcfce7; color: #166534; }
    .badge-draft { background: #f1f5f9; color: #475569; }
    @media print { body { padding: 1rem; } .skill-card { break-inside: avoid; } }
  </style>
</head>
<body>
  <h1>AI Skills 文檔</h1>
  <p class="subtitle">AntVillageMgr 中台 · 自動產生於 ${new Date().toISOString().slice(0, 19).replace("T", " ")}</p>

  ${Array.from(byProject.entries())
    .map(
      ([projectId, list]) => `
  <section>
    <h2>${list[0]?.project?.name ?? "未知專案"} (${list.length} 個 Skill)</h2>
    ${list
      .map(
        (s) => `
    <div class="skill-card">
      <div class="skill-name">${s.name} <span class="badge ${s.is_verified ? "badge-verified" : "badge-draft"}">${s.is_verified ? "已驗證" : "草稿"}</span></div>
      <div class="skill-meta">ID: ${s.id} · v${s.version}</div>
      <div style="margin-top: 0.75rem;"><strong>System Prompt</strong></div>
      <div class="skill-prompt">${escapeHtml(s.system_prompt)}</div>
      <div style="margin-top: 0.75rem;"><strong>Input Schema</strong></div>
      <pre class="schema-block font-mono">${escapeHtml(formatJson(s.input_schema))}</pre>
      ${s.output_schema ? `<div style="margin-top: 0.75rem;"><strong>Output Schema</strong></div><pre class="schema-block font-mono">${escapeHtml(formatJson(s.output_schema))}</pre>` : ""}
    </div>`
      )
      .join("")}
  </section>`
    )
    .join("")}

  <p class="subtitle" style="margin-top: 2rem;">此文件由 AntVillageMgr 自動產生，請勿手動編輯。</p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": 'inline; filename="ai-skills-doc.html"',
    },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatJson(s: string): string {
  try {
    return JSON.stringify(JSON.parse(s), null, 2);
  } catch {
    return s;
  }
}
