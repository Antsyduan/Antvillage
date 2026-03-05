/**
 * AI 智能客服 Demo 頁面
 * 調用 customer_service_skill
 */
export function customerServiceDemoHtml(baseUrl: string): string {
  const origin = new URL(baseUrl).origin;
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AI 智能客服 — AntVillageMgr Demo</title>
  <link rel="stylesheet" href="/styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { font-family: 'Inter', system-ui, sans-serif; }
    body { background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%); min-height: 100vh; -webkit-font-smoothing: antialiased; }
    .chat-bubble { max-width: 85%; transition: transform 0.2s ease; }
    .chat-user { margin-left: auto; background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; box-shadow: 0 4px 12px -2px rgba(37, 99, 235, 0.4); }
    .chat-ai { background: rgba(51, 65, 85, 0.8); color: #e2e8f0; border: 1px solid rgba(71, 85, 105, 0.5); backdrop-filter: blur(8px); }
    .chat-input-wrap { box-shadow: 0 -4px 24px -4px rgba(0, 0, 0, 0.2); }
  </style>
</head>
<body class="text-slate-100">
  <div class="max-w-2xl mx-auto min-h-screen flex flex-col p-4">
    <header class="py-8 text-center">
      <h1 class="text-2xl font-bold tracking-tight">AI 智能客服</h1>
      <p class="text-slate-400 text-sm mt-2">由 AntVillageMgr 中台驅動 · 技能：customer_service_skill</p>
    </header>

    <main class="flex-1 flex flex-col">
      <div id="chat-container" class="flex-1 overflow-y-auto space-y-4 mb-4">
        <div class="chat-bubble chat-ai rounded-2xl rounded-br-md px-4 py-3 text-sm">
          您好！我是 AI 客服，請問有什麼可以協助您的？
        </div>
      </div>

      <form id="chat-form" class="flex gap-3 chat-input-wrap pt-4">
        <input type="text" id="chat-input" placeholder="輸入您的問題..." autocomplete="off"
          class="flex-1 px-4 py-3 rounded-xl bg-slate-700/60 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200">
        <button type="submit" id="chat-send" class="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25 text-white font-medium transition-all duration-200 disabled:opacity-50">
          送出
        </button>
      </form>
    </main>
  </div>

  <script>
    const CONFIG = {
      NEXUS_BASE: '${origin}',
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
        if (!data.success) throw new Error(data.message || data.code);
        return data.data.result;
      }
    }

    const client = NexusClient.init(CONFIG.THIRD_P_KEY);
    const container = document.getElementById('chat-container');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');

    function addMessage(text, isUser) {
      const div = document.createElement('div');
      div.className = 'chat-bubble rounded-2xl px-4 py-3 text-sm ' + (isUser ? 'chat-user rounded-bl-2xl rounded-br-md' : 'chat-ai rounded-br-2xl rounded-bl-md');
      div.textContent = text;
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    form.onsubmit = async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      sendBtn.disabled = true;
      addMessage(text, true);
      try {
        const result = await client.callSkill(CONFIG.SKILL_ID, { message: text, text: text });
        addMessage(result, false);
      } catch (err) {
        addMessage('抱歉，發生錯誤：' + (err.message || err), false);
      }
      sendBtn.disabled = false;
    };
  </script>
</body>
</html>`;
}
