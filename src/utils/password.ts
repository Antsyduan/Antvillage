/**
 * 密碼雜湊工具（PBKDF2）
 * 使用 Web Crypto API，相容 Cloudflare Workers
 */
const ITERATIONS = 100000;
const HASH_LENGTH = 32;
const SALT_LENGTH = 16;

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    HASH_LENGTH * 8
  );
  const hash = new Uint8Array(derived);
  const combined = new Uint8Array(SALT_LENGTH + HASH_LENGTH);
  combined.set(salt);
  combined.set(hash, SALT_LENGTH);
  return btoa(String.fromCharCode(...combined));
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const combined = new Uint8Array(
    atob(storedHash)
      .split("")
      .map((c) => c.charCodeAt(0))
  );
  const salt = combined.slice(0, SALT_LENGTH);
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    HASH_LENGTH * 8
  );
  const hash = new Uint8Array(derived);
  for (let i = 0; i < HASH_LENGTH; i++) {
    if (hash[i] !== combined[SALT_LENGTH + i]) return false;
  }
  return true;
}
