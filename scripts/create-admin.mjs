#!/usr/bin/env node
/**
 * 在 D1 直接新增 admin 帳號
 * 執行：node scripts/create-admin.mjs
 * 輸出 SQL 後執行：npx wrangler d1 execute antvillagemgr --remote --file=create_admin.sql
 */
const ITERATIONS = 100000;
const HASH_LENGTH = 32;
const SALT_LENGTH = 16;

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

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
  const email = "antsyduan@gmail.com";
  const password = "2816Tiom$";
  const name = "Admin";

  const hash = await hashPassword(password);
  const escapedHash = hash.replace(/'/g, "''");
  const userId = uuid();
  const adminScopes =
    '{"can_create":true,"can_delete":true,"can_edit":true,"can_read":true}';

  const userSql = `INSERT INTO "User" (id, email, password_hash, name, status, created_at) VALUES ('${userId}', '${email}', '${escapedHash}', '${name}', 'active', datetime('now'));`;

  const permSql = `INSERT INTO "Permission" (id, project_id, user_id, role, scopes) SELECT lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)),2) || '-' || hex(randomblob(6))), p.id, '${userId}', 'admin', '${adminScopes}' FROM "Project" p;`;

  const sql = `${userSql}\n${permSql}`;
  console.log(sql);
}

main().catch(console.error);
