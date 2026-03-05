/**
 * 登入驗證 Middleware
 * 檢查 JWT Cookie，未登入則回傳 401 或導向登入頁
 */
import type { Context, Next } from "hono";
import type { HonoEnv } from "../types";
import { getCookie } from "hono/cookie";
import { getPrisma } from "../lib/db";
import { sign } from "hono/jwt";

const COOKIE_NAME = "av_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 天
export const FALLBACK_SECRET =
  "antvillagemgr-dev-secret-please-set-JWT_SECRET-in-production";

function getJwtSecret(c: Context<HonoEnv>): string {
  return c.env.JWT_SECRET?.trim() || FALLBACK_SECRET;
}

export interface SessionPayload {
  sub: string;
  email: string;
  name?: string;
  iat: number;
  exp: number;
}

export function getSessionCookie(c: Context<HonoEnv>): string | undefined {
  return getCookie(c, COOKIE_NAME);
}

export async function createSessionToken(
  c: Context<HonoEnv>,
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  const secret = getJwtSecret(c);
  const payload = {
    sub: userId,
    email,
    name: name ?? undefined,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE,
  };
  return await sign(payload as Record<string, unknown>, secret, "HS256");
}

export function setSessionCookie(c: Context<HonoEnv>, token: string): void {
  c.header(
    "Set-Cookie",
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`
  );
}

export function clearSessionCookie(c: Context<HonoEnv>): void {
  c.header(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
}

/**
 * 驗證 session，若有效則將 user 存入 c.var
 * 用於需要登入的 API 與頁面
 */
export async function requireAuth(c: Context<HonoEnv>, next: Next) {
  const token = getSessionCookie(c);
  const secret = getJwtSecret(c);

  if (!token) {
    const accept = c.req.header("Accept") ?? "";
    if (accept.includes("application/json") || c.req.path.startsWith("/api/")) {
      return c.json(
        { success: false, code: "UNAUTHORIZED", message: "請先登入" },
        401
      );
    }
    return c.redirect("/login");
  }

  try {
    const { verify } = await import("hono/jwt");
    const payload = (await verify(token, secret, "HS256")) as unknown as SessionPayload;
    const prisma = getPrisma(c.env.DB);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, status: true, is_system_admin: true },
    });
    if (!user || user.status !== "active") {
      clearSessionCookie(c);
      return c.json(
        { success: false, code: "USER_INACTIVE", message: "帳號已停用" },
        401
      );
    }
    c.set("user", user);
    await next();
  } catch {
    clearSessionCookie(c);
    const accept = c.req.header("Accept") ?? "";
    if (accept.includes("application/json") || c.req.path.startsWith("/api/")) {
      return c.json(
        { success: false, code: "SESSION_EXPIRED", message: "登入已過期，請重新登入" },
        401
      );
    }
    return c.redirect("/login");
  }
}

/**
 * 僅系統管理員可執行（需在 requireAuth 之後使用）
 */
export async function requireSystemAdmin(c: Context<HonoEnv>, next: Next) {
  const user = c.get("user");
  if (!user?.is_system_admin) {
    const accept = c.req.header("Accept") ?? "";
    if (!accept.includes("application/json") && !c.req.path.startsWith("/api/")) {
      return c.redirect("/?error=forbidden");
    }
    return c.json(
      {
        success: false,
        code: "FORBIDDEN",
        message: "僅系統管理員可執行此操作",
      },
      403
    );
  }
  await next();
}
