# 資料庫遷移指南：SQLite (D1) → SQL Server (Azure)

本文件說明如何將 AntVillageMgr 的資料庫從 Cloudflare D1 (SQLite) 遷移至 Azure SQL Server。

---

## 1. 環境變數調整

### 目前 (D1 / SQLite)

```env
# wrangler.toml 或 .dev.vars
DATABASE_URL="file:./local.db"   # 本地開發
# 或 D1 binding 自動注入

# Cloudflare Workers 部署時，D1 透過 wrangler.toml 的 [[d1_databases]] 綁定
# DATABASE_URL 由 Wrangler 自動設定
```

### 遷移後 (SQL Server)

```env
# 標準 SQL Server 連線字串
DATABASE_URL="sqlserver://<host>:<port>;database=<dbname>;user=<user>;password=<password>;encrypt=true"
```

或使用 Azure 格式：

```env
DATABASE_URL="sqlserver://<server>.database.windows.net:1433;database=<dbname>;user=<user>@<server>;password=<password>;encrypt=true;trustServerCertificate=false"
```

---

## 2. Prisma 設定調整

### 修改 `prisma/schema.prisma`

```prisma
datasource db {
  provider = "sqlserver"   // 從 "sqlite" 改為 "sqlserver"
  url      = env("DATABASE_URL")
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["microsoftSqlServer"]   // 啟用 SQL Server 支援
}
```

### 重新產生 Prisma Client

```bash
npx prisma generate
```

---

## 3. 部署環境變更

### Cloudflare Workers → 其他 Runtime

若遷移後不再使用 Cloudflare Workers：

- 移除 `wrangler.toml` 中的 D1 binding
- 改用 Node.js、Azure Functions 或其他支援 Prisma 的 runtime
- 確保 `getPrisma()` 能取得標準 Prisma Client（非 D1 adapter）

### 若仍使用 Workers + 外部 SQL Server

- Workers 需透過 HTTP 或 TCP 連線至 SQL Server（需確認 Cloudflare 網路限制）
- 或考慮使用 Prisma Data Proxy / Accelerate 作為中介

---

## 4. Migration 與 Seed 腳本

### 4.1 產生 SQL Server Migration

```bash
# 從現有 schema 產生遷移腳本
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/sqlserver_init.sql
```

產生的 SQL 需手動檢查，因 SQL Server 語法與 SQLite 有差異：

| SQLite           | SQL Server 對應        |
|------------------|------------------------|
| `TEXT`           | `NVARCHAR(MAX)`        |
| `INTEGER`        | `INT` / `BIGINT`       |
| `DATETIME`       | `DATETIME2`            |
| `DEFAULT CURRENT_TIMESTAMP` | `DEFAULT GETDATE()` |
| `AUTOINCREMENT`  | `IDENTITY(1,1)`       |

### 4.2 Seed 腳本差異

**目前 `prisma/seed.sql`（SQLite 專用）：**

- `INSERT OR IGNORE` → SQL Server 不支援，需改為 `MERGE` 或 `INSERT ... WHERE NOT EXISTS`
- `datetime('now')` → 改為 `GETDATE()` 或 `CURRENT_TIMESTAMP`

**SQL Server 版 Seed 範例：**

```sql
-- 使用 MERGE 達成 upsert
MERGE INTO Project AS target
USING (SELECT 'a1b2c3d4-0000-4000-8000-000000000001' AS id) AS source
ON target.id = source.id
WHEN NOT MATCHED THEN
  INSERT (id, name, description, third_party_key, domain_whitelist, status, created_at)
  VALUES ('a1b2c3d4-0000-4000-8000-000000000001', 'Demo Project', '...', 'demo_key_antvillage_2024', 'localhost,127.0.0.1', 'active', GETDATE());
```

建議遷移時以 Prisma Seed（`prisma/seed.ts`）取代純 SQL，可跨資料庫使用。

---

## 5. Repository 層相容性

目前專案 **Repository 層僅使用 Prisma ORM**，未使用任何 raw SQL 或 SQLite 專用函式：

- `project.repository.ts`：`findUnique`、`findMany`
- `permission.repository.ts`：`findUnique`、`findMany`

因此 **無需修改 Repository 程式碼**，只要 Prisma schema 與 `provider` 正確即可。

---

## 6. 檢查清單

- [ ] 更新 `DATABASE_URL` 為 SQL Server 連線字串
- [ ] 修改 `prisma/schema.prisma`：`provider = "sqlserver"`、`previewFeatures = ["microsoftSqlServer"]`
- [ ] 執行 `npx prisma generate`
- [ ] 建立 SQL Server 資料庫並執行 migration
- [ ] 準備 SQL Server 相容的 seed 腳本或改用 `prisma/seed.ts`
- [ ] 驗證所有 API 端點與 Dashboard 功能
- [ ] 確認 `MASTER_KEY` 等 secrets 已正確設定於新環境

---

## 7. 注意事項

- **Primary Key**：本專案已使用 UUID (String)，與 SQL Server 相容
- **JSON 欄位**：`scopes`、`payload` 等以 `String` 存 JSON，兩邊皆適用
- **大小寫**：SQL Server 預設區分大小寫，table/column 名稱需與 Prisma `@@map` 一致
