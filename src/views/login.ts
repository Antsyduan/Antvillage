/**
 * 登入頁
 */
export function loginHtml(baseUrl: string): string {
  const origin = new URL(baseUrl).origin;
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>登入 — AntVillageMgr</title>
  <link rel="stylesheet" href="/styles.css">
  <script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js" defer></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { background: var(--bg); display: flex; align-items: center; justify-content: center; }
    .login-card { box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1), 0 4px 12px -4px rgba(0,0,0,0.06); }
  </style>
</head>
<body>
  <div class="w-full max-w-md p-6">
    <div class="card login-card p-8">
      <div class="flex items-center gap-3 mb-8">
        <div class="w-12 h-12 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-blue-500/20">
          <i data-lucide="layout-dashboard" class="w-6 h-6 text-white"></i>
        </div>
        <div>
          <h1 class="text-xl font-bold text-[var(--text)]">AntVillageMgr</h1>
          <p class="text-sm text-[var(--muted)]">AI 管理指揮中心</p>
        </div>
      </div>
      <h2 class="text-lg font-semibold text-[var(--text)] mb-6">登入</h2>
      <form id="login-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-[var(--text)] mb-1.5">Email</label>
          <input type="email" name="email" required autocomplete="email" class="input-base" placeholder="your@email.com">
        </div>
        <div>
          <label class="block text-sm font-medium text-[var(--text)] mb-1.5">密碼</label>
          <input type="password" name="password" required autocomplete="current-password" class="input-base" placeholder="••••••••">
        </div>
        <div id="login-error" class="hidden text-sm text-red-600"></div>
        <button type="submit" id="btn-login" class="w-full btn-primary py-2.5">
          登入
        </button>
      </form>
    </div>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    });
    const ORIGIN = '${origin}';

    document.getElementById('login-form').onsubmit = async (e) => {
      e.preventDefault();
      const form = e.target;
      const email = form.email.value?.trim();
      const password = form.password.value;
      const errEl = document.getElementById('login-error');
      const btnEl = document.getElementById('btn-login');
      errEl.classList.add('hidden');
      btnEl.disabled = true;
      try {
        const res = await fetch(ORIGIN + '/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include'
        });
        const json = await res.json();
        if (json.success) {
          window.location.href = ORIGIN + '/';
        } else {
          errEl.textContent = json.message || '登入失敗';
          errEl.classList.remove('hidden');
        }
      } catch (err) {
        errEl.textContent = '連線失敗: ' + (err.message || err);
        errEl.classList.remove('hidden');
      }
      btnEl.disabled = false;
    };
  </script>
</body>
</html>`;
}
