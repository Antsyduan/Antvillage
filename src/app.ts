/**
 * AntVillageMgr - Hono App
 */
import { Hono } from "hono";
import type { HonoEnv } from "./types";
import { tailwindStyles } from "./generated/tailwind-css";
import { requireAuth, requireSystemAdmin } from "./middleware/auth";
import { handleVerify } from "./controllers/auth.controller";
import { login, logout, me } from "./controllers/login.controller";
import {
  listProjects,
  listSkills,
  listAuditLogs,
  listAuditStats,
} from "./controllers/dashboard.controller";
import {
  getProjectById,
  createSkill,
} from "./controllers/project.controller";
import { createProject } from "./controllers/project-create.controller";
import {
  listUsers,
  createUser,
  updateUserPermissions,
} from "./controllers/user.controller";
import { createSecret } from "./controllers/secret.controller";
import { testSkill } from "./controllers/sandbox.controller";
import { injectSkills } from "./controllers/skill-inject.controller";
import { registerSkill } from "./controllers/admin-skill-register.controller";
import { executeAi } from "./controllers/ai.controller";
import { checkSecrets, skillsDoc } from "./controllers/trust.controller";
import {
  listGlobalSecrets,
  createGlobalSecret,
  updateGlobalSecretGrants,
  deleteGlobalSecret,
} from "./controllers/global-secret.controller";
import { dashboardHtml } from "./views/dashboard";
import { globalSecretsHtml } from "./views/global-secrets";
import { projectDetailHtml } from "./views/project-detail";
import { usersHtml } from "./views/users";
import { loginHtml } from "./views/login";
import { customerServiceDemoHtml } from "./views/customer-service-demo";

const app = new Hono<HonoEnv>();

// Tailwind CSS（生產環境用，取代 CDN）
app.get("/styles.css", () =>
  new Response(tailwindStyles, {
    headers: {
      "Content-Type": "text/css",
      "Cache-Control": "public, max-age=86400",
    },
  })
);

// Health
app.get("/health", (c) =>
  c.json({
    success: true,
    service: "antvillagemgr",
    timestamp: new Date().toISOString(),
  })
);

// Auth verify (v1 + api)
app.all("/v1/auth/verify", (c) => handleVerify(c.req.raw, c.env));
app.all("/api/auth/verify", (c) => handleVerify(c.req.raw, c.env));

// 登入 API（不需驗證）
app.post("/api/auth/login", login);
app.post("/api/auth/logout", logout);
app.get("/api/auth/me", me);

// 登入頁
app.get("/login", (c) => c.html(loginHtml(c.req.url)));

// 外部子網站 AI 調用 API
app.post("/v1/ai/execute", executeAi);

// 開發者自動註冊（3rdPKey 保護）
app.post("/v1/admin/skills/register", registerSkill);

// 需登入的 API
const protectedApi = new Hono<HonoEnv>();
protectedApi.onError((err, c) => {
  const msg = err instanceof Error ? err.message : String(err);
  return c.json(
    { success: false, code: "INTERNAL_ERROR", message: msg },
    500
  );
});
protectedApi.use("*", requireAuth);
protectedApi.get("/api/projects", listProjects);
protectedApi.post("/api/projects", createProject);
protectedApi.get("/api/projects/:id", getProjectById);
protectedApi.get("/api/users", listUsers);
protectedApi.post("/api/users", createUser);
protectedApi.put("/api/users/:userId/permissions", updateUserPermissions);
protectedApi.get("/api/skills", listSkills);
protectedApi.post("/api/skills", createSkill);
protectedApi.post("/api/skills/inject", injectSkills);
protectedApi.post("/api/secrets", createSecret);
protectedApi.post("/api/projects/:id/skills/:skillId/test", testSkill);
protectedApi.get("/api/audit", listAuditLogs);
protectedApi.get("/api/audit/stats", listAuditStats);
protectedApi.get("/api/trust/check-secrets", checkSecrets);
protectedApi.get("/api/trust/skills-doc", skillsDoc);
app.route("/", protectedApi);

// 僅系統管理員：全域 API 金鑰
const adminApi = new Hono<HonoEnv>();
adminApi.use("*", requireAuth, requireSystemAdmin);
adminApi.get("/api/global-secrets", listGlobalSecrets);
adminApi.post("/api/global-secrets", createGlobalSecret);
adminApi.put("/api/global-secrets/:secretId/grants", updateGlobalSecretGrants);
adminApi.delete("/api/global-secrets/:secretId", deleteGlobalSecret);
app.route("/", adminApi);

// 需登入的頁面
app.get("/", requireAuth, (c) => c.html(dashboardHtml(c.req.url)));
app.get("/dashboard", requireAuth, (c) => c.html(dashboardHtml(c.req.url)));
app.get("/projects/:id", requireAuth, (c) =>
  c.html(projectDetailHtml(c.req.url, c.req.param("id") ?? ""))
);
app.get("/users", requireAuth, (c) => c.html(usersHtml(c.req.url)));
app.get("/global-secrets", requireAuth, requireSystemAdmin, (c) =>
  c.html(globalSecretsHtml(c.req.url))
);

// AI 智能客服 Demo
app.get("/demo/customer-service", (c) =>
  c.html(customerServiceDemoHtml(c.req.url))
);

// 404
app.notFound((c) =>
  c.json(
    { success: false, code: "NOT_FOUND", message: "API 路徑不存在" },
    404
  )
);

export default app;
