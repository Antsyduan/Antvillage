/**
 * 全域 API 金鑰管理（僅系統管理員）
 */
export function globalSecretsHtml(_baseUrl: string): string {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>全域 API 金鑰 — AntVillageMgr</title>
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
          <p class="text-[11px] text-slate-400">全域 API 金鑰</p>
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
          <a href="/global-secrets" class="sidebar-link active">
            <i data-lucide="key" class="w-4 h-4 opacity-70"></i> 全域 API 金鑰
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
  </aside>

  <main class="app-main ml-56 min-h-screen p-6 lg:p-8">
    <a href="/" class="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)] mb-6 transition">← 返回儀表板</a>
    <div class="flex items-baseline justify-between gap-4 mb-6">
      <div>
        <h2 class="text-xl font-bold text-[var(--text)]">全域 API 金鑰</h2>
        <p class="text-sm text-[var(--muted)] mt-1">設定各專案可共用的 API 金鑰（Gemini、Line、Google 等），僅系統管理員可管理。Google 登入、Line 登入設定後，專案可呼叫 <code class="text-xs bg-slate-100 px-1 rounded">/v1/auth/config</code> 取得，無需各自設定。</p>
      </div>
      <button type="button" id="btn-add" class="px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-blue-700 hover:shadow-md transition-all duration-200 flex items-center gap-2">
        <i data-lucide="plus" class="w-4 h-4"></i> 新增金鑰
      </button>
    </div>

    <div id="secret-list" class="space-y-3">
    </div>

    <div id="modal-add" class="hidden fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4">
      <div class="card w-full max-w-md p-6">
        <h3 class="text-lg font-semibold text-[var(--text)] mb-4">新增全域 API 金鑰</h3>
        <form id="form-add" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[var(--text)] mb-1.5">服務類型</label>
            <select name="provider_type" required class="input-base">
              <option value="GEMINI">Gemini (Google AI)</option>
              <option value="GOOGLE">Google</option>
              <option value="GOOGLE_OAUTH">Google 登入 (OAuth)</option>
              <option value="LINE">Line</option>
              <option value="LINE_OAUTH">Line 登入</option>
              <option value="OPENAI">OpenAI</option>
              <option value="OTHER">其他</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-[var(--text)] mb-1.5">金鑰名稱</label>
            <div id="add-key-name-wrap">
              <input type="text" name="key_name" required placeholder="GEMINI_API_KEY" class="input-base font-mono" id="add-key-name">
            </div>
            <p id="add-key-hint" class="text-xs text-[var(--muted)] mt-1 hidden">Google 登入與 Line 登入各需建立兩筆金鑰，請分別選擇並送出。</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-[var(--text)] mb-1.5">金鑰內容</label>
            <input type="password" name="value" required placeholder="輸入 API Key" class="input-base" id="add-key-value">
          </div>
          <div>
            <label class="block text-sm font-medium text-[var(--text)] mb-2">授權給專案</label>
            <div id="add-project-checkboxes" class="space-y-2 max-h-40 overflow-y-auto">
            </div>
          </div>
          <div id="add-error" class="hidden text-sm text-red-600"></div>
          <label id="add-continue-wrap" class="hidden flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="continue_add" id="add-continue">
            <span class="text-sm text-[var(--muted)]">建立後繼續新增下一筆（登入服務需建立兩筆）</span>
          </label>
          <div class="flex gap-3 pt-2">
          <button type="button" id="btn-cancel-add" class="btn-secondary flex-1">取消</button>
          <button type="submit" class="btn-primary flex-1">建立</button>
          </div>
        </form>
      </div>
    </div>

    <div id="modal-grants" class="hidden fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4">
      <div class="card w-full max-w-md p-6">
        <h3 class="text-lg font-semibold text-[var(--text)] mb-2">授權專案</h3>
        <p id="grants-secret-name" class="text-sm text-[var(--muted)] mb-4"></p>
        <div id="grants-checkboxes" class="space-y-2 max-h-60 overflow-y-auto mb-4">
        </div>
        <div class="flex gap-3">
          <button type="button" id="btn-cancel-grants" class="btn-secondary flex-1">取消</button>
          <button type="button" id="btn-save-grants" class="btn-primary flex-1">儲存</button>
        </div>
      </div>
    </div>
  </main>

  <script>
    const fetchOpts = { credentials: 'include' };
    let SECRETS = [];
    let PROJECTS = [];
    let SELECTED_SECRET_ID = null;

    async function api(path) {
      const res = await fetch(path, fetchOpts);
      if (res.status === 401) { location.href = '/login'; return null; }
      if (res.status === 403) { location.href = '/?error=forbidden'; return null; }
      return res;
    }

    async function loadData() {
      const [secretsRes, projectsRes] = await Promise.all([
        api('/api/global-secrets'),
        api('/api/projects')
      ]);
      if (!secretsRes || !projectsRes) return;
      if (!secretsRes.ok) {
        if (secretsRes.status === 403) return;
        document.getElementById('secret-list').innerHTML = '<p class="text-red-600">載入失敗</p>';
        return;
      }
      const secretsJson = await secretsRes.json();
      const projectsJson = await projectsRes.json();
      SECRETS = secretsJson.data?.secrets || [];
      PROJECTS = projectsJson.data || [];
      render();
    }

    function render() {
      const el = document.getElementById('secret-list');
      if (SECRETS.length === 0) {
        el.innerHTML = '<p class="text-center py-12 text-[var(--muted)]">尚無全域金鑰，點擊「新增金鑰」建立</p>';
        return;
      }
      el.innerHTML = SECRETS.map(s => \`
        <div class="card p-4 flex items-center justify-between hover:shadow-[var(--shadow-card-hover)] transition-all duration-200">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <i data-lucide="key" class="w-5 h-5 text-slate-500"></i>
            </div>
            <div>
              <div class="font-medium text-[var(--text)]">\${s.key_name}</div>
              <div class="text-sm text-[var(--muted)]">\${s.provider_type} · \${(s.projects || []).map(p => p.name).join('、') || '未授權'}</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" class="grant-btn px-3 py-1.5 rounded-lg text-sm text-[var(--accent)] hover:bg-blue-50 transition" data-id="\${s.id}">授權專案</button>
            <button type="button" class="delete-btn px-3 py-1.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition" data-id="\${s.id}">刪除</button>
          </div>
        </div>
      \`).join('');
      document.querySelectorAll('.grant-btn').forEach(btn => {
        btn.onclick = () => openGrantsModal(btn.dataset.id);
      });
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = () => deleteSecret(btn.dataset.id);
      });
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    }

    function renderAddProjectCheckboxes(selectedIds = []) {
      const el = document.getElementById('add-project-checkboxes');
      el.innerHTML = PROJECTS.map(p => \`
        <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" name="project_id" value="\${p.id}" \${selectedIds.includes(p.id) ? 'checked' : ''}>
          <span class="text-sm">\${p.name}</span>
        </label>
      \`).join('') || '<p class="text-sm text-[var(--muted)]">尚無專案</p>';
    }

    const KEY_NAMES_BY_PROVIDER = {
      GOOGLE_OAUTH: [
        { value: 'GOOGLE_OAUTH_CLIENT_ID', label: 'GOOGLE_OAUTH_CLIENT_ID（Client ID）' },
        { value: 'GOOGLE_OAUTH_CLIENT_SECRET', label: 'GOOGLE_OAUTH_CLIENT_SECRET（Client Secret）' }
      ],
      LINE_OAUTH: [
        { value: 'LINE_CHANNEL_ID', label: 'LINE_CHANNEL_ID（Channel ID）' },
        { value: 'LINE_CHANNEL_SECRET', label: 'LINE_CHANNEL_SECRET（Channel Secret）' }
      ]
    };
    const VALUE_PLACEHOLDERS = {
      GOOGLE_OAUTH_CLIENT_ID: '輸入 Google OAuth Client ID',
      GOOGLE_OAUTH_CLIENT_SECRET: '輸入 Google OAuth Client Secret',
      LINE_CHANNEL_ID: '輸入 Line Channel ID',
      LINE_CHANNEL_SECRET: '輸入 Line Channel Secret'
    };
    function updateKeyNameField(providerType) {
      const wrap = document.getElementById('add-key-name-wrap');
      const hint = document.getElementById('add-key-hint');
      const valueInput = document.getElementById('add-key-value');
      const continueWrap = document.getElementById('add-continue-wrap');
      const keys = KEY_NAMES_BY_PROVIDER[providerType];
      if (keys) {
        wrap.innerHTML = '<select name="key_name" required class="input-base font-mono" id="add-key-name"><option value="">— 請選擇 —</option>' + keys.map(k => '<option value="' + k.value + '">' + k.label + '</option>').join('') + '</select>';
        hint.classList.remove('hidden');
        continueWrap.classList.remove('hidden');
        wrap.querySelector('#add-key-name').addEventListener('change', function() {
          if (valueInput) valueInput.placeholder = VALUE_PLACEHOLDERS[this.value] || '輸入 API Key';
        });
      } else {
        wrap.innerHTML = '<input type="text" name="key_name" required placeholder="GEMINI_API_KEY" class="input-base font-mono" id="add-key-name">';
        hint.classList.add('hidden');
        continueWrap.classList.add('hidden');
        if (valueInput) valueInput.placeholder = '輸入 API Key';
      }
    }
    document.getElementById('btn-add').onclick = () => {
      document.getElementById('modal-add').classList.remove('hidden');
      document.getElementById('add-error').classList.add('hidden');
      document.getElementById('form-add').reset();
      updateKeyNameField(document.getElementById('form-add').provider_type.value);
      renderAddProjectCheckboxes();
    };
    document.getElementById('form-add').querySelector('[name="provider_type"]').addEventListener('change', function() {
      updateKeyNameField(this.value);
    });

    document.getElementById('btn-cancel-add').onclick = () => {
      document.getElementById('modal-add').classList.add('hidden');
    };

    document.getElementById('modal-add').onclick = (e) => {
      if (e.target.id === 'modal-add') document.getElementById('modal-add').classList.add('hidden');
    };

    document.getElementById('form-add').onsubmit = async (e) => {
      e.preventDefault();
      const form = e.target;
      const projectIds = Array.from(form.querySelectorAll('input[name="project_id"]:checked')).map(cb => cb.value);
      const errEl = document.getElementById('add-error');
      errEl.classList.add('hidden');
      try {
        const res = await fetch('/api/global-secrets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider_type: form.provider_type.value,
            key_name: form.key_name.value.trim(),
            value: form.value.value,
            project_ids: projectIds
          }),
          credentials: 'include'
        });
        const json = await res.json();
        if (json.success) {
          const continueAdd = document.getElementById('add-continue')?.checked;
          if (continueAdd) {
            document.getElementById('add-key-value').value = '';
            updateKeyNameField(form.provider_type.value);
          } else {
            document.getElementById('modal-add').classList.add('hidden');
          }
          await loadData();
        } else {
          errEl.textContent = json.message || '建立失敗';
          errEl.classList.remove('hidden');
        }
      } catch (e) {
        errEl.textContent = '請求失敗: ' + (e.message || e);
        errEl.classList.remove('hidden');
      }
    };

    function openGrantsModal(secretId) {
      SELECTED_SECRET_ID = secretId;
      const s = SECRETS.find(x => x.id === secretId);
      if (!s) return;
      document.getElementById('grants-secret-name').textContent = s.key_name + ' (' + s.provider_type + ')';
      const el = document.getElementById('grants-checkboxes');
      el.innerHTML = PROJECTS.map(p => \`
        <label class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" class="grant-cb" data-project-id="\${p.id}" \${(s.project_ids || []).includes(p.id) ? 'checked' : ''}>
          <span class="text-sm">\${p.name}</span>
        </label>
      \`).join('');
      document.getElementById('modal-grants').classList.remove('hidden');
    }

    document.getElementById('btn-cancel-grants').onclick = () => {
      document.getElementById('modal-grants').classList.add('hidden');
      SELECTED_SECRET_ID = null;
    };

    document.getElementById('modal-grants').onclick = (e) => {
      if (e.target.id === 'modal-grants') document.getElementById('modal-grants').classList.add('hidden');
    };

    document.getElementById('btn-save-grants').onclick = async () => {
      if (!SELECTED_SECRET_ID) return;
      const projectIds = Array.from(document.querySelectorAll('#grants-checkboxes .grant-cb:checked')).map(cb => cb.dataset.projectId);
      try {
        const res = await fetch('/api/global-secrets/' + SELECTED_SECRET_ID + '/grants', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project_ids: projectIds }),
          credentials: 'include'
        });
        const json = await res.json();
        if (json.success) {
          document.getElementById('modal-grants').classList.add('hidden');
          SELECTED_SECRET_ID = null;
          await loadData();
        } else {
          alert(json.message || '儲存失敗');
        }
      } catch (e) {
        alert('請求失敗: ' + (e.message || e));
      }
    };

    async function deleteSecret(id) {
      if (!confirm('確定要刪除此全域金鑰？')) return;
      try {
        const res = await fetch('/api/global-secrets/' + id, { method: 'DELETE', credentials: 'include' });
        const json = await res.json();
        if (json.success) await loadData();
        else alert(json.message || '刪除失敗');
      } catch (e) {
        alert('請求失敗: ' + (e.message || e));
      }
    }

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
    document.addEventListener('DOMContentLoaded', function() {
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
      loadData();
    });
  </script>
</body>
</html>`;
}
