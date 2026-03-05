/**
 * AI 智能客服 Demo 頁面
 * 調用 customer_service_skill
 */
export function customerServiceDemoHtml(_baseUrl: string): string {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>AI 智能客服 — AntVillageMgr</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/icon-180.png" sizes="180x180">
  <link rel="manifest" href="/manifest.json">
  <meta name="apple-mobile-web-app-title" content="AntVillageMgr">
  <meta name="theme-color" content="#0ea5e9">
  <link rel="stylesheet" href="/styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --cs-bg: #0a0f1a;
      --cs-surface: #111827;
      --cs-surface-elevated: #1f2937;
      --cs-border: rgba(148, 163, 184, 0.1);
      --cs-text: #f8fafc;
      --cs-text-muted: #94a3b8;
      --cs-accent: #0ea5e9;
      --cs-accent-hover: #38bdf8;
      --cs-user-bg: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
      --cs-ai-bg: rgba(30, 41, 59, 0.85);
      --cs-input-bg: rgba(15, 23, 42, 0.8);
      --cs-pill-bg: rgba(30, 41, 59, 0.6);
      --cs-pill-hover: rgba(14, 165, 233, 0.2);
      --cs-radius: 14px;
      --cs-radius-sm: 10px;
    }
    * { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif; box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--cs-bg);
      color: var(--cs-text);
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      background-image:
        radial-gradient(ellipse 100% 60% at 50% -10%, rgba(14, 165, 233, 0.12), transparent 60%),
        radial-gradient(ellipse 50% 30% at 100% 80%, rgba(6, 182, 212, 0.06), transparent);
    }
    @media (max-width: 767px) {
      body { font-size: 16px; line-height: 1.6; }
      .demo-layout { padding: 0 max(1rem, env(safe-area-inset-left)) max(1rem, env(safe-area-inset-right)); }
    }
    .demo-layout {
      max-width: 44rem;
      margin: 0 auto;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 0 1.25rem;
    }
    .demo-header {
      flex-shrink: 0;
      text-align: center;
      padding: 1.75rem 0 1.25rem;
    }
    .demo-header h1 {
      font-size: 1.375rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      margin: 0 0 0.2rem 0;
      color: var(--cs-text);
    }
    .demo-header p {
      font-size: 0.8125rem;
      color: var(--cs-text-muted);
      margin: 0;
    }
    .chat-container {
      flex: 1;
      overflow-y: auto;
      padding: 0.5rem 0 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
      scroll-behavior: smooth;
      min-height: 0;
    }
    .chat-bubble {
      max-width: 90%;
      padding: 1rem 1.25rem;
      font-size: 0.9375rem;
      line-height: 1.6;
      border-radius: var(--cs-radius);
      animation: bubbleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes bubbleIn {
      from { opacity: 0; transform: translateY(10px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .chat-user {
      align-self: flex-end;
      background: var(--cs-user-bg);
      color: white;
      box-shadow: 0 4px 16px -4px rgba(14, 165, 233, 0.45);
      border-radius: var(--cs-radius) var(--cs-radius) 5px var(--cs-radius);
    }
    .chat-ai {
      align-self: flex-start;
      background: var(--cs-ai-bg);
      border: 1px solid var(--cs-border);
      backdrop-filter: blur(16px);
      border-radius: 5px var(--cs-radius) var(--cs-radius) var(--cs-radius);
      color: var(--cs-text);
    }
    .chat-ai.error-msg {
      border-color: rgba(239, 68, 68, 0.25);
    }
    .welcome-card {
      align-self: stretch;
      padding: 1.25rem 1.5rem;
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(6, 182, 212, 0.04) 100%);
      border: 1px solid rgba(14, 165, 233, 0.2);
      border-radius: var(--cs-radius);
      margin-bottom: 0.5rem;
    }
    .welcome-card h3 { font-size: 0.875rem; font-weight: 600; margin: 0 0 0.5rem 0; color: var(--cs-accent); }
    .welcome-card p { font-size: 0.8125rem; line-height: 1.55; color: var(--cs-text-muted); margin: 0 0 0.75rem 0; }
    .welcome-card p:last-of-type { margin-bottom: 0; }
    .suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }
    .suggestion-pill {
      padding: 0.5rem 0.875rem;
      font-size: 0.8125rem;
      border-radius: 999px;
      background: var(--cs-pill-bg);
      border: 1px solid var(--cs-border);
      color: var(--cs-text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }
    .suggestion-pill:hover {
      background: var(--cs-pill-hover);
      border-color: rgba(14, 165, 233, 0.4);
      color: var(--cs-text);
    }
    .chat-input-wrap {
      flex-shrink: 0;
      padding: 1rem 0 1.25rem;
      background: linear-gradient(to top, var(--cs-bg) 70%, transparent);
    }
    .chat-form {
      display: flex;
      gap: 0.625rem;
      align-items: center;
      padding: 0.25rem;
      background: var(--cs-surface);
      border: 1px solid var(--cs-border);
      border-radius: var(--cs-radius-sm);
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .chat-form:focus-within {
      border-color: rgba(14, 165, 233, 0.5);
      box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
    }
    .chat-input {
      flex: 1;
      padding: 0.75rem 1rem;
      font-size: 0.9375rem;
      border: none;
      background: transparent;
      color: var(--cs-text);
    }
    .chat-input::placeholder { color: var(--cs-text-muted); }
    .chat-input:focus { outline: none; }
    .chat-send {
      padding: 0.625rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 8px;
      border: none;
      background: var(--cs-accent);
      color: white;
      cursor: pointer;
      transition: background 0.2s, transform 0.15s;
    }
    .chat-send:hover:not(:disabled) {
      background: var(--cs-accent-hover);
      transform: translateY(-1px);
    }
    .chat-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .typing-indicator {
      align-self: flex-start;
      padding: 1rem 1.25rem;
      background: var(--cs-ai-bg);
      border: 1px solid var(--cs-border);
      border-radius: 5px var(--cs-radius) var(--cs-radius) var(--cs-radius);
      display: flex;
      gap: 5px;
    }
    .typing-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--cs-text-muted);
      animation: typingBounce 1.4s ease-in-out infinite;
    }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-5px); }
    }
    .chat-ai strong { font-weight: 600; color: var(--cs-text); }
    .chat-ai code { background: rgba(0,0,0,0.2); padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.9em; }
    .chat-ai ul, .chat-ai ol { margin: 0.5em 0; padding-left: 1.25em; }
    .chat-ai li { margin: 0.25em 0; }
    .chat-ai p { margin: 0.5em 0; }
    .chat-ai p:first-child { margin-top: 0; }
    .chat-ai p:last-child { margin-bottom: 0; }
  </style>
