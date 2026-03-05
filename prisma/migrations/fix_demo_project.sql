-- 修復 Demo Project：確保存在、status=active、domain 含 core.antsyduan.com
-- 執行：wrangler d1 execute antvillagemgr --remote --file=prisma/migrations/fix_demo_project.sql

-- 若 Demo Project 不存在則建立
INSERT OR IGNORE INTO "Project" (id, name, description, third_party_key, domain_whitelist, status, created_at)
VALUES
  ('a1b2c3d4-0000-4000-8000-000000000001', 'Demo Project', '用於 API 測試的示範專案', 'demo_key_antvillage_2024', 'localhost,127.0.0.1,core.antsyduan.com', 'active', datetime('now'));

-- 若已存在則更新為 active 並確保 domain 含 production
UPDATE "Project" SET status = 'active', domain_whitelist = 'localhost,127.0.0.1,core.antsyduan.com' WHERE third_party_key = 'demo_key_antvillage_2024';

-- 確保 customer_service_skill 存在
INSERT OR IGNORE INTO "AiSkill" (id, project_id, name, version, system_prompt, input_schema, output_schema, tools_config, is_verified, created_at, updated_at)
VALUES (
  's1b2c3d4-0000-4000-8000-000000000099',
  'a1b2c3d4-0000-4000-8000-000000000001',
  'customer_service_skill',
  '1.0.0',
  'You are a helpful and friendly AI customer service assistant. Respond in Traditional Chinese. Be concise, professional, and empathetic. If you cannot answer, politely suggest contacting human support.',
  '{"type":"object","properties":{"message":{"type":"string"},"text":{"type":"string"}},"required":[]}',
  '{"type":"object","properties":{"result":{"type":"string"}}}',
  NULL,
  1,
  datetime('now'),
  datetime('now')
);
