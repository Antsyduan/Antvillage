/**
 * 登入頁
 */
export function loginHtml(_baseUrl: string): string {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>登入 — AntVillageMgr</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/icon-180.png" sizes="180x180">
  <link rel="manifest" href="/manifest.json">
  <meta name="apple-mobile-web-app-title" content="AntVillageMgr">
  <meta name="theme-color" content="#0ea5e9">
  <link rel="stylesheet" href="/styles.css">
  <script src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js" defer></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { background: var(--bg); display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left)); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans TC', sans-serif; -webkit-text-size-adjust: 100%; }
    .login-card { box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1), 0 4px 12px -4px rgba(0,0,0,0.06); }
    #login-form input { font-size: 16px !important; }
  </style>
</head>
<body>
  <div class="w-full max-w-md p-4 sm:p-6">
    <div class="card login-card p-8">
      <div class="flex items-center gap-3 mb-8">
        <img src="/logo.svg" alt="AntVillageMgr" class="w-12 h-12 rounded-xl flex-shrink-0 shadow-lg" width="48" height="48">
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
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include'
        });
        const json = await res.json();
        if (json.success) {
          window.location.href = '/';
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