</head>
<body>
  <div class="demo-layout">
    <header class="demo-header">
      <h1>AI 智能客服</h1>
      <p>AntVillageMgr 中台 · 由 Google Gemini 驅動</p>
    </header>

    <main class="chat-container" id="chat-container">
      <div class="chat-bubble chat-ai">
        您好！我是 AntVillageMgr 的 AI 客服，可以協助您了解平台功能、AI Skills 串接方式等問題。
      </div>
      <div class="welcome-card">
        <h3>我可以協助您</h3>
        <p>說明 AntVillageMgr 的專案管理、AI Skills、全域金鑰等服務；回答一般問答、摘要、翻譯等。</p>
        <div class="suggestions" id="suggestions">
          <button type="button" class="suggestion-pill" data-prompt="這個網站主要提供什麼服務？">這個網站主要提供什麼服務？</button>
          <button type="button" class="suggestion-pill" data-prompt="什麼是 AI Skill？如何串接？">什麼是 AI Skill？如何串接？</button>
          <button type="button" class="suggestion-pill" data-prompt="幫我摘要這段文字：AI 中台可以讓多個子網站共用同一套 AI 能力。">幫我摘要</button>
        </div>
      </div>
    </main>

    <div class="chat-input-wrap">
      <form class="chat-form" id="chat-form">
        <input type="text" id="chat-input" class="chat-input" placeholder="輸入您的問題..." autocomplete="off">
        <button type="submit" id="chat-send" class="chat-send">送出</button>
      </form>
    </div>
  </div>

  <script>
    const CONFIG = {
      NEXUS_BASE: '',
      THIRD_P_KEY: 'demo_key_antvillage_2024',
      SKILL_ID: 'customer_service_skill'
    };

    class NexusClient {
      constructor(thirdPKey) { this.key = thirdPKey; }
      static init(thirdPKey) { return new NexusClient(thirdPKey); }
      async callSkill(skillId, params) {
        const res = await fetch(CONFIG.NEXUS_BASE + '/v1/ai/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Project-Key': this.key },
          body: JSON.stringify({ skill_id: skillId, params })
        });
        const data = await res.json();
        if (!data.success) {
          const err = new Error(data.message || data.code);
          err.code = data.code;
          throw err;
        }
        return data.data.result;
      }
    }

    const client = NexusClient.init(CONFIG.THIRD_P_KEY);
    const container = document.getElementById('chat-container');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');

    function escapeHtml(s) {
      const div = document.createElement('div');
      div.textContent = s;
      return div.innerHTML;
    }
    function formatAiMessage(text) {
      if (!text || typeof text !== 'string') return '';
      let s = escapeHtml(text);
      s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      s = s.replace(new RegExp(String.fromCharCode(96) + '([^' + String.fromCharCode(96) + ']+)' + String.fromCharCode(96), 'g'), '<code>$1</code>');
      const lines = s.split('\n');
      const out = [];
      let inList = false;
      const listRe = /^(\d+)\.\s+(.+)$/;
      for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(listRe);
        if (m) {
          if (!inList) { out.push('<ol>'); inList = true; }
          out.push('<li>' + m[2] + '</li>');
        } else {
          if (inList) { out.push('</ol>'); inList = false; }
          if (lines[i].trim()) out.push('<p>' + lines[i] + '</p>');
        }
      }
      if (inList) out.push('</ol>');
      return out.length ? out.join('') : s.replace(/\n/g, '<br>');
    }
    function addMessage(text, isUser, isError) {
      const div = document.createElement('div');
      div.className = 'chat-bubble ' + (isUser ? 'chat-user' : 'chat-ai' + (isError ? ' error-msg' : ''));
      if (isUser || isError) {
        div.textContent = text;
      } else {
        div.innerHTML = formatAiMessage(text);
      }
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    function addTypingIndicator() {
      const div = document.createElement('div');
      div.className = 'typing-indicator';
      div.id = 'typing-indicator';
      div.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    function removeTypingIndicator() {
      const el = document.getElementById('typing-indicator');
      if (el) el.remove();
    }

    function formatError(code, msg) {
      const map = {
        MASTER_KEY_NOT_CONFIGURED: '伺服器未設定 MASTER_KEY，請聯繫管理員',
        NO_GEMINI_KEY: '此專案尚未設定 Gemini API 金鑰，請至全域 API 金鑰新增並授權給 Demo Project',
        SKILL_NOT_FOUND: '找不到 customer_service_skill，請聯繫管理員確認設定',
        INVALID_PROJECT_KEY: '專案金鑰驗證失敗，請重新整理頁面或聯繫管理員',
        AI_ERROR: (msg || '').includes('quota') ? 'API 配額已用盡，請稍後再試或至 Google AI Studio 檢查用量' : null
      };
      return map[code] ?? (code === 'AI_ERROR' ? map.AI_ERROR : null);
    }

    async function sendMessage(text) {
      if (!text.trim()) return;
      input.value = '';
      sendBtn.disabled = true;
      addMessage(text, true);
      addTypingIndicator();
      try {
        const result = await client.callSkill(CONFIG.SKILL_ID, { message: text, text: text });
        removeTypingIndicator();
        addMessage(result, false);
      } catch (err) {
        removeTypingIndicator();
        const friendly = formatError(err.code, err.message);
        addMessage('抱歉，發生錯誤：' + (friendly || (err.message || '').slice(0, 120)), false, true);
      }
      sendBtn.disabled = false;
    }

    form.onsubmit = async (e) => {
      e.preventDefault();
      await sendMessage(input.value.trim());
    };

    document.getElementById('suggestions').addEventListener('click', (e) => {
      const pill = e.target.closest('.suggestion-pill');
      if (pill) sendMessage(pill.dataset.prompt);
    });
  </script>
</body>
</html>`;
}
