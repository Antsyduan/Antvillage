/**
 * 專案詳情頁 — 科技感儀表板風格
 */
export function projectDetailHtml(_baseUrl: string, projectId: string): string {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>專案詳情 — AntVillageMgr</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/icon-180.png" sizes="180x180">
  <link rel="manifest" href="/manifest.json">
  <meta name="apple-mobile-web-app-title" content="AntVillageMgr">
  <meta name="theme-color" content="#0ea5e9">
  <link rel="stylesheet" href="/styles.css">
  <script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js" defer></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
  <style>
    body { background: var(--bg); font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; -webkit-text-size-adjust: 100%; }
    @media (max-width: 767px) { body { font-size: 16px; line-height: 1.6; } }
  </style>
</head>
<body>
  <header class="app-mobile-header md:hidden" aria-hidden="true">
    <button type="button" id="btn-sidebar-toggle" class="p-2.5 -ml-2 rounded-lg text-white/90 hover:bg-white/10 transition" aria-label="開啟選單">
      <i data-lucide="menu" class="w-6 h-6"></i>
    </button>
    <div class="flex items-center gap-2">
      <img src="/logo.svg" alt="" class="w-7 h-7 rounded-lg" width="28" height="28">
      <h1 class="font-semibold">AntVillageMgr</h1>
    </div>
    <span class="w-10"></span>
  </header>
  <div id="sidebar-overlay" class="app-sidebar-overlay" aria-hidden="true"></div>
  <aside id="app-sidebar" class="app-sidebar fixed left-0 top-0 w-56 h-screen flex flex-col bg-[#0f172a] text-white z-50 border-r border-slate-800/50 shadow-xl">
    <div class="p-5 border-b border-slate-700">
      <div class="flex items-center gap-2">
        <img src="/logo.svg" alt="AntVillageMgr" class="w-8 h-8 rounded-lg flex-shrink-0" width="32" height="32">
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
          <a href="/" class="sidebar-link text-slate-300">
            <i data-lucide="layout-grid" class="w-4 h-4 opacity-70"></i> 儀表板
          </a>
          <a href="/users" class="sidebar-link text-slate-300">
            <i data-lucide="users" class="w-4 h-4 opacity-70"></i> 使用者管理
          </a>
          <a href="/global-secrets" class="sidebar-link text-slate-300">
            <i data-lucide="key" class="w-4 h-4 opacity-70"></i> 全域 API 金鑰
          </a>
        </div>
      </div>
      <div class="mb-4">
        <div class="px-3 mb-2">
          <span class="text-[10px] font-medium text-slate-500 uppercase tracking-wider">開發工具</span>
        </div>
        <div class="space-y-0.5">
          <a href="/#sandbox" class="sidebar-link text-slate-300">
            <i data-lucide="shield-check" class="w-4 h-4 opacity-70"></i> 金鑰驗證
          </a>
        </div>
      </div>
      <div class="mb-4">
        <div class="px-3 mb-2">
          <span class="text-[10px] font-medium text-slate-500 uppercase tracking-wider">系統</span>
        </div>
        <div class="space-y-0.5">
          <a href="/#trust" class="sidebar-link text-slate-300">
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
      <div class="px-3 py-2.5 rounded-lg bg-slate-700/50" title="目前使用的資料庫">
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

  <main class="app-main ml-56 min-h-screen p-6 lg:p-8">
    <a href="/" class="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)] mb-6 transition">← 返回儀表板</a>
    <div id="project-header" class="mb-10">
      <div class="flex justify-between items-start gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h2 id="project-name" class="text-2xl font-bold text-[var(--text)]">載入中...</h2>
            <button type="button" id="btn-edit-project" class="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--accent)] hover:bg-slate-100 transition" title="編輯專案">
              <i data-lucide="pencil" class="w-4 h-4"></i>
            </button>
          </div>
          <p id="project-desc" class="text-[var(--muted)] mt-1">—</p>
          <div id="project-url-wrap" class="hidden mt-2"></div>
          <div class="flex gap-3 mt-4 items-center">
            <span id="project-status" class="text-xs font-medium px-2.5 py-1 rounded-full">—</span>
            <span id="project-key-hint" class="text-xs text-[var(--muted)] font-mono">3rdPKey: ••••••••</span>
          </div>
        </div>
        <button type="button" id="btn-delete-project" class="px-4 py-2 rounded-lg border-2 border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition text-sm font-medium flex items-center gap-2">
          <i data-lucide="trash-2" class="w-4 h-4"></i> 刪除專案
        </button>
      </div>
    </div>

    <div id="modal-edit-project" class="hidden fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4">
      <div class="card w-full max-w-md p-6" onclick="event.stopPropagation()">
        <h3 class="text-lg font-semibold text-[var(--text)] mb-4">編輯專案</h3>
        <form id="form-edit-project" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[var(--text)] mb-1.5">專案名稱 *</label>
            <input type="text" name="name" required id="edit-project-name" class="input-base" placeholder="例如：電商整合平台">
          </div>
          <div>
            <label class="block text-sm font-medium text-[var(--text)] mb-1.5">備註（選填）</label>
            <textarea name="description" id="edit-project-desc" rows="3" class="input-base" placeholder="簡述專案用途"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-[var(--text)] mb-1.5">專案網址（選填）</label>
            <input type="url" name="website_url" id="edit-project-url" class="input-base" placeholder="https://example.com">
          </div>
          <div id="edit-project-error" class="hidden text-sm text-red-600"></div>
          <div class="flex gap-3 pt-2">
            <button type="button" id="btn-cancel-edit-project" class="btn-secondary flex-1">取消</button>
            <button type="submit" id="btn-submit-edit-project" class="btn-primary flex-1">儲存</button>
          </div>
        </form>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      <section>
        <div class="mb-3">
          <h3 class="text-base font-semibold text-[var(--text)]">金鑰保險箱</h3>
          <p class="section-desc mt-0.5">此專案儲存的 API 金鑰（Gemini、Line 等），皆以 AES-256-GCM 加密，原始值不顯示。</p>
        </div>
        <div id="secret-list" class="card overflow-hidden mt-4">
          <div class="p-8 text-center text-sm text-[var(--muted)]">載入中...</div>
        </div>
        <div class="mt-4">
          <details class="card group">
            <summary class="px-5 py-4 cursor-pointer list-none flex items-center justify-between hover:bg-slate-50 rounded-xl">
              <span class="font-medium text-sm text-[var(--text)]">新增 API 金鑰</span>
              <i data-lucide="plus" class="w-4 h-4 text-[var(--muted)] group-open:rotate-45 transition"></i>
            </summary>
            <form id="add-secret-form" class="p-5 pt-0 space-y-4 border-t border-[var(--border)]">
              <div>
                <label class="block text-sm font-medium text-[var(--text)] mb-1.5">金鑰名稱 *</label>
                <input type="text" name="key_name" required placeholder="例如: GEMINI_API_KEY" class="input-base font-mono">
              </div>
              <div>
                <label class="block text-sm font-medium text-[var(--text)] mb-1.5">供應商類型 *</label>
                <select name="provider_type" required class="input-base">
                  <option value="GOOGLE">Google (Gemini 等)</option>
                  <option value="LINE">Line</option>
                  <option value="OPENAI">OpenAI</option>
                  <option value="OTHER">其他</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-[var(--text)] mb-1.5">API 金鑰 *</label>
                <input type="password" name="value" required placeholder="輸入金鑰，將以 AES-256-GCM 加密儲存" class="input-base" autocomplete="off">
              </div>
              <div id="secret-form-message" class="text-sm hidden"></div>
              <button type="submit" class="btn-primary py-2.5">儲存金鑰</button>
            </form>
          </details>
        </div>
      </section>
      <section>
        <div class="mb-3">
          <h3 class="text-base font-semibold text-[var(--text)]">AI 技能清單</h3>
          <p class="section-desc mt-0.5">此專案可調用的 AI 能力。已驗證的 Skill 可正式對外提供。</p>
        </div>
        <div id="skill-list" class="space-y-3 mt-4">
          <div class="p-8 text-center text-sm text-[var(--muted)] card">載入中...</div>
        </div>
      </section>
    </div>

    <section class="mb-10">
      <div class="mb-3">
        <h3 class="text-base font-semibold text-[var(--text)]">AI 測試沙盒</h3>
        <p class="section-desc mt-0.5">選擇 Skill、輸入測試內容，系統會使用專案金鑰呼叫 Gemini 並顯示回傳結果。</p>
      </div>
      <div id="sandbox-card" class="card p-6 mt-4">
        <div id="sandbox-empty" class="hidden p-8 text-center text-sm text-[var(--muted)]">
          請先新增 AI Skill 與 GEMINI_API_KEY 金鑰後再測試。
        </div>
        <div id="sandbox-form" class="hidden space-y-4">
          <div>
            <label class="block text-sm font-medium text-[var(--text)] mb-1.5">選擇 Skill</label>
            <select id="sandbox-skill" class="input-base">
              <option value="">— 請選擇 —</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-[var(--text)] mb-1.5">測試輸入</label>
            <textarea id="sandbox-input" rows="4" placeholder="輸入要送給 AI 的內容（純文字或 JSON）..." class="input-base resize-none"></textarea>
          </div>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 text-sm text-[var(--muted)] cursor-pointer">
              <input type="checkbox" id="sandbox-debug" class="rounded border-[var(--border)] text-[var(--accent)]">
              <span>顯示 Debugger（Request/Response、解密追蹤）</span>
            </label>
            <button type="button" id="sandbox-send" class="px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-blue-700 hover:shadow-md transition-all duration-200 flex items-center gap-2">
              <i data-lucide="send" class="w-4 h-4"></i> 發送測試
            </button>
          </div>
          <div id="sandbox-result" class="hidden mt-4 p-4 rounded-lg border border-[var(--border)] bg-slate-50">
            <div class="text-xs font-medium text-[var(--muted)] mb-2">AI 回傳</div>
            <pre id="sandbox-result-text" class="text-sm font-mono whitespace-pre-wrap break-words"></pre>
          </div>
          <div id="sandbox-error" class="hidden mt-4 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm"></div>
          <div id="sandbox-debugger" class="hidden mt-4 rounded-lg border border-slate-300 bg-slate-900 overflow-hidden">
            <div class="px-4 py-2 bg-slate-800 text-slate-300 text-sm font-medium flex items-center gap-2">
              <i data-lucide="bug" class="w-4 h-4"></i> API Debugger
            </div>
            <div class="p-4 space-y-4">
              <div>
                <div class="text-xs font-medium text-slate-400 mb-1">Request</div>
                <pre id="debug-request" class="p-3 rounded bg-slate-800 text-slate-300 text-xs font-mono overflow-x-auto whitespace-pre-wrap"></pre>
              </div>
              <div>
                <div class="text-xs font-medium text-slate-400 mb-1">解密狀態追蹤</div>
                <div id="debug-trace" class="space-y-1"></div>
              </div>
              <div>
                <div class="text-xs font-medium text-slate-400 mb-1">Response</div>
                <pre id="debug-response" class="p-3 rounded bg-slate-800 text-slate-300 text-xs font-mono overflow-x-auto whitespace-pre-wrap"></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="dev-code" class="mb-10 scroll-mt-6">
      <div class="mb-3">
        <h3 class="text-base font-semibold text-[var(--text)]">開發者代碼範例</h3>
        <p class="section-desc mt-0.5">複製以下代碼，在子網站中攜帶 3rdPKey 調用此專案已驗證的 Skills。API Key 由中台代為請求，子網站永不接觸原始金鑰。</p>
      </div>
      <div id="dev-code-card" class="card overflow-hidden mt-4">
        <div id="dev-code-empty" class="hidden p-8 text-center text-sm text-[var(--muted)]">
          請先新增並驗證至少一個 AI Skill 後，此處將顯示調用範例。
        </div>
        <div id="dev-code-content" class="hidden">
          <div class="flex border-b border-[var(--border)]">
            <button type="button" data-tab="curl" class="dev-tab px-5 py-3 text-sm font-medium text-[var(--accent)] border-b-2 border-[var(--accent)]">cURL</button>
            <button type="button" data-tab="fetch" class="dev-tab px-5 py-3 text-sm font-medium text-[var(--muted)] border-b-2 border-transparent hover:text-[var(--text)]">fetch</button>
            <button type="button" data-tab="nexus" class="dev-tab px-5 py-3 text-sm font-medium text-[var(--muted)] border-b-2 border-transparent hover:text-[var(--text)]">NexusClient</button>
          </div>
          <div class="p-5">
            <pre id="dev-code-block" class="p-4 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-words"></pre>
            <p class="mt-3 text-xs text-[var(--muted)]">3rdPKey 已填入，請依實際 Skill 調整 <code class="px-1 py-0.5 rounded bg-slate-100 font-mono">skill_id</code> 與 <code class="px-1 py-0.5 rounded bg-slate-100 font-mono">params</code>（對應各 Skill 的 Input Schema）。</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="mb-3">
        <h3 class="text-base font-semibold text-[var(--text)]">新增 AI Skill</h3>
        <p class="section-desc mt-0.5">建立新的 AI 能力，需填寫 System Prompt 與 Input Schema（JSON 格式）。</p>
      </div>
      <form id="add-skill-form" class="card p-6 lg:p-8 space-y-5 mt-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium text-[var(--text)] mb-1.5">Skill 名稱 *</label>
            <input type="text" name="name" required placeholder="例如: Summarizer" class="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30">
          </div>
          <div>
            <label class="block text-sm font-medium text-[var(--text)] mb-1.5">版本</label>
            <input type="text" name="version" value="1.0.0" class="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-[var(--text)] mb-1.5">System Prompt *</label>
          <textarea name="system_prompt" required rows="3" placeholder="You are a helpful assistant..." class="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-[var(--text)] mb-1.5">Input Schema (JSON) *</label>
          <textarea name="input_schema" required rows="4" class="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30">{"type":"object","properties":{"text":{"type":"string"},"maxLength":{"type":"number"}}}</textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-[var(--text)] mb-1.5">Output Schema (選填)</label>
          <textarea name="output_schema" rows="2" placeholder='{"type":"object","properties":{"result":{"type":"string"}}}' class="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-mono resize-none"></textarea>
        </div>
        <div class="flex items-center gap-2">
          <input type="checkbox" name="is_verified" id="is_verified" class="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]/30">
          <label for="is_verified" class="text-sm text-[var(--muted)]">標記為已驗證（可正式對外提供）</label>
        </div>
        <div id="form-message" class="text-sm hidden"></div>
        <button type="submit" class="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-blue-600 transition">新增 Skill</button>
      </form>
    </section>
  </main>

  <script>
    const PROJECT_ID = '${projectId}';
    let CURRENT_PROJECT = null;

    async function loadProject() {
      const res = await fetch('/api/projects/' + PROJECT_ID);
      const json = await res.json();
      if (!json.success) {
        document.getElementById('project-header').innerHTML = '<p class="text-red-600 font-medium">專案不存在</p>';
        return;
      }
      const p = json.data;
      CURRENT_PROJECT = p;
      document.getElementById('project-name').textContent = p.name;
      document.getElementById('project-desc').textContent = p.description || '—';
      const urlWrap = document.getElementById('project-url-wrap');
      if (p.website_url) {
        urlWrap.classList.remove('hidden');
        const href = p.website_url.startsWith('http') ? p.website_url : 'https://' + p.website_url;
        const display = p.website_url.replace(/^https?:\\/\\//, '');
        urlWrap.innerHTML = \`<a href="\${href}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline"><i data-lucide="external-link" class="w-4 h-4"></i>\${display}</a>\`;
      } else {
        urlWrap.classList.add('hidden');
        urlWrap.innerHTML = '';
      }
      document.getElementById('project-status').textContent = p.status === 'active' ? '線上' : '停用';
      document.getElementById('project-status').className = 'text-xs font-medium px-2.5 py-1 rounded-full ' + (p.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600');
      document.getElementById('project-key-hint').textContent = '3rdPKey: ' + (p.third_party_key ? p.third_party_key.substring(0,8) + '••••' : '—');

      const secretEl = document.getElementById('secret-list');
      if (p.secrets && p.secrets.length > 0) {
        secretEl.innerHTML = p.secrets.map(s => \`
          <div class="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] last:border-0">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <i data-lucide="key" class="w-4 h-4 text-[var(--muted)]"></i>
              </div>
              <div>
                <span class="font-medium text-[var(--text)]">\${s.key_name}</span>
                <span class="text-xs text-[var(--muted)] ml-2">\${s.provider_type}</span>
              </div>
            </div>
            <span class="text-xs text-[var(--muted)]">已加密儲存</span>
          </div>
        \`).join('');
      } else {
        secretEl.innerHTML = '<div class="p-8 text-center text-sm text-[var(--muted)]">尚無金鑰，可於金鑰管理新增</div>';
      }

      const skillEl = document.getElementById('skill-list');
      if (p.skills && p.skills.length > 0) {
        skillEl.innerHTML = p.skills.map(s => \`
          <div class="card p-4 \${s.is_verified ? '' : 'opacity-90'}">
            <div class="flex items-start gap-3">
              <span class="text-xs font-medium px-2 py-0.5 rounded \${s.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}">\${s.is_verified ? '已驗證' : '草稿'}</span>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-[var(--text)]">\${s.name}</div>
                <div class="text-xs text-[var(--muted)] mt-0.5">v\${s.version}</div>
                <details class="mt-2">
                  <summary class="text-xs text-[var(--accent)] cursor-pointer hover:underline">檢視 Input Schema</summary>
                  <pre class="mt-2 p-3 rounded bg-slate-50 font-mono text-[11px] overflow-x-auto border border-[var(--border)]">\${s.input_schema || '{}'}</pre>
                </details>
              </div>
            </div>
          </div>
        \`).join('');
      } else {
        skillEl.innerHTML = '<div class="card p-8 text-center text-sm text-[var(--muted)]">尚無 AI 技能，請於下方表單新增</div>';
      }

      // AI 測試沙盒：顯示/隱藏、填入 Skill 選單
      const sandboxEmpty = document.getElementById('sandbox-empty');
      const sandboxForm = document.getElementById('sandbox-form');
      const sandboxSkill = document.getElementById('sandbox-skill');
      const hasSkills = p.skills && p.skills.length > 0;
      const hasSecrets = p.secrets && p.secrets.length > 0;
      if (hasSkills && hasSecrets) {
        sandboxEmpty.classList.add('hidden');
        sandboxForm.classList.remove('hidden');
        sandboxSkill.innerHTML = '<option value="">— 請選擇 —</option>' + p.skills.map(s => \`<option value="\${s.id}">\${s.name} (v\${s.version})</option>\`).join('');
      } else {
        sandboxEmpty.classList.remove('hidden');
        sandboxForm.classList.add('hidden');
      }

      // 開發者代碼範例：僅已驗證的 Skill 可對外調用
      const verifiedSkills = (p.skills || []).filter(s => s.is_verified);
      const devCodeEmpty = document.getElementById('dev-code-empty');
      const devCodeContent = document.getElementById('dev-code-content');
      const devCodeBlock = document.getElementById('dev-code-block');
      if (verifiedSkills.length > 0 && p.third_party_key) {
        devCodeEmpty.classList.add('hidden');
        devCodeContent.classList.remove('hidden');
        const firstSkill = verifiedSkills[0];
        let sampleParams = {};
        try {
          const schema = JSON.parse(firstSkill.input_schema || '{}');
          const props = schema.properties || {};
          for (const [k, v] of Object.entries(props)) {
            const t = (v && v.type) || 'string';
            sampleParams[k] = t === 'number' ? 100 : t === 'boolean' ? true : '範例輸入';
          }
        } catch (e) {}
        const base = window.location.origin;
        const curlCode = \`curl -X POST "\${base}/v1/ai/execute" \\
  -H "Content-Type: application/json" \\
  -H "X-Project-Key: \${p.third_party_key}" \\
  -d '{"skill_id":"\${firstSkill.id}","params":\${JSON.stringify(sampleParams)}}'\`;
        const fetchCode = \`const res = await fetch("\${base}/v1/ai/execute", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Project-Key": "\${p.third_party_key}"
  },
  body: JSON.stringify({
    skill_id: "\${firstSkill.id}",
    params: \${JSON.stringify(sampleParams, null, 2)}
  })
});
const data = await res.json();
console.log(data.success ? data.data.result : data.message);\`;
        const nexusCode = \`/**
 * NexusClient - AntVillageMgr 中台對接 SDK
 * 複製此段代碼給 AI，可快速完成子網站中台整合
 */
const NEXUS_BASE = "\${base}";

class NexusClient {
  private key: string;

  constructor(thirdPKey: string) {
    this.key = thirdPKey;
  }

  /** 初始化（等同於建構子，方便 AI 理解） */
  static init(thirdPKey: string) {
    return new NexusClient(thirdPKey);
  }

  /** 驗證金鑰並查詢使用者權限 */
  async checkPermission(userId?: string) {
    const res = await fetch(NEXUS_BASE + "/v1/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Project-Key": this.key },
      body: JSON.stringify(userId ? { project_key: this.key, userId } : { project_key: this.key }),
    });
    return res.json();
  }

  /** 調用 AI Skill */
  async callSkill<T = Record<string, unknown>>(skillId: string, params: T) {
    const res = await fetch(NEXUS_BASE + "/v1/ai/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Project-Key": this.key },
      body: JSON.stringify({ skill_id: skillId, params }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || data.code);
    return data.data.result as string;
  }
}

// 使用範例
const client = NexusClient.init("\${p.third_party_key}");
const ok = await client.checkPermission();
if (ok.data?.valid) {
  const result = await client.callSkill("\${firstSkill.id}", \${JSON.stringify(sampleParams)});
  console.log(result);
}\`;
        devCodeBlock.textContent = curlCode;
        devCodeBlock.dataset.curl = curlCode;
        devCodeBlock.dataset.fetch = fetchCode;
        devCodeBlock.dataset.nexus = nexusCode;
        document.querySelectorAll('.dev-tab').forEach(btn => {
          btn.classList.remove('text-[var(--accent)]', 'border-[var(--accent)]');
          btn.classList.add('text-[var(--muted)]', 'border-transparent');
          if (btn.dataset.tab === 'curl') {
            btn.classList.add('text-[var(--accent)]', 'border-[var(--accent)]');
            btn.classList.remove('text-[var(--muted)]', 'border-transparent');
          }
        });
      } else {
        devCodeEmpty.classList.remove('hidden');
        devCodeContent.classList.add('hidden');
      }
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    }

    document.getElementById('add-secret-form').onsubmit = async (e) => {
      e.preventDefault();
      const form = e.target;
      const msg = document.getElementById('secret-form-message');
      msg.classList.add('hidden');
      const data = {
        project_id: PROJECT_ID,
        key_name: form.key_name.value.trim(),
        provider_type: form.provider_type.value,
        value: form.value.value
      };
      try {
        const res = await fetch('/api/secrets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const json = await res.json();
        if (json.success) {
          msg.textContent = '金鑰已加密儲存成功！';
          msg.className = 'text-sm text-emerald-600 font-medium';
          msg.classList.remove('hidden');
          form.reset();
          form.value.value = '';
          loadProject();
          const details = form.closest('details');
          if (details) details.open = false;
        } else {
          msg.textContent = json.message || '儲存失敗';
          msg.className = 'text-sm text-red-600';
          msg.classList.remove('hidden');
        }
      } catch (err) {
        msg.textContent = '請求失敗: ' + err.message;
        msg.className = 'text-sm text-red-600';
        msg.classList.remove('hidden');
      }
    };

    document.getElementById('add-skill-form').onsubmit = async (e) => {
      e.preventDefault();
      const form = e.target;
      const msg = document.getElementById('form-message');
      msg.classList.add('hidden');
      const data = {
        project_id: PROJECT_ID,
        name: form.name.value.trim(),
        version: form.version?.value?.trim() || '1.0.0',
        system_prompt: form.system_prompt.value.trim(),
        input_schema: form.input_schema.value.trim(),
        output_schema: form.output_schema?.value?.trim() || null,
        is_verified: form.is_verified?.checked || false
      };
      try {
        const res = await fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const json = await res.json();
        if (json.success) {
          msg.textContent = 'Skill 新增成功！';
          msg.className = 'text-sm text-emerald-600 font-medium';
          msg.classList.remove('hidden');
          form.reset();
          form.version.value = '1.0.0';
          form.input_schema.value = '{"type":"object","properties":{"text":{"type":"string"},"maxLength":{"type":"number"}}}';
          loadProject();
        } else {
          msg.textContent = json.message || '新增失敗';
          msg.className = 'text-sm text-red-600';
          msg.classList.remove('hidden');
        }
      } catch (err) {
        msg.textContent = '請求失敗: ' + err.message;
        msg.className = 'text-sm text-red-600';
        msg.classList.remove('hidden');
      }
    };

    document.getElementById('sandbox-send')?.addEventListener('click', async () => {
      const skillId = document.getElementById('sandbox-skill')?.value;
      const input = document.getElementById('sandbox-input')?.value?.trim();
      const debugMode = document.getElementById('sandbox-debug')?.checked;
      const resultEl = document.getElementById('sandbox-result');
      const resultText = document.getElementById('sandbox-result-text');
      const errorEl = document.getElementById('sandbox-error');
      const debuggerEl = document.getElementById('sandbox-debugger');
      if (!skillId || !input) {
        errorEl?.classList.remove('hidden');
        errorEl && (errorEl.textContent = '請選擇 Skill 並輸入測試內容');
        resultEl?.classList.add('hidden');
        debuggerEl?.classList.add('hidden');
        return;
      }
      errorEl.classList.add('hidden');
      resultEl.classList.add('hidden');
      debuggerEl.classList.add('hidden');
      const btn = document.getElementById('sandbox-send');
      btn.disabled = true;
      btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> 發送中...';
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (debugMode) headers['X-Debug'] = '1';
        const res = await fetch('/api/projects/' + PROJECT_ID + '/skills/' + skillId + '/test', {
          method: 'POST',
          headers,
          body: JSON.stringify({ input })
        });
        const json = await res.json();
        if (json.success) {
          resultText.textContent = json.data.response || '(無回傳內容)';
          resultEl.classList.remove('hidden');
          errorEl.classList.add('hidden');
        } else {
          errorEl.textContent = json.message || '測試失敗';
          errorEl.classList.remove('hidden');
          resultEl.classList.add('hidden');
        }
        if (debugMode && json._debug) {
          debuggerEl.classList.remove('hidden');
          document.getElementById('debug-request').textContent = JSON.stringify(json._debug.request, null, 2);
          document.getElementById('debug-response').textContent = JSON.stringify(json._debug.response, null, 2);
          const trace = json._debug.decryption_trace || [];
          document.getElementById('debug-trace').innerHTML = trace.map(t => \`
            <div class="flex items-center gap-2 text-xs">
              <span class="w-2 h-2 rounded-full \${t.status === 'OK' ? 'bg-emerald-500' : 'bg-red-500'}"></span>
              <span class="text-slate-400">\${t.step}</span>
              <span class="text-slate-300">\${t.detail || ''}</span>
            </div>
          \`).join('');
          if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
        }
      } catch (err) {
        errorEl.textContent = '請求失敗: ' + (err.message || err);
        errorEl.classList.remove('hidden');
        resultEl.classList.add('hidden');
      }
      btn.disabled = false;
      btn.innerHTML = '<i data-lucide="send" class="w-4 h-4"></i> 發送測試';
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    });

    document.querySelectorAll('.dev-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        const block = document.getElementById('dev-code-block');
        if (!block?.dataset.curl) return;
        block.textContent = tab === 'curl' ? block.dataset.curl : tab === 'fetch' ? block.dataset.fetch : block.dataset.nexus || '';
        document.querySelectorAll('.dev-tab').forEach(b => {
          b.classList.remove('text-[var(--accent)]', 'border-[var(--accent)]');
          b.classList.add('text-[var(--muted)]', 'border-transparent');
        });
        btn.classList.add('text-[var(--accent)]', 'border-[var(--accent)]');
        btn.classList.remove('text-[var(--muted)]', 'border-transparent');
      });
    });

    document.getElementById('btn-logout').onclick = () => {
      fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).then(() => { location.href = '/login'; });
    };
    (function initSidebarMobile() {
      const toggle = document.getElementById('btn-sidebar-toggle');
      const overlay = document.getElementById('sidebar-overlay');
      const open = () => { document.body.classList.add('sidebar-open'); };
      const close = () => { document.body.classList.remove('sidebar-open'); };
      if (toggle) toggle.addEventListener('click', open);
      if (overlay) overlay.addEventListener('click', close);
      document.querySelectorAll('.app-sidebar a').forEach(a => a.addEventListener('click', () => { if (window.innerWidth < 768) close(); }));
    })();
    document.getElementById('btn-edit-project').onclick = () => {
      document.getElementById('edit-project-name').value = document.getElementById('project-name').textContent || '';
      document.getElementById('edit-project-desc').value = document.getElementById('project-desc').textContent === '—' ? '' : (document.getElementById('project-desc').textContent || '');
      document.getElementById('edit-project-url').value = CURRENT_PROJECT?.website_url || '';
      document.getElementById('edit-project-error').classList.add('hidden');
      document.getElementById('modal-edit-project').classList.remove('hidden');
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    };
    document.getElementById('btn-cancel-edit-project').onclick = () => {
      document.getElementById('modal-edit-project').classList.add('hidden');
    };
    document.getElementById('modal-edit-project').onclick = (e) => {
      if (e.target.id === 'modal-edit-project') document.getElementById('modal-edit-project').classList.add('hidden');
    };
    document.getElementById('form-edit-project').onsubmit = async (e) => {
      e.preventDefault();
      const form = e.target;
      const name = form.name.value?.trim();
      const description = form.description.value?.trim() || null;
      const website_url = form.website_url?.value?.trim() || null;
      const errEl = document.getElementById('edit-project-error');
      const btnEl = document.getElementById('btn-submit-edit-project');
      errEl.classList.add('hidden');
      btnEl.disabled = true;
      try {
        const res = await fetch('/api/projects/' + PROJECT_ID, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description, website_url }),
          credentials: 'include'
        });
        const json = await res.json();
        if (json.success) {
          document.getElementById('modal-edit-project').classList.add('hidden');
          document.getElementById('project-name').textContent = name;
          document.getElementById('project-desc').textContent = description || '—';
          if (CURRENT_PROJECT) CURRENT_PROJECT.website_url = website_url;
          const urlWrap = document.getElementById('project-url-wrap');
          if (website_url) {
            urlWrap.classList.remove('hidden');
            const href = website_url.startsWith('http') ? website_url : 'https://' + website_url;
            const display = website_url.replace(/^https?:\\/\\//, '');
            urlWrap.innerHTML = \`<a href="\${href}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:underline"><i data-lucide="external-link" class="w-4 h-4"></i>\${display}</a>\`;
          } else {
            urlWrap.classList.add('hidden');
            urlWrap.innerHTML = '';
          }
          if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
        } else {
          errEl.textContent = json.message || '儲存失敗';
          errEl.classList.remove('hidden');
        }
      } catch (err) {
        errEl.textContent = '請求失敗: ' + (err.message || err);
        errEl.classList.remove('hidden');
      }
      btnEl.disabled = false;
    };

    document.getElementById('btn-delete-project').onclick = async () => {
      const name = document.getElementById('project-name').textContent || '此專案';
      if (!confirm('確定要刪除專案「' + name + '」嗎？此操作無法復原，將一併刪除該專案的所有技能、金鑰與權限。')) return;
      try {
        const res = await fetch('/api/projects/' + PROJECT_ID, {
          method: 'DELETE',
          credentials: 'include'
        });
        const json = await res.json();
        if (json.success) {
          location.href = '/';
        } else {
          alert(json.message || '刪除失敗');
        }
      } catch (e) {
        alert('請求失敗: ' + (e.message || e));
      }
    };

    document.addEventListener('DOMContentLoaded', function() {
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
      loadProject();
    });
  </script>
</body>
</html>`;
}
