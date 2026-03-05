-- 新增專案網址欄位
-- 執行：wrangler d1 execute antvillagemgr --remote --file=prisma/migrations/0007_project_website_url.sql
ALTER TABLE Project ADD COLUMN website_url TEXT;
