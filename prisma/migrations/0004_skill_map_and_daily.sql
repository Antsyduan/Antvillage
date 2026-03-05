-- ProjectSkillMap: Skills 作用域限制
CREATE TABLE "ProjectSkillMap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectSkillMap_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjectSkillMap_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "AiSkill" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "ProjectSkillMap_project_id_skill_id_key" ON "ProjectSkillMap"("project_id", "skill_id");

-- Project: max_daily_calls
ALTER TABLE "Project" ADD COLUMN "max_daily_calls" INTEGER;

-- ProjectDailyUsage: 每日使用量
CREATE TABLE "ProjectDailyUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project_id" TEXT NOT NULL,
    "date_key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "ProjectDailyUsage_project_id_date_key_key" ON "ProjectDailyUsage"("project_id", "date_key");
