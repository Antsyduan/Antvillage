-- 專案配額：每分鐘調用上限
ALTER TABLE "Project" ADD COLUMN "quota_per_minute" INTEGER;
