/**
 * AntVillageMgr - Hono App
 */
import { Hono } from "hono";
import type { HonoEnv } from "./types";
import { tailwindStyles } from "./generated/tailwind-css";
import { requireAuth, requireSystemAdmin } from "./middleware/auth";
import { handleVerify } from "./controllers/auth.controller";
import { handleAuthConfig } from "./controllers/auth-config.controller";
import { login, logout, me } from "./controllers/login.controller";
import {
  listProjects,
  listSkills,
  listAuditLogs,
  listAuditStats,
} from "./controllers/dashboard.controller";
import {
  getProjectById,
  updateProject,
  createSkill,
  deleteProject,
} from "./controllers/project.controller";
import { createProject } from "./controllers/project-create.controller";
import {
  listUsers,
  createUser,
  updateUserPermissions,
  deleteUser,
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
import { logoFullSvg, faviconSvg } from "./assets/logo";
import {
  icon180Base64,
  icon192Base64,
  icon512Base64,
} from "./generated/icons";

const pngHeaders = {
  "Content-Type": "image/png",
  "Cache-Control": "public, max-age=86400",
};

const app = new Hono<HonoEnv>();

// Logo & Favicon（公開）
app.get("/logo.svg", (c) =>
  new Response(logoFullSvg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  })
);
app.get("/favicon.svg", (c) =>
  new Response(faviconSvg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  })
);

// PWA / Apple Touch Icon（PNG，加入主畫面用）
app.get("/icon-180.png", (c) => {
  const bin = Uint8Array.from(atob(icon180Base64), (ch) => ch.charCodeAt(0));
  return new Response(bin, { headers: pngHeaders });
});
app.get("/icon-192.png", (c) => {
  const bin = Uint8Array.from(atob(icon192Base64), (ch) => ch.charCodeAt(0));
  return new Response(bin, { headers: pngHeaders });
});
app.get("/icon-512.png", (c) => {
  const bin = Uint8Array.from(atob(icon512Base64), (ch) => ch.charCodeAt(0));
  return new Response(bin, { headers: pngHeaders });
});

// Web App Manifest
app.get("/manifest.json", (c) =>
  new Response(
    JSON.stringify({
      name: "AntVillageMgr",
      short_name: "AI 管理指揮中心",
      description: "AI 管理指揮中心",
      start_url: "/",
      display: "standalone",
      background_color: "#0f172a",
      theme_color: "#0ea5e9",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    }),
    {
      headers: {
        "Content-Type": "application/manifest+json",
        "Cache-Control": "public, max-age=86400",
      },
    }
  )
);

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

// Auth config：專案以 3rdPKey 取得 Google OAuth、Line 登入設定
app.all("/v1/auth/config", (c) => handleAuthConfig(c.req.raw, c.env));
app.all("/api/auth/config", (c) => handleAuthConfig(c.req.raw, c.env));

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
protectedApi.put("/api/projects/:id", updateProject);
protectedApi.delete("/api/projects/:id", deleteProject);
protectedApi.get("/api/users", listUsers);
protectedApi.post("/api/users", createUser);
protectedApi.put("/api/users/:userId/permissions", updateUserPermissions);
protectedApi.delete("/api/users/:userId", deleteUser);
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
