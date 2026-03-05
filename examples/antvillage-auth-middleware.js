/**
 * 萬用串接 Middleware 範例
 * 外部網站僅靠一組 3rdPKey 即可在中台完成使用者身分驗證
 *
 * 使用方式：
 *   1. 設定環境變數 ANTVILLAGE_BASE_URL、ANTVILLAGE_PROJECT_KEY
 *   2. 將此 middleware 掛載到需要驗證的路由
 *   3. 驗證成功後 req.antvillage 會包含 project 與 permission
 *
 * 依賴：無（僅用 Node.js 內建 fetch）
 */

const ANTVILLAGE_VERIFY_URL =
  (process.env.ANTVILLAGE_BASE_URL?.replace(/\/$/, "") || "https://your-antvillagemgr.workers.dev") +
  "/v1/auth/verify";

const HEADER_PROJECT_KEY = "x-project-key";

/**
 * 從請求中取得 3rdPKey
 * 優先順序：Header > Query > Body（若為 POST JSON）
 */
async function getProjectKeyFromRequest(req) {
  const key =
    req.headers?.[HEADER_PROJECT_KEY] ||
    req.headers?.["x-project-key"] ||
    req.query?.project_key ||
    req.query?.key;

  if (key) return key;

  // 若為 POST 且 body 含 project_key
  if (req.method === "POST" && req.body?.project_key) {
    return req.body.project_key;
  }

  return process.env.ANTVILLAGE_PROJECT_KEY;
}

/**
 * 從請求中取得 userId（選填，用於權限查詢）
 */
function getUserIdFromRequest(req) {
  return (
    req.headers?.["x-user-id"] ||
    req.query?.user_id ||
    req.body?.userId ||
    req.body?.user_id
  );
}

/**
 * Express 風格 Middleware
 * 用法：app.use(antvillageAuthMiddleware)
 * 或：app.get("/protected", antvillageAuthMiddleware, handler)
 */
async function antvillageAuthMiddleware(req, res, next) {
  const projectKey = await getProjectKeyFromRequest(req);
  if (!projectKey) {
    return res.status(401).json({
      success: false,
      code: "MISSING_PROJECT_KEY",
      message: "請提供 X-Project-Key header、query key 或設定 ANTVILLAGE_PROJECT_KEY",
    });
  }

  const userId = getUserIdFromRequest(req);

  try {
    const verifyRes = await fetch(ANTVILLAGE_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [HEADER_PROJECT_KEY]: projectKey,
      },
      body: JSON.stringify(userId ? { userId } : {}),
    });

    const data = await verifyRes.json();

    if (!verifyRes.ok || !data?.data?.valid) {
      return res.status(401).json({
        success: false,
        code: data?.data?.code ?? "INVALID_PROJECT_KEY",
        message: data?.data?.message ?? "無效或已停用的專案金鑰",
      });
    }

    req.antvillage = {
      valid: data.data.valid,
      project: data.data.project,
      permission: data.data.permission ?? null,
    };
    next();
  } catch (err) {
    return res.status(502).json({
      success: false,
      code: "AUTH_SERVICE_ERROR",
      message: err.message ?? "中台驗證服務連線失敗",
    });
  }
}

/**
 * 純函式版本（非 Express，適用於 Hono、Fastify 等）
 * 回傳 { ok: true, project, permission } 或 { ok: false, status, body }
 */
async function verifyWithAntvillage(projectKey, userId) {
  const res = await fetch(ANTVILLAGE_VERIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [HEADER_PROJECT_KEY]: projectKey,
    },
    body: JSON.stringify(userId ? { userId } : {}),
  });

  const data = await res.json();

  if (!res.ok || !data?.data?.valid) {
    return {
      ok: false,
      status: res.status,
      body: data,
    };
  }

  return {
    ok: true,
    project: data.data.project,
    permission: data.data.permission ?? null,
  };
}

// ========== Express 使用範例 ==========
/*
const express = require("express");
const { antvillageAuthMiddleware } = require("./antvillage-auth-middleware");

const app = express();
app.use(express.json());

// 環境變數
process.env.ANTVILLAGE_BASE_URL = "https://antvillagemgr.workers.dev";
process.env.ANTVILLAGE_PROJECT_KEY = "your-3rd-party-key";

// 保護路由：僅需 3rdPKey 即可驗證
app.get("/api/protected", antvillageAuthMiddleware, (req, res) => {
  res.json({
    message: "已通過中台驗證",
    project: req.antvillage.project,
    permission: req.antvillage.permission,
  });
});

// 或由 client 傳入 X-Project-Key header
app.post("/api/action", antvillageAuthMiddleware, (req, res) => {
  if (req.antvillage.permission?.role === "admin") {
    // 管理員邏輯
  }
  res.json({ ok: true });
});
*/

// 匯出
module.exports = {
  antvillageAuthMiddleware,
  verifyWithAntvillage,
  getProjectKeyFromRequest,
  getUserIdFromRequest,
};
