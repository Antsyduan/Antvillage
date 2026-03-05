-- Project: daily_token_limit 流量與額度配額
ALTER TABLE "Project" ADD COLUMN "daily_token_limit" INTEGER;

-- ProjectDailyUsage: 增加 token_count 欄位
ALTER TABLE "ProjectDailyUsage" ADD COLUMN "token_count" INTEGER NOT NULL DEFAULT 0;

-- AiSkill: 版本控管，支援 active 版本（SQLite 以 1 表示 true）
ALTER TABLE "AiSkill" ADD COLUMN "is_active" INTEGER NOT NULL DEFAULT 1;
