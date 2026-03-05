/**
 * 登入 / 登出 API
 */
import type { Context } from "hono";
import type { HonoEnv } from "../types";
import { getPrisma } from "../lib/db";
import { verifyPassword } from "../utils/password";
import {
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getSessionCookie,
  FALLBACK_SECRET,
} from "../middleware/auth";
import { verify } from "hono/jwt";

export async function login(c: Context<HonoEnv>): Promise<Response> {
  let body: { email?: string; password?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json(
      { success: false, code: "INVALID_JSON", message: "無效的 JSON" },
      400
    );
  }

  const email = body.email?.trim();
  const password = body.password;

  if (!email || !password) {
    return c.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "請填寫 Email 與密碼",
      },
      400
    );
  }

  const prisma = getPrisma(c.env.DB);
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return c.json(
      {
        success: false,
        code: "INVALID_CREDENTIALS",
        message: "Email 或密碼錯誤",
      },
      401
    );
  }

  if (user.status !== "active") {
    return c.json(
      {
        success: false,
        code: "USER_INACTIVE",
        message: "帳號已停用",
      },
      401
    );
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return c.json(
      {
        success: false,
        code: "INVALID_CREDENTIALS",
        message: "Email 或密碼錯誤",
      },
      401
    );
  }

  const token = await createSessionToken(
    c,
    user.id,
    user.email,
    user.name ?? undefined
  );
  setSessionCookie(c, token);

  return c.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    },
  });
}

export async function logout(c: Context<HonoEnv>): Promise<Response> {
  clearSessionCookie(c);
  return c.json({ success: true, message: "已登出" });
}

export async function me(c: Context<HonoEnv>): Promise<Response> {
  const token = getSessionCookie(c);
  const secret = c.env.JWT_SECRET?.trim() || FALLBACK_SECRET;

  if (!token) {
    return c.json(
      { success: false, code: "UNAUTHORIZED", message: "未登入" },
      401
    );
  }

  try {
    const payload = (await verify(token, secret, "HS256")) as {
      sub: string;
      email: string;
      name?: string;
    };
    const prisma = getPrisma(c.env.DB);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, status: true },
    });
    if (!user || user.status !== "active") {
      return c.json(
        { success: false, code: "USER_INACTIVE", message: "帳號已停用" },
        401
      );
    }
    return c.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch {
    return c.json(
      { success: false, code: "SESSION_EXPIRED", message: "登入已過期" },
      401
    );
  }
}
