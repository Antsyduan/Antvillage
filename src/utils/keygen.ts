/**
 * 3rdPKey 產生器
 * 格式：av_ + 32 字元 hex（隨機）
 */
export function generateThirdPartyKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `av_${hex}`;
}
