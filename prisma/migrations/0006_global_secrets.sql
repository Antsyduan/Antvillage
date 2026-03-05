-- User: is_system_admin
ALTER TABLE "User" ADD COLUMN "is_system_admin" INTEGER NOT NULL DEFAULT 0;

-- GlobalSecret: 全域 API 金鑰
CREATE TABLE "GlobalSecret" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider_type" TEXT NOT NULL,
    "key_name" TEXT NOT NULL,
    "encrypted_data" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "auth_tag" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT
);

CREATE UNIQUE INDEX "GlobalSecret_provider_type_key_name_key" ON "GlobalSecret"("provider_type", "key_name");

-- ProjectGlobalSecretMap: 專案可使用哪些全域金鑰
CREATE TABLE "ProjectGlobalSecretMap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project_id" TEXT NOT NULL,
    "global_secret_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectGlobalSecretMap_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjectGlobalSecretMap_global_secret_id_fkey" FOREIGN KEY ("global_secret_id") REFERENCES "GlobalSecret" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "ProjectGlobalSecretMap_project_id_global_secret_id_key" ON "ProjectGlobalSecretMap"("project_id", "global_secret_id");
