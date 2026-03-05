/**
 * 使用者與權限管理頁
 */
export function usersHtml(_baseUrl: string): string {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>使用者管理 — AntVillageMgr</title>
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
          <p class="text-[11px] text-slate-400">使用者管理</p>
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
          <a href="/users" class="sidebar-link active">
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
  </aside>

  <main class="app-main ml-56 min-h-screen p-6 lg:p-8">
    <a href="/" class="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)] mb-6 transition">← 返回儀表板</a>
    <div class="flex items-baseline justify-between gap-4 mb-6">
      <div>
        <h2 class="text-xl font-bold text-[var(--text)]">使用者與權限管理</h2>
        <p class="text-sm text-[var(--muted)] mt-1">新增使用者帳號，並勾選其可存取的專案與角色（Admin/Editor/Viewer）</p>
      </div>
      <button type="button" id="btn-add-user" class="px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-blue-700 hover:shadow-md transition-all duration-200 flex items-center gap-2">
        <i data-lucide="user-plus" class="w-4 h-4"></i> 新增使用者
      </button>
    </div>

    <div id="user-list" class="space-y-3">
    </div>

    <section class="mt-10 p-5 rounded-xl border border-[var(--border)] bg-slate-50/50">
      <h3 class="text-sm font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
        <i data-lucide="link" class="w-4 h-4 text-[var(--accent)]"></i>
        其他專案如何引用平台使用者服務
      </h3>
      <p class="text-sm text-[var(--muted)] leading-relaxed mb-4">
        平台提供集中式使用者管理與專案導向的權限模型。其他專案可透過以下方式整合：
      </p>
      <div class="space-y-3 text-sm">
        <div class="flex gap-3">
          <span class="font-mono text-xs px-2 py-1 rounded bg-slate-200 text-slate-700 shrink-0">1</span>
          <div>
            <strong class="text-[var(--text)]">身分驗證</strong>：使用者在平台登入後取得 JWT，外部專案可將 JWT 傳入以驗證身分。
          </div>
        </div>
        <div class="flex gap-3">
          <span class="font-mono text-xs px-2 py-1 rounded bg-slate-200 text-slate-700 shrink-0">2</span>
          <div>
            <strong class="text-[var(--text)]">權限查詢</strong>：呼叫 <code class="px-1.5 py-0.5 rounded bg-slate-200 font-mono text-xs">POST /api/auth/verify</code> 或 <code class="px-1.5 py-0.5 rounded bg-slate-200 font-mono text-xs">/v1/auth/verify</code>，帶入專案金鑰（<code class="px-1.5 py-0.5 rounded bg-slate-200 font-mono text-xs">X-Project-Key</code>）與 <code class="px-1.5 py-0.5 rounded bg-slate-200 font-mono text-xs">userId</code>，即可取得該使用者在該專案中的角色（Admin/Editor/Viewer）。
          </div>
        </div>
        <div class="flex gap-3">
          <span class="font-mono text-xs px-2 py-1 rounded bg-slate-200 text-slate-700 shrink-0">3</span>
          <div>
            <strong class="text-[var(--text)]">請求範例</strong>：<code class="block mt-1 p-2 rounded bg-slate-800 text-slate-200 font-mono text-xs overflow-x-auto">POST /api/auth/verify<br>Headers: X-Project-Key: &lt;專案金鑰&gt;<br>Body: { "userId": "&lt;使用者 UUID&gt;" }</code>
          </div>
        </div>
        <div class="flex gap-3">
          <span class="font-mono text-xs px-2 py-1 rounded bg-slate-200 text-slate-700 shrink-0">4</span>
          <div>
            <strong class="text-[var(--text)]">回應格式</strong>：<code class="block mt-1 p-2 rounded bg-slate-800 text-slate-200 font-mono text-xs overflow-x-auto">{ "valid": true, "project": {...}, "permission": { "role": "editor", "scopes": "..." } }</code>
          </div>
        </div>
        <div class="flex gap-3 mt-3 pt-3 border-t border-slate-200/50">
          <span class="font-mono text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 shrink-0">+</span>
          <div>
            <strong class="text-[var(--text)]">登入設定（Google / Line）</strong>：於「全域 API 金鑰」設定 GOOGLE_OAUTH、LINE_OAUTH 並授權專案後，專案可呼叫 <code class="px-1.5 py-0.5 rounded bg-slate-200 font-mono text-xs">POST /v1/auth/config</code> 取得 client_id、channel_secret 等，無需各自設定。
          </div>
        </div>
      </div>
    </section>

    <div id="permission-panel" class="hidden fixed right-0 top-0 w-96 h-screen bg-white border-l border-[var(--border)] shadow-2xl z-40 overflow-y-auto app-panel-mobile">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-[var(--text)]">權限設定</h3>
          <button type="button" id="btn-close-panel" class="p-2 rounded-lg hover:bg-slate-100 transition">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
        <div id="permission-user-info" class="mb-6 p-4 rounded-lg bg-slate-50 border border-[var(--border)]">
          <div class="font-medium text-[var(--text)]" id="perm-user-name">—</div>
          <div class="text-sm text-[var(--muted)]" id="perm-user-email">—</div>
        </div>
        <div class="mb-4">
          <div class="text-sm font-medium text-[var(--text)] mb-3">勾選專案存取權限</div>
          <div id="permission-checkboxes" class="space-y-3">
          </div>
        </div>
        <button type="button" id="btn-save-permissions" class="w-full btn-primary py-2.5 mb-4">
          儲存權限
        </button>
        <div class="delete-user-section pt-4 border-t border-slate-200">
          <div class="text-xs text-slate-500 mb-2">危險操作</div>
          <button type="button" id="btn-delete-user-panel" class="w-full py-2.5 rounded-lg border-2 border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition text-sm font-medium">
            <span class="flex items-center justify-center gap-2"><i data-lucide="trash-2" class="w-4 h-4"></i> 刪除使用者</span>
          </button>
        </div>
      </div>
    </div>
  </main>

  <!-- 新增使用者 Modal -->
  <div id="modal-add-user" class="hidden fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4">
    <div class="card w-full max-w-md p-6">
      <h3 class="text-lg font-semibold text-[var(--text)] mb-4">新增使用者</h3>
      <form id="form-add-user" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-[var(--text)] mb-1.5">Email</label>
          <input type="email" name="email" required class="input-base" placeholder="user@example.com">
        </div>
        <div>
          <label class="block text-sm font-medium text-[var(--text)] mb-1.5">密碼</label>
          <input type="password" name="password" required minlength="6" class="input-base" placeholder="至少 6 個字元">
        </div>
        <div>
          <label class="block text-sm font-medium text-[var(--text)] mb-1.5">姓名（選填）</label>
          <input type="text" name="name" class="input-base" placeholder="顯示名稱">
        </div>
        <div id="add-user-error" class="hidden text-sm text-red-600"></div>
        <div class="flex gap-3 pt-2">
          <button type="button" id="btn-cancel-add-user" class="btn-secondary flex-1">取消</button>
          <button type="submit" class="btn-primary flex-1">建立</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    const SUPER_ADMIN_EMAIL = 'antsyduan@gmail.com';
    const fetchOpts = { credentials: 'include' };
    async function api(path) {
      const res = await fetch(path, fetchOpts);
      if (res.status === 401) { window.location.href = '/login'; return null; }
      return res;
    }
    let USERS_CACHE = [];
    let PROJECTS_CACHE = [];
    let SELECTED_USER_ID = null;

    async function loadUsers() {
      const res = await api('/api/users');
      if (!res) return;
      let data;
      try {
        const json = await res.json();
        if (!res.ok) {
          document.getElementById('user-list').innerHTML = '<p class="text-center py-12 text-red-600">載入失敗：' + (json.message || json.code || res.status) + '</p>';
          return;
        }
        data = json.data;
      } catch (e) {
        document.getElementById('user-list').innerHTML = '<p class="text-center py-12 text-red-600">回應解析失敗：' + (e.message || '未知錯誤') + '</p>';
        return;
      }
      USERS_CACHE = data || [];
      const el = document.getElementById('user-list');
      el.innerHTML = USERS_CACHE.map(u => {
        const roles = (u.project_roles || []).map(r => r.project_name + ' (' + r.role + ')').join('、') || '無';
        const isSuperAdmin = u.email === SUPER_ADMIN_EMAIL;
        const deleteBtn = isSuperAdmin
          ? '<span class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-amber-100 text-amber-800">系統最高權限</span>'
          : \`<button type="button" class="btn-delete-user inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-600 border border-red-200 hover:bg-red-50 transition" data-user-id="\${u.id}" data-user-name="\${(u.name || u.email).replace(/"/g, '&quot;')}" title="刪除使用者"><i data-lucide="trash-2" class="w-4 h-4"></i><span>刪除</span></button>\`;
        return \`<div class="card p-4 flex items-center justify-between hover:border-[var(--accent)]/40 hover:shadow-[var(--shadow-card-hover)] transition-all duration-200 cursor-pointer" data-user-id="\${u.id}">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
              <i data-lucide="user" class="w-5 h-5 text-slate-500"></i>
            </div>
            <div>
              <div class="font-medium text-[var(--text)]">\${u.name || u.email}</div>
              <div class="text-sm text-[var(--muted)]">\${u.email}</div>
              <div class="text-xs text-[var(--muted)] mt-1">\${roles}</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            \${deleteBtn}
            <i data-lucide="chevron-right" class="w-5 h-5 text-slate-400"></i>
          </div>
        </div>\`;
      }).join('');
      if (USERS_CACHE.length === 0) {
        el.innerHTML = '<p class="text-center py-12 text-[var(--muted)]">尚無使用者，點擊「新增使用者」建立</p>';
      }
      document.querySelectorAll('.card[data-user-id]').forEach(card => {
        card.addEventListener('click', (e) => {
          if (!e.target.closest('.btn-delete-user')) {
            openPermissionPanel(card.getAttribute('data-user-id'));
          }
        });
      });
      document.querySelectorAll('.btn-delete-user').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const userId = btn.getAttribute('data-user-id');
          const userName = btn.getAttribute('data-user-name') || '此使用者';
          if (userId && confirm('確定要刪除使用者「' + userName + '」嗎？此操作無法復原。')) {
            deleteUserById(userId);
          }
        });
      });
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    }

    async function deleteUserById(userId) {
      try {
        const res = await fetch('/api/users/' + userId, {
          method: 'DELETE',
          credentials: 'include'
        });
        const json = await res.json();
        if (json.success) {
          if (SELECTED_USER_ID === userId) {
            document.getElementById('permission-panel').classList.add('hidden');
            SELECTED_USER_ID = null;
          }
          await loadUsers();
        } else {
          alert(json.message || '刪除失敗');
        }
      } catch (e) {
        alert('請求失敗: ' + (e.message || e));
      }
    }

    async function loadProjects() {
      const res = await api('/api/projects');
      if (!res) return;
      try {
        const json = await res.json();
        if (!res.ok) {
          console.warn('loadProjects failed:', json.message || json.code || res.status);
          PROJECTS_CACHE = [];
          return;
        }
        PROJECTS_CACHE = json.data || [];
      } catch (e) {
        console.warn('loadProjects parse error:', e.message);
        PROJECTS_CACHE = [];
      }
    }

    function openPermissionPanel(userId) {
      SELECTED_USER_ID = userId;
      const user = USERS_CACHE.find(u => u.id === userId);
      if (!user) return;
      document.getElementById('perm-user-name').textContent = user.name || user.email;
      document.getElementById('perm-user-email').textContent = user.email;
      const existingPerms = (user.project_roles || []).reduce((acc, r) => {
        acc[r.project_id] = r.role;
        return acc;
      }, {});
      const checkboxes = PROJECTS_CACHE.map(p => {
        const role = existingPerms[p.id] || '';
        return \`<label class="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] hover:bg-slate-50 cursor-pointer">
          <input type="checkbox" class="rounded" data-project-id="\${p.id}" \${role ? 'checked' : ''}>
          <span class="flex-1 font-medium text-[var(--text)]">\${p.name}</span>
          <select class="perm-role text-sm rounded border border-[var(--border)] px-2 py-1" data-project-id="\${p.id}">
            <option value="viewer" \${role === 'viewer' ? 'selected' : ''}>Viewer</option>
            <option value="editor" \${role === 'editor' ? 'selected' : ''}>Editor</option>
            <option value="admin" \${role === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
        </label>\`;
      }).join('');
      document.getElementById('permission-checkboxes').innerHTML = checkboxes || '<p class="text-sm text-[var(--muted)]">尚無專案</p>';
      const deleteSection = document.getElementById('permission-panel').querySelector('.delete-user-section');
      if (deleteSection) deleteSection.style.display = user.email === SUPER_ADMIN_EMAIL ? 'none' : 'block';
      document.getElementById('permission-panel').classList.remove('hidden');
      document.querySelectorAll('#permission-checkboxes input[type=checkbox]').forEach(cb => {
        cb.addEventListener('change', () => {
          const sel = document.querySelector(\`select[data-project-id="\${cb.dataset.projectId}"]\`);
          if (sel) sel.disabled = !cb.checked;
        });
      });
      document.querySelectorAll('#permission-checkboxes select.perm-role').forEach(sel => {
        sel.disabled = !document.querySelector(\`input[data-project-id="\${sel.dataset.projectId}"]\`)?.checked;
      });
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    }

    document.getElementById('btn-close-panel').onclick = () => {
      document.getElementById('permission-panel').classList.add('hidden');
      SELECTED_USER_ID = null;
    };

    document.getElementById('btn-save-permissions').onclick = async () => {
      if (!SELECTED_USER_ID) return;
      const checkboxes = document.querySelectorAll('#permission-checkboxes input[type=checkbox]:checked');
      const permissions = Array.from(checkboxes).map(cb => {
        const sel = document.querySelector(\`select[data-project-id="\${cb.dataset.projectId}"]\`);
        return { project_id: cb.dataset.projectId, role: sel?.value || 'viewer' };
      });
      try {
        const res = await fetch('/api/users/' + SELECTED_USER_ID + '/permissions', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ permissions }),
          credentials: 'include'
        });
        const json = await res.json();
        if (json.success) {
          await loadUsers();
          document.getElementById('permission-panel').classList.add('hidden');
          SELECTED_USER_ID = null;
        } else {
          alert(json.message || '儲存失敗');
        }
      } catch (e) {
        alert('請求失敗: ' + (e.message || e));
      }
    };

    document.getElementById('btn-delete-user-panel').onclick = () => {
      if (!SELECTED_USER_ID) return;
      const user = USERS_CACHE.find(u => u.id === SELECTED_USER_ID);
      const userName = user ? (user.name || user.email) : '此使用者';
      if (confirm('確定要刪除使用者「' + userName + '」嗎？此操作無法復原。')) {
        deleteUserById(SELECTED_USER_ID);
      }
    };

    document.getElementById('btn-add-user').onclick = () => {
      document.getElementById('modal-add-user').classList.remove('hidden');
      document.getElementById('add-user-error').classList.add('hidden');
      document.getElementById('form-add-user').reset();
    };

    document.getElementById('btn-cancel-add-user').onclick = () => {
      document.getElementById('modal-add-user').classList.add('hidden');
    };

    document.getElementById('modal-add-user').onclick = (e) => {
      if (e.target.id === 'modal-add-user') document.getElementById('modal-add-user').classList.add('hidden');
    };

    document.getElementById('form-add-user').onsubmit = async (e) => {
      e.preventDefault();
      const form = e.target;
      const email = form.email.value?.trim();
      const password = form.password.value;
      const name = form.name.value?.trim();
      const errEl = document.getElementById('add-user-error');
      errEl.classList.add('hidden');
      try {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
          credentials: 'include'
        });
        const json = await res.json();
        if (json.success) {
          document.getElementById('modal-add-user').classList.add('hidden');
          await loadUsers();
        } else {
          errEl.textContent = json.message || '建立失敗';
          errEl.classList.remove('hidden');
        }
      } catch (e) {
        errEl.textContent = '請求失敗: ' + (e.message || e);
        errEl.classList.remove('hidden');
      }
    };

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
      loadProjects().then(() => loadUsers());
    });
  </script>
</body>
</html>`;
}
