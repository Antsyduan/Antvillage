#!/usr/bin/env node
/**
 * 更新 admin 帳號 Email 與密碼
 * 執行：node scripts/update-admin.mjs
 * 會輸出 SQL，再執行：npx wrangler d1 execute antvillagemgr --remote --command "UPDATE ..."
 */
const ITERATIONS = 100000;
const HASH_LENGTH = 32;
const SALT_LENGTH = 16;

async function hashPassword(password) {
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
  return Buffer.from(combined).toString("base64");
}

async function main() {
  const newEmail = "antsyduan@gmail.com";
  const newPassword = "2816Tiom$";
  const oldEmail = "admin@antvillage.local";

  const hash = await hashPassword(newPassword);
  const escapedHash = hash.replace(/'/g, "''");
  const sql = `UPDATE "User" SET email='${newEmail}', password_hash='${escapedHash}' WHERE email='${oldEmail}';`;

  console.log("-- 更新 admin 帳號為 antsyduan@gmail.com");
  console.log("-- 將下方 SQL 存檔後執行：npx wrangler d1 execute antvillagemgr --remote --file=update_admin.sql");
  console.log("");
  console.log(sql);
}

main().catch(console.error);
