/**
 * AES-256-GCM 加解密工具
 * 用於 SecretVault 金鑰保險箱
 * 使用 Web Crypto API，相容 Cloudflare Workers
 *
 * 金鑰格式：MASTER_KEY 需為 32 bytes，建議以 base64 編碼儲存於 env
 * 產生方式：openssl rand -base64 32
 */

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits，GCM 建議長度
const TAG_LENGTH = 128; // 128 bits = 16 bytes

export interface EncryptedPayload {
  encryptedData: string;
  iv: string;
  authTag: string;
}

/**
 * 從 base64 字串載入 MASTER_KEY 為 CryptoKey
 */
async function importMasterKey(masterKeyBase64: string): Promise<CryptoKey> {
  const keyBytes = base64Decode(masterKeyBase64);
  if (keyBytes.length !== 32) {
    throw new Error("MASTER_KEY must be 32 bytes (256 bits) for AES-256");
  }
  return crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * 加密明文
 * @param plaintext 原始字串（如 API Key）
 * @param masterKeyBase64 env.MASTER_KEY，base64 編碼的 32 bytes
 */
export async function encrypt(
  plaintext: string,
  masterKeyBase64: string
): Promise<EncryptedPayload> {
  const key = await importMasterKey(masterKeyBase64);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const data = new TextEncoder().encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv,
      tagLength: TAG_LENGTH,
    },
    key,
    data
  );

  // GCM 輸出格式：ciphertext + authTag (最後 16 bytes)
  const result = new Uint8Array(ciphertext);
  const tagSize = TAG_LENGTH / 8; // 16 bytes
  const ciphertextOnly = result.slice(0, -tagSize);
  const authTag = result.slice(-tagSize);

  return {
    encryptedData: base64Encode(ciphertextOnly),
    iv: base64Encode(iv),
    authTag: base64Encode(authTag),
  };
}

/**
 * 解密密文
 * @param payload SecretVault 的 encrypted_data, iv, auth_tag
 * @param masterKeyBase64 env.MASTER_KEY
 */
export async function decrypt(
  payload: EncryptedPayload,
  masterKeyBase64: string
): Promise<string> {
  const key = await importMasterKey(masterKeyBase64);
  const iv = base64Decode(payload.iv);
  const ciphertext = base64Decode(payload.encryptedData);
  const authTag = base64Decode(payload.authTag);

  // GCM 解密需要：iv + ciphertext + authTag 合併
  const combined = new Uint8Array(ciphertext.length + authTag.length);
  combined.set(ciphertext);
  combined.set(authTag, ciphertext.length);

  const plaintext = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv,
      tagLength: TAG_LENGTH,
    },
    key,
    combined
  );

  return new TextDecoder().decode(plaintext);
}

/**
 * 驗證 MASTER_KEY 格式是否正確
 */
export function validateMasterKeyFormat(masterKeyBase64: string): boolean {
  try {
    const keyBytes = base64Decode(masterKeyBase64);
    return keyBytes.length === 32;
  } catch {
    return false;
  }
}

function base64Encode(bytes: Uint8Array): string {
  const binary = String.fromCharCode(...bytes);
  return btoa(binary);
}

function base64Decode(str: string): Uint8Array {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
