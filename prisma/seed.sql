-- 測試用種子資料（9 專案 + AI Skills + Audit Logs）
-- 執行：wrangler d1 execute antvillagemgr --local --file=prisma/seed.sql

INSERT OR IGNORE INTO "Project" (id, name, description, third_party_key, domain_whitelist, status, created_at)
VALUES
  ('a1b2c3d4-0000-4000-8000-000000000001', 'Demo Project', '用於 API 測試的示範專案', 'demo_key_antvillage_2024', 'localhost,127.0.0.1', 'active', datetime('now')),
  ('a1b2c3d4-0000-4000-8000-000000000002', 'E-Commerce Hub', '電商整合平台', 'ec_key_antvillage_2024', 'shop.example.com', 'active', datetime('now')),
  ('a1b2c3d4-0000-4000-8000-000000000003', 'Content Studio', '內容創作工作台', 'content_key_antvillage_2024', 'studio.example.com', 'active', datetime('now')),
  ('a1b2c3d4-0000-4000-8000-000000000004', 'Analytics Nexus', '數據分析中心', 'analytics_key_antvillage_2024', 'analytics.example.com', 'active', datetime('now')),
  ('a1b2c3d4-0000-4000-8000-000000000005', 'Support Portal', '客服支援入口', 'support_key_antvillage_2024', 'support.example.com', 'suspended', datetime('now')),
  ('a1b2c3d4-0000-4000-8000-000000000006', 'Marketing Lab', '行銷實驗室', 'marketing_key_antvillage_2024', 'marketing.example.com', 'active', datetime('now')),
  ('a1b2c3d4-0000-4000-8000-000000000007', 'Dev Sandbox', '開發沙盒環境', 'dev_key_antvillage_2024', 'dev.localhost', 'active', datetime('now')),
  ('a1b2c3d4-0000-4000-8000-000000000008', 'HR Portal', '人資管理系統', 'hr_key_antvillage_2024', 'hr.example.com', 'active', datetime('now')),
  ('a1b2c3d4-0000-4000-8000-000000000009', 'Legacy Bridge', '舊系統橋接', 'legacy_key_antvillage_2024', 'legacy.example.com', 'suspended', datetime('now'));

INSERT OR IGNORE INTO "User" (id, email, password_hash, name, status, created_at)
VALUES
  ('u1b2c3d4-0000-4000-8000-000000000001', 'demo@antvillage.local', 'placeholder_hash', 'Demo User', 'active', datetime('now')),
  ('u1b2c3d4-0000-4000-8000-000000000002', 'admin@antvillage.local', 'placeholder_hash', 'Admin', 'active', datetime('now'));

INSERT OR IGNORE INTO "Permission" (id, project_id, user_id, role, scopes)
VALUES
  ('p1b2c3d4-0000-4000-8000-000000000001', 'a1b2c3d4-0000-4000-8000-000000000001', 'u1b2c3d4-0000-4000-8000-000000000001', 'admin', '{"can_create":true,"can_delete":true,"can_edit":true,"can_read":true}'),
  ('p1b2c3d4-0000-4000-8000-000000000002', 'a1b2c3d4-0000-4000-8000-000000000002', 'u1b2c3d4-0000-4000-8000-000000000001', 'editor', '{"can_create":true,"can_delete":false,"can_edit":true,"can_read":true}'),
  ('p1b2c3d4-0000-4000-8000-000000000003', 'a1b2c3d4-0000-4000-8000-000000000003', 'u1b2c3d4-0000-4000-8000-000000000001', 'viewer', '{"can_create":false,"can_delete":false,"can_edit":false,"can_read":true}');

INSERT OR IGNORE INTO "AiSkill" (id, project_id, name, version, system_prompt, input_schema, output_schema, tools_config, is_verified, created_at, updated_at)
VALUES
  ('s1b2c3d4-0000-4000-8000-000000000001', 'a1b2c3d4-0000-4000-8000-000000000001', 'Summarize', '1.0.0', 'You are a summarization assistant.', '{"type":"object","properties":{"text":{"type":"string"},"maxLength":{"type":"number"}}}', '{"type":"object","properties":{"summary":{"type":"string"}}}', NULL, 1, datetime('now'), datetime('now')),
  ('s1b2c3d4-0000-4000-8000-000000000002', 'a1b2c3d4-0000-4000-8000-000000000001', 'Translate', '1.0.0', 'You are a translator.', '{"type":"object","properties":{"text":{"type":"string"},"targetLang":{"type":"string"}}}', NULL, NULL, 0, datetime('now'), datetime('now')),
  ('s1b2c3d4-0000-4000-8000-000000000003', 'a1b2c3d4-0000-4000-8000-000000000002', 'Product Recommender', '1.0.0', 'Recommend products based on user preferences.', '{"type":"object","properties":{"userId":{"type":"string"},"category":{"type":"string"}}}', NULL, NULL, 1, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO "AuditLog" (id, project_id, user_id, action, target, payload, ip_address, timestamp)
VALUES
  ('l1b2c3d4-0000-4000-8000-000000000001', 'a1b2c3d4-0000-4000-8000-000000000001', 'u1b2c3d4-0000-4000-8000-000000000001', 'VERIFY_KEY', NULL, '{"project_key":"demo_key_antvillage_2024"}', '127.0.0.1', datetime('now')),
  ('l1b2c3d4-0000-4000-8000-000000000002', 'a1b2c3d4-0000-4000-8000-000000000001', NULL, 'CREATE_SKILL', 's1b2c3d4-0000-4000-8000-000000000001', '{"name":"Summarize"}', NULL, datetime('now')),
  ('l1b2c3d4-0000-4000-8000-000000000003', 'a1b2c3d4-0000-4000-8000-000000000002', 'u1b2c3d4-0000-4000-8000-000000000001', 'ACCESS_SECRET', 'GEMINI_API_KEY', NULL, '192.168.1.1', datetime('now'));
