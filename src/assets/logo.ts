/**
 * AntVillageMgr 專屬 Logo — 螞蟻村莊 · 數位管理
 * 設計概念：幾何螞蟻 + 六角蜂巢，象徵協作、秩序與 AI 管理
 */

export const logoFullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <defs>
    <linearGradient id="avm-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e293b"/>
    </linearGradient>
    <linearGradient id="avm-ant" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f8fafc"/>
      <stop offset="100%" style="stop-color:#e2e8f0"/>
    </linearGradient>
    <linearGradient id="avm-accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#38bdf8"/>
      <stop offset="100%" style="stop-color:#0ea5e9"/>
    </linearGradient>
    <filter id="avm-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#0ea5e9" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- 六角蜂巢底座（村莊意象） -->
  <path d="M24 4 L42 14 L42 34 L24 44 L6 34 L6 14 Z" fill="url(#avm-bg)" stroke="rgba(14,165,233,0.5)" stroke-width="1.2"/>
  <!-- 螞蟻主體 -->
  <ellipse cx="24" cy="18" rx="6" ry="5" fill="url(#avm-ant)"/>
  <ellipse cx="24" cy="30" rx="5" ry="6" fill="url(#avm-ant)"/>
  <ellipse cx="24" cy="40" rx="4" ry="5" fill="url(#avm-ant)"/>
  <!-- 觸角（形成 A 字意象） -->
  <path d="M20 14 Q18 8 22 6" stroke="url(#avm-accent)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M28 14 Q30 8 26 6" stroke="url(#avm-accent)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <!-- 螞蟻頭部高光 -->
  <ellipse cx="22" cy="16" rx="2" ry="1.5" fill="rgba(255,255,255,0.6)"/>
  <!-- 科技節點（數位感） -->
  <circle cx="24" cy="24" r="2" fill="url(#avm-accent)" filter="url(#avm-glow)"/>
</svg>`;

/** 簡化版 favicon 用（小尺寸清晰） */
export const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <defs>
    <linearGradient id="avm-fav-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a"/>
      <stop offset="100%" style="stop-color:#1e293b"/>
    </linearGradient>
    <linearGradient id="avm-fav-accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#38bdf8"/>
      <stop offset="100%" style="stop-color:#0ea5e9"/>
    </linearGradient>
  </defs>
  <path d="M24 4 L42 14 L42 34 L24 44 L6 34 L6 14 Z" fill="url(#avm-fav-bg)" stroke="#0ea5e9" stroke-width="1"/>
  <ellipse cx="24" cy="18" rx="6" ry="5" fill="#f1f5f9"/>
  <ellipse cx="24" cy="30" rx="5" ry="6" fill="#f1f5f9"/>
  <ellipse cx="24" cy="40" rx="4" ry="5" fill="#f1f5f9"/>
  <path d="M20 14 Q18 8 22 6" stroke="url(#avm-fav-accent)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M28 14 Q30 8 26 6" stroke="url(#avm-fav-accent)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <circle cx="24" cy="24" r="2" fill="#0ea5e9"/>
</svg>`;
