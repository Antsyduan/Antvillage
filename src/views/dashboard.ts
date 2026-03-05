/**
 * AntVillageMgr — 科技感儀表板
 * 清晰資訊層級、直覺服務說明、高可讀性
 */
export function dashboardHtml(baseUrl: string): string {
  const origin = new URL(baseUrl).origin;
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AntVillageMgr — AI 管理指揮中心</title>
  <link rel="stylesheet" href="/styles.css">
  <script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js" defer></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
  <style>
    body { background: var(--bg); }
    .stat-card { box-shadow: var(--shadow-sm); }
    .stat-card:hover { box-shadow: var(--shadow-md); }
  </style>
</head>
<body>
  <aside class="fixed left-0 top-0 w-56 h-screen flex flex-col bg-[#0f172a] text-white z-50 border-r border-slate-800/50 shadow-xl">
    <div class="p-5 border-b border-slate-700">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
          <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
        </div>
        <div>
          <h1 class="font-semibold text-sm">AntVillageMgr</h1>
          <p class="text-[11px] text-slate-400">AI 指揮中心</p>
        </div>
      </div>
    </div>
    <nav class="flex-1 p-3 overflow-y-auto">
      <div class="mb-4">
        <div class="px-3 mb-2">
          <span class="text-[10px] font-medium text-slate-500 uppercase tracking-wider">功能</span>
        </div>
        <div class="space-y-0.5">
          <a href="${origin}/" class="sidebar-link active">
            <i data-lucide="layout-grid" class="w-4 h-4 opacity-70"></i> 儀表板
          </a>
          <a href="${origin}/users" class="sidebar-link text-slate-300">
            <i data-lucide="users" class="w-4 h-4 opacity-70"></i> 使用者管理
          </a>
          <a href="${origin}/global-secrets" class="sidebar-link text-slate-300">
            <i data-lucide="key" class="w-4 h-4 opacity-70"></i> 全域 API 金鑰
          </a>
        </div>
      </div>
      <div class="mb-4">
        <div class="px-3 mb-2">
          <span class="text-[10px] font-medium text-slate-500 uppercase tracking-wider">開發工具</span>
        </div>
        <div class="space-y-0.5">
          <a href="${origin}/#sandbox" class="sidebar-link text-slate-300">
            <i data-lucide="shield-check" class="w-4 h-4 opacity-70"></i> 金鑰驗證
          </a>
        </div>
      </div>
      <div class="mb-4">
        <div class="px-3 mb-2">
          <span class="text-[10px] font-medium text-slate-500 uppercase tracking-wider">系統</span>
        </div>
        <div class="space-y-0.5">
          <a href="${origin}/#trust" class="sidebar-link text-slate-300">
            <i data-lucide="shield" class="w-4 h-4 opacity-70"></i> 信任與安全
          </a>
        </div>
      </div>
      <div class="pt-3 mt-3 border-t border-slate-700">
        <div class="px-3 mb-2">
          <span class="text-[10px] font-medium text-slate-500 uppercase tracking-wider">帳號</span>
        </div>
        <button type="button" id="btn-logout" class="w-full sidebar-link text-slate-400 text-left">
          <i data-lucide="log-out" class="w-4 h-4 opacity-70"></i> 登出
        </button>
      </div>
    </nav>
    <div class="p-3 border-t border-slate-700">
      <div class="px-3 py-2.5 rounded-lg bg-slate-700/50" title="目前使用的資料庫，支援未來遷移至 Azure SQL">
        <div class="flex items-center gap-2 mb-1">
          <i data-lucide="database" class="w-3.5 h-3.5 text-slate-500"></i>
          <span class="text-[10px] font-medium text-slate-500 uppercase tracking-wider">資料庫</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
          <span class="text-xs font-medium text-slate-300">Cloudflare D1</span>
        </div>
        <div class="text-[10px] text-slate-500 mt-1 ml-4">antvillagemgr</div>
      </div>
    </div>
  </aside>

  <main class="ml-56 min-h-screen p-6 lg:p-8">
    <!-- 頂部：快速統計 -->
    <header class="mb-8">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 class="text-xl font-bold text-[var(--text)]">儀表板</h2>
          <p class="text-sm text-[var(--muted)] mt-1">集中管理專案、金鑰與 AI 技能</p>
        </div>
        <a href="${origin}/demo/customer-service" class="px-4 py-2.5 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 hover:shadow-md transition-all duration-200">AI 智能客服 Demo</a>
      </div>
      <div id="stats-bar" class="flex gap-6 mt-6">
        <div class="stat-card">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <i data-lucide="folder" class="w-5 h-5 text-[var(--accent)]"></i>
          </div>
          <div>
            <div id="stat-projects" class="stat-value">—</div>
            <div class="stat-label">專案總數</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <i data-lucide="cpu" class="w-5 h-5 text-emerald-600"></i>
          </div>
          <div>
            <div id="stat-skills" class="stat-value">—</div>
            <div class="stat-label">AI 技能</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <i data-lucide="activity" class="w-5 h-5 text-amber-600"></i>
          </div>
          <div>
            <div id="stat-audit" class="stat-value">—</div>
            <div class="stat-label">近期紀錄</div>
          </div>
        </div>
      </div>
    </header>

    <!-- 專案清單 -->
    <section id="overview" class="mb-10 scroll-mt-6">
      <div class="flex items-baseline justify-between gap-4 mb-3">
        <div>
          <h3 class="text-base font-semibold text-[var(--text)]">專案清單</h3>
          <p class="section-desc mt-0.5">子網站或應用程式，每個專案有獨立金鑰與權限。點擊卡片進入詳情。</p>
        </div>
        <button type="button" id="btn-add-project" class="px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-blue-700 hover:shadow-md transition-all duration-200 flex items-center gap-2">
          <i data-lucide="plus" class="w-4 h-4"></i> 新增專案
        </button>
      </div>
      <div id="project-cards" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      </div>
    </section>

    <!-- 新增專案 Modal -->
    <div id="modal-add-project" class="hidden fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4">
      <div class="card w-full max-w-md p-6" onclick="event.stopPropagation()">
        <h3 class="text-lg font-semibold text-[var(--text)] mb-4">新增專案</h3>
        <form id="form-add-project" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[var(--text)] mb-1.5">專案名稱</label>
            <input type="text" name="name" required class="input-base" placeholder="例如：電商整合平台">
          </div>
          <div>
            <label class="block text-sm font-medium text-[var(--text)] mb-1.5">描述（選填）</label>
            <textarea name="description" rows="3" class="input-base" placeholder="簡述專案用途"></textarea>
          </div>
          <div id="add-project-error" class="hidden text-sm text-red-600"></div>
          <div class="flex gap-3 pt-2">
            <button type="button" id="btn-cancel-add-project" class="btn-secondary flex-1">取消</button>
            <button type="submit" id="btn-submit-project" class="btn-primary flex-1">建立</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 金鑰驗證：調用 AI 的第一步 -->
    <section id="sandbox" class="mb-10 scroll-mt-6">
      <div class="mb-3">
        <h3 class="text-base font-semibold text-[var(--text)]">金鑰驗證</h3>
        <p class="section-desc mt-0.5">子網站調用 <code class="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">/v1/ai/execute</code> 前，需先確認 3rdPKey 有效。此步驟模擬 <code class="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">/v1/auth/verify</code>，驗證通過後即可安全呼叫 AI Skill。</p>
      </div>
      <div class="card p-6 mt-4">
        <div class="flex flex-wrap gap-4 items-end mb-4">
          <div class="min-w-[180px]">
            <label class="block text-sm font-medium text-[var(--text)] mb-1.5">快速選擇專案</label>
            <select id="sandbox-project" class="input-base">
              <option value="">— 手動輸入金鑰 —</option>
            </select>
          </div>
          <div class="flex-1 min-w-[220px]">
            <label class="block text-sm font-medium text-[var(--text)] mb-1.5">專案金鑰 (3rdPKey)</label>
            <input type="text" id="sandbox-key" class="input-base" placeholder="輸入或從上方選擇專案自動填入">
          </div>
          <button id="sandbox-test" class="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-blue-700 hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <i data-lucide="shield-check" class="w-4 h-4"></i> 驗證金鑰
          </button>
        </div>
        <div class="flex flex-wrap gap-2 items-center py-3 border-y border-[var(--border)] mb-4">
          <span class="flow-step text-xs px-3 py-1.5 rounded-full font-medium" data-step="0">1. 子網站發送</span>
          <span class="text-[var(--muted)]">→</span>
          <span class="flow-step text-xs px-3 py-1.5 rounded-full bg-slate-100 text-[var(--muted)]" data-step="1">2. 中台驗證</span>
          <span class="text-[var(--muted)]">→</span>
          <span class="flow-step text-xs px-3 py-1.5 rounded-full bg-slate-100 text-[var(--muted)]" data-step="2">3. D1 查詢</span>
          <span class="text-[var(--muted)]">→</span>
          <span class="flow-step text-xs px-3 py-1.5 rounded-full bg-slate-100 text-[var(--muted)]" data-step="3">4. 回傳結果</span>
        </div>
        <div id="sandbox-result-area">
          <div id="sandbox-result-placeholder" class="py-8 text-center text-sm text-[var(--muted)]">選擇專案或輸入金鑰後，點擊「驗證金鑰」</div>
          <div id="sandbox-result-success" class="hidden p-5 rounded-lg border border-emerald-200 bg-emerald-50">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <i data-lucide="check-circle" class="w-5 h-5 text-emerald-600"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-emerald-800">金鑰有效</div>
                <div id="sandbox-success-detail" class="text-sm text-emerald-700 mt-1"></div>
                <a id="sandbox-next-link" href="#" class="inline-flex items-center gap-2 mt-3 text-sm font-medium text-[var(--accent)] hover:underline">
                  <i data-lucide="arrow-right" class="w-4 h-4"></i> 前往專案詳情取得開發者代碼
                </a>
              </div>
            </div>
          </div>
          <div id="sandbox-result-fail" class="hidden p-5 rounded-lg border border-red-200 bg-red-50">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <i data-lucide="x-circle" class="w-5 h-5 text-red-600"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-red-800">驗證失敗</div>
                <div id="sandbox-fail-detail" class="text-sm text-red-700 mt-1"></div>
                <p class="text-xs text-red-600 mt-2">可能原因：金鑰錯誤、專案已停用、或專案不存在</p>
              </div>
            </div>
          </div>
          <details id="sandbox-result-raw" class="hidden mt-4">
            <summary class="text-xs text-[var(--muted)] cursor-pointer hover:text-[var(--text)]">檢視原始 API 回應</summary>
            <pre id="sandbox-result-json" class="font-mono p-4 mt-2 rounded-lg bg-slate-900 text-slate-200 text-[12px] overflow-x-auto mt-2"></pre>
          </details>
        </div>
      </div>
    </section>

    <!-- 信任與安全中心 -->
    <section id="trust" class="mb-10 scroll-mt-6">
      <div class="mb-3">
        <h3 class="text-base font-semibold text-[var(--text)]">信任與安全中心 (Trust & Security Hub)</h3>
        <p class="section-desc mt-0.5">數據一致性檢核、AI Skills 文檔生成、API 熔斷監控。</p>
      </div>
      <div class="card p-6 mt-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl border border-[var(--border)]">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <i data-lucide="key" class="w-5 h-5 text-amber-600"></i>
              </div>
              <div>
                <div class="font-medium text-[var(--text)]">金鑰一致性檢核</div>
                <div class="text-xs text-[var(--muted)]">檢查 SecretVault 是否可解密</div>
              </div>
            </div>
            <button type="button" id="trust-check-btn" class="mt-2 w-full px-3 py-2 rounded-lg bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 transition">執行檢核</button>
            <div id="trust-check-result" class="mt-2 text-xs hidden"></div>
          </div>
          <div class="p-4 rounded-xl border border-[var(--border)]">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <i data-lucide="file-text" class="w-5 h-5 text-blue-600"></i>
              </div>
              <div>
                <div class="font-medium text-[var(--text)]">Skills 文檔</div>
                <div class="text-xs text-[var(--muted)]">自動產生 HTML 文檔</div>
              </div>
            </div>
            <a href="#" id="trust-doc-link" target="_blank" class="mt-2 block w-full px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition text-center">下載文檔</a>
          </div>
          <div class="p-4 rounded-xl border border-[var(--border)]">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <i data-lucide="zap-off" class="w-5 h-5 text-emerald-600"></i>
              </div>
              <div>
                <div class="font-medium text-[var(--text)]">API 熔斷</div>
                <div class="text-xs text-[var(--muted)]">100 次/分鐘 · 超限自動阻斷</div>
              </div>
            </div>
            <p class="mt-2 text-xs text-[var(--muted)]">超限時會記錄 RATE_LIMIT_EXCEEDED 至操作紀錄</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 全域審計看板 -->
    <section id="audit-global" class="mb-10 scroll-mt-6">
      <div class="mb-3">
        <h3 class="text-base font-semibold text-[var(--text)]">全域審計看板</h3>
        <p class="section-desc mt-0.5">所有專案的 AI 調用時間軸、錯誤追蹤與調用次數統計，協助監控 Gemini API 消耗。</p>
      </div>
      <div class="card overflow-hidden mt-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-0">
          <div class="lg:col-span-2 p-5 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium text-[var(--text)]">調用時間軸</span>
              <span id="audit-global-count" class="text-xs text-[var(--muted)]">— 筆</span>
            </div>
            <div id="audit-global-timeline" class="space-y-2 max-h-[320px] overflow-y-auto">
            </div>
          </div>
          <div class="p-5">
            <div class="text-sm font-medium text-[var(--text)] mb-4">各專案調用次數</div>
            <div id="audit-global-stats" class="space-y-3">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AI 技能 + 操作紀錄 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section id="skills" class="scroll-mt-6">
        <div class="mb-3">
          <h3 class="text-base font-semibold text-[var(--text)]">AI 技能庫</h3>
          <p class="section-desc mt-0.5">各專案可調用的 AI 能力，含 System Prompt 與 Input/Output Schema。已驗證的 Skill 可正式對外提供。</p>
        </div>
        <div id="skill-list" class="space-y-3 mt-4">
        </div>
      </section>
      <section id="audit" class="scroll-mt-6">
        <div class="mb-3">
          <h3 class="text-base font-semibold text-[var(--text)]">操作紀錄</h3>
          <p class="section-desc mt-0.5">API 呼叫、金鑰存取、Skill 異動等操作軌跡，確保可追溯。</p>
        </div>
        <div id="audit-timeline" class="card overflow-hidden mt-4">
        </div>
      </section>
    </div>
  </main>

  <script>
    const ORIGIN = '${origin}';
    const fetchOpts = { credentials: 'include' };
    async function api(path) {
      const res = await fetch(ORIGIN + path, fetchOpts);
      if (res.status === 401) { window.location.href = ORIGIN + '/login'; return null; }
      return res;
    }
    let PROJECTS_CACHE = [];
    async function loadProjects() {
      const res = await api('/api/projects');
      if (!res) return;
      let projects = [];
      try {
        const json = await res.json();
        if (!res.ok) {
          document.getElementById('project-cards').innerHTML = '<p class="p-8 text-center text-red-600">載入專案失敗：' + (json.message || res.status) + '</p>';
          return;
        }
        projects = json.data || [];
      } catch (e) {
        document.getElementById('project-cards').innerHTML = '<p class="p-8 text-center text-red-600">回應解析失敗，請檢查 API 是否正常</p>';
        return;
      }
      PROJECTS_CACHE = projects;
      const el = document.getElementById('project-cards');
      const quotaIcon = (q) => {
        if (q == null) return '';
        const pct = Math.round(q);
        const color = pct > 50 ? '#22c55e' : pct > 20 ? '#f59e0b' : '#ef4444';
        return \`<span class="inline-flex items-center gap-1" title="配額剩餘 \${pct}%">
          <span class="w-8 h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <span class="block h-full rounded-full transition-all" style="width:\${pct}%;background:\${color}"></span>
          </span>
          <span class="text-[10px] text-[var(--muted)]">\${pct}%</span>
        </span>\`;
      };
      el.innerHTML = projects.map(p => \`
        <a href="\${ORIGIN}/projects/\${p.id}" class="card block p-5 hover:border-[var(--accent)]/40 hover:shadow-[var(--shadow-card-hover)] transition-all duration-200 group">
          <div class="flex justify-between items-start mb-3">
            <h4 class="font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition">\${p.name}</h4>
            <span class="text-xs font-medium px-2 py-0.5 rounded-full \${p.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}">\${p.status === 'active' ? '線上' : '停用'}</span>
          </div>
          <p class="text-sm text-[var(--muted)] mb-3 line-clamp-2">\${p.description || '無描述'}</p>
          \${(p.quota?.calls_limit != null || p.quota?.token_limit != null) ? \`<div class="flex items-center gap-3 mb-3 text-[10px]">
            \${p.quota?.token_limit != null ? \`<span title="Token 額度">\${quotaIcon(p.quota.token_remaining_pct)}</span>\` : ''}
            \${p.quota?.calls_limit != null ? \`<span title="調用額度">\${quotaIcon(p.quota.calls_remaining_pct)}</span>\` : ''}
          </div>\` : ''}
          <div class="flex items-center justify-between text-xs">
            <button data-key="\${(p.third_party_key || '').replace(/"/g, '&quot;')}" onclick="event.preventDefault();event.stopPropagation();" class="copy-key text-[var(--accent)] font-medium hover:underline">複製金鑰</button>
            <span class="text-[var(--muted)]">\${p._count?.users || 0} 人 · \${p._count?.skills || 0} 技能</span>
          </div>
        </a>
      \`).join('');
      document.querySelectorAll('.copy-key').forEach(btn => {
        btn.addEventListener('click', () => {
          const k = btn.getAttribute('data-key');
          if (k) navigator.clipboard.writeText(k).then(() => { btn.textContent = '已複製'; });
        });
      });
      document.getElementById('stat-projects').textContent = projects.length;
      const sel = document.getElementById('sandbox-project');
      sel.innerHTML = '<option value="">— 手動輸入金鑰 —</option>' + projects.map(p => \`<option value="\${p.id}">\${p.name}</option>\`).join('');
      sel.onchange = () => {
        const id = sel.value;
        const p = PROJECTS_CACHE.find(x => x.id === id);
        if (p?.third_party_key) document.getElementById('sandbox-key').value = p.third_party_key;
      };
    }

    async function loadSkills() {
      const res = await api('/api/skills');
      if (!res) return;
      const { data } = await res.json();
      const skills = data || [];
      const el = document.getElementById('skill-list');
      el.innerHTML = skills.map(s => \`
        <div class="card p-4 \${s.is_verified ? '' : 'opacity-90'}">
          <div class="flex items-start gap-3">
            <span class="text-xs font-medium px-2 py-0.5 rounded \${s.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'} mt-0.5">\${s.is_verified ? '已驗證' : '草稿'}</span>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-[var(--text)]">\${s.name}</div>
              <div class="text-xs text-[var(--muted)] mt-0.5">\${s.project?.name || '-'} · v\${s.version}</div>
              <details class="mt-2">
                <summary class="text-xs text-[var(--accent)] cursor-pointer hover:underline">檢視 Input Schema</summary>
                <pre class="mt-2 p-3 rounded bg-slate-50 font-mono text-[11px] overflow-x-auto border border-[var(--border)]">\${(s.input_schema || '{}').substring(0,120)}...</pre>
              </details>
            </div>
          </div>
        </div>
      \`).join('');
      document.getElementById('stat-skills').textContent = skills.length;
    }

    async function loadAudit() {
      const res = await api('/api/audit');
      if (!res) return;
      const { data } = await res.json();
      const logs = data || [];
      const el = document.getElementById('audit-timeline');
      el.innerHTML = '<div class="grid grid-cols-[1fr_1fr_auto] gap-4 px-5 py-3 bg-slate-50 border-b border-[var(--border)] text-xs font-medium text-[var(--muted)] uppercase tracking-wider"><span>操作</span><span>專案</span><span>時間</span></div>' + logs.slice(0, 8).map(l => \`
        <div class="grid grid-cols-[1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[var(--border)] last:border-0 hover:bg-slate-50/50 text-sm">
          <span class="font-medium text-[var(--text)]">\${l.action}</span>
          <span class="text-[var(--muted)] truncate">\${l.project?.name || '-'}</span>
          <span class="text-xs text-[var(--muted)] whitespace-nowrap">\${new Date(l.timestamp).toLocaleString('zh-TW', {month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})}</span>
        </div>
      \`).join('');
      document.getElementById('stat-audit').textContent = logs.length;
    }

    async function loadAuditGlobal() {
      const [logsRes, statsRes] = await Promise.all([
        api('/api/audit'),
        api('/api/audit/stats')
      ]);
      if (!logsRes || !statsRes) return;
      const { data: logs } = await logsRes.json();
      const { data: stats } = await statsRes.json();
      const timelineEl = document.getElementById('audit-global-timeline');
      const statsEl = document.getElementById('audit-global-stats');
      const countEl = document.getElementById('audit-global-count');
      const isError = (a) => /ERROR|FAILED/i.test(a || '');
      const actionLabel = (a) => ({ EXECUTE_AI: 'AI 調用', TEST_SKILL: '沙盒測試', EXECUTE_AI_ERROR: 'AI 調用失敗', TEST_SKILL_ERROR: '沙盒失敗', CREATE_SKILL: '新增 Skill', CREATE_SECRET: '新增金鑰', CREATE_PROJECT: '新增專案', RATE_LIMIT_EXCEEDED: '熔斷觸發', INJECT_SKILL: 'Skill 注入', CREATE_USER: '新增使用者', UPDATE_PERMISSIONS: '更新權限' }[a] || a);
      const formatPayload = (action, payloadStr) => {
        try {
          const p = payloadStr ? JSON.parse(payloadStr) : {};
          if (p.error) return p.error;
          if (action === 'UPDATE_PERMISSIONS') {
            const who = p.target_user_name || p.target_user_email || '未知使用者';
            const perms = (p.permissions || []).map(x => \`\${x.project_name || x.project_id} (\${x.role})\`).join('、');
            if (perms) return \`\${who}：\${perms}\`;
            if (p.count != null) return \`\${who}：\${p.count} 個專案\`;
            return who;
          }
          if (action === 'CREATE_USER' && p.email) return p.email;
          if (action === 'CREATE_PROJECT' && p.name) return p.name;
          if (action === 'CREATE_SKILL' && p.skill_name) return p.skill_name;
          if (action === 'CREATE_SECRET' && p.key_name) return p.key_name;
          return '';
        } catch(e) { return ''; }
      };
      timelineEl.innerHTML = (logs || []).slice(0, 50).map(l => {
        const err = isError(l.action);
        const payload = formatPayload(l.action, l.payload);
        const subText = l.action === 'UPDATE_PERMISSIONS' ? payload : (l.project?.name || '—') + (payload ? ' · ' + payload : '');
        return \`<div class="flex items-start gap-3 py-2 px-3 rounded-lg \${err ? 'bg-red-50 border border-red-200' : 'hover:bg-slate-50'}">
          <div class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 \${err ? 'bg-red-500' : 'bg-emerald-500'}"></div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium \${err ? 'text-red-700' : 'text-[var(--text)]'}">\${actionLabel(l.action)}</div>
            <div class="text-xs text-[var(--muted)] mt-0.5">\${subText || '—'}</div>
          </div>
          <span class="text-xs text-[var(--muted)] whitespace-nowrap">\${new Date(l.timestamp).toLocaleString('zh-TW', {month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})}</span>
        </div>\`;
      }).join('');
      countEl.textContent = (logs || []).length + ' 筆';
      const statsArr = stats ? Object.entries(stats) : [];
      statsEl.innerHTML = statsArr.length ? statsArr.map(([id, v]) => \`
        <div class="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0">
          <span class="text-sm text-[var(--text)] truncate">\${v.name}</span>
          <span class="text-sm font-medium text-[var(--accent)] ml-2">\${v.count} 次</span>
        </div>
      \`).join('') : '<p class="text-sm text-[var(--muted)]">尚無 AI 調用紀錄</p>';
    }

    document.getElementById('sandbox-test').onclick = async () => {
      const key = document.getElementById('sandbox-key').value?.trim();
      if (!key) return;
      const placeholder = document.getElementById('sandbox-result-placeholder');
      const successEl = document.getElementById('sandbox-result-success');
      const failEl = document.getElementById('sandbox-result-fail');
      const rawEl = document.getElementById('sandbox-result-raw');
      const jsonEl = document.getElementById('sandbox-result-json');
      placeholder.classList.add('hidden');
      successEl.classList.add('hidden');
      failEl.classList.add('hidden');
      rawEl.classList.add('hidden');
      const steps = document.querySelectorAll('[data-step]');
      steps.forEach((s,i) => { s.className = 'flow-step text-xs px-3 py-1.5 rounded-full font-medium ' + (i===0 ? 'bg-[var(--accent)] text-white' : 'bg-slate-100 text-[var(--muted)]'); });
      for (let i = 1; i <= 4; i++) {
        await new Promise(r => setTimeout(r, 220));
        steps.forEach((s,j) => { s.className = 'flow-step text-xs px-3 py-1.5 rounded-full font-medium ' + (j<=i ? 'bg-[var(--accent)] text-white' : 'bg-slate-100 text-[var(--muted)]'); });
      }
      try {
        const res = await fetch(ORIGIN + '/v1/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project_key: key }),
          credentials: 'include'
        });
        const json = await res.json();
        jsonEl.textContent = JSON.stringify(json, null, 2);
        rawEl.classList.remove('hidden');
        if (json.success && json.data?.valid && json.data?.project) {
          const p = json.data.project;
          const cached = PROJECTS_CACHE.find(x => x.id === p.id);
          const skillCount = cached?._count?.skills ?? cached?.skills?.length ?? '—';
          document.getElementById('sandbox-success-detail').innerHTML = \`<strong>\${p.name}</strong> · 狀態 \${p.status === 'active' ? '線上' : '停用'} · 可調用約 \${skillCount} 個 AI Skill\`;
          const link = document.getElementById('sandbox-next-link');
          link.href = ORIGIN + '/projects/' + p.id + '#dev-code';
          successEl.classList.remove('hidden');
        } else {
          document.getElementById('sandbox-fail-detail').textContent = json.message || json.code || '金鑰無效';
          failEl.classList.remove('hidden');
        }
      } catch (e) {
        document.getElementById('sandbox-fail-detail').textContent = e.message || '連線失敗';
        failEl.classList.remove('hidden');
        jsonEl.textContent = 'Error: ' + e.message;
        rawEl.classList.remove('hidden');
      }
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    };

    document.getElementById('btn-add-project').onclick = () => {
      document.getElementById('modal-add-project').classList.remove('hidden');
      document.getElementById('add-project-error').classList.add('hidden');
      document.getElementById('form-add-project').reset();
    };
    document.getElementById('btn-cancel-add-project').onclick = () => {
      document.getElementById('modal-add-project').classList.add('hidden');
    };
    document.getElementById('modal-add-project').onclick = (e) => {
      if (e.target.id === 'modal-add-project') document.getElementById('modal-add-project').classList.add('hidden');
    };
    document.getElementById('form-add-project').onsubmit = async (e) => {
      e.preventDefault();
      const form = e.target;
      const name = form.name.value?.trim();
      const description = form.description.value?.trim();
      const errEl = document.getElementById('add-project-error');
      const btnEl = document.getElementById('btn-submit-project');
      errEl.classList.add('hidden');
      btnEl.disabled = true;
      try {
        const res = await fetch(ORIGIN + '/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description }),
          credentials: 'include'
        });
        const text = await res.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch {
          errEl.textContent = '伺服器錯誤: ' + (text?.slice(0, 80) || res.status);
          errEl.classList.remove('hidden');
          btnEl.disabled = false;
          return;
        }
        if (json.success) {
          document.getElementById('modal-add-project').classList.add('hidden');
          await loadProjects();
        } else {
          errEl.textContent = json.message || '建立失敗';
          errEl.classList.remove('hidden');
        }
      } catch (err) {
        errEl.textContent = '請求失敗: ' + (err.message || err);
        errEl.classList.remove('hidden');
      }
      btnEl.disabled = false;
    };

    document.getElementById('trust-doc-link').href = ORIGIN + '/api/trust/skills-doc';
    document.getElementById('trust-check-btn').onclick = async () => {
      const btn = document.getElementById('trust-check-btn');
      const result = document.getElementById('trust-check-result');
      btn.disabled = true;
      result.classList.add('hidden');
      try {
        const res = await api('/api/trust/check-secrets');
        if (!res) return;
        const json = await res.json();
        result.classList.remove('hidden');
        if (json.success && json.data) {
          const d = json.data;
          if (d.failed > 0) {
            result.className = 'mt-2 text-xs text-red-600 font-medium';
            result.textContent = d.alert || (d.failed + ' 筆金鑰損壞');
          } else {
            result.className = 'mt-2 text-xs text-emerald-600';
            result.textContent = '全部 ' + d.total + ' 筆金鑰檢核通過';
          }
        } else {
          result.className = 'mt-2 text-xs text-red-600';
          result.textContent = json.message || '檢核失敗';
        }
      } catch (e) {
        result.classList.remove('hidden');
        result.className = 'mt-2 text-xs text-red-600';
        result.textContent = '請求失敗: ' + (e.message || e);
      }
      btn.disabled = false;
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    };

    document.getElementById('btn-logout').onclick = () => {
      fetch(ORIGIN + '/api/auth/logout', { method: 'POST', credentials: 'include' }).then(() => { location.href = ORIGIN + '/login'; });
    };
    document.addEventListener('DOMContentLoaded', function() {
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
      loadProjects(); loadSkills(); loadAudit(); loadAuditGlobal();
    });
  </script>
</body>
</html>`;
}
