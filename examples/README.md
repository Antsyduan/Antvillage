# AntVillageMgr 串接範例

## 萬用串接 Middleware（身分驗證）

`antvillage-auth-middleware.js` 示範外部網站如何**僅靠一組 3rdPKey** 在中台完成使用者身分驗證。

### 環境變數

| 變數 | 說明 |
|------|------|
| `ANTVILLAGE_BASE_URL` | 中台 API 網址（如 `https://antvillagemgr.workers.dev`） |
| `ANTVILLAGE_PROJECT_KEY` | 專案 3rd Party Key（可選，亦可由請求帶入） |

### 使用方式

1. **複製 middleware 到專案**
   ```bash
   cp examples/antvillage-auth-middleware.js your-project/middleware/
   ```

2. **Express 掛載**
   ```javascript
   const { antvillageAuthMiddleware } = require("./middleware/antvillage-auth-middleware");
   app.get("/api/protected", antvillageAuthMiddleware, (req, res) => {
     // req.antvillage.project
     // req.antvillage.permission
   });
   ```

3. **3rdPKey 來源**（依優先順序）
   - Header: `X-Project-Key`
   - Query: `project_key` 或 `key`
   - Body: `project_key`（POST JSON）
   - 環境變數: `ANTVILLAGE_PROJECT_KEY`

4. **選填：userId 權限查詢**
   - Header: `X-User-Id`
   - Query: `user_id`
   - Body: `userId` 或 `user_id`

   若提供 userId，中台會回傳該使用者在專案中的 `role` 與 `scopes`。

### 回應格式

驗證成功時 `req.antvillage`：

```json
{
  "valid": true,
  "project": { "id": "...", "name": "...", "description": "...", "domain_whitelist": "..." },
  "permission": { "role": "admin", "scopes": "{}" }
}
```

驗證失敗時回傳 401，body 含 `code`、`message`。
