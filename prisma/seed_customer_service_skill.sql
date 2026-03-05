-- 新增 customer_service_skill 至 Demo Project
-- 執行：wrangler d1 execute antvillagemgr --local --file=prisma/seed_customer_service_skill.sql

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
