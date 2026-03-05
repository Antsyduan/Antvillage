-- 將所有使用者狀態設為 active（修正 USER_INACTIVE 錯誤）
UPDATE "User" SET status = 'active' WHERE status IS NULL OR status != 'active';
