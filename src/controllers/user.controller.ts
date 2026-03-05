/**
 * 使用者與權限管理 API
 */
import type { Context } from "hono";
import type { HonoEnv } from "../types";
import { getPrisma } from "../lib/db";
import { hashPassword } from "../utils/password";

export async function listUsers(c: Context<HonoEnv>): Promise<Response> {
  try {
    const prisma = getPrisma(c.env.DB);
    const users = await prisma.user.findMany({
      orderBy: { created_at: "desc" },
      include: {
        project_roles: {
          include: {
            project: { select: { id: true, name: true } },
          },
        },
      },
    });
    const data = users.map((u) => ({
      ...u,
      password_hash: undefined,
      project_roles: u.project_roles.map((p) => ({
        project_id: p.project_id,
        project_name: p.project.name,
        role: p.role,
      })),
    }));
    return c.json({ success: true, data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return c.json(
      { success: false, code: "DB_ERROR", message: "載入使用者失敗：" + msg },
      500
    );
  }
}

export async function createUser(c: Context<HonoEnv>): Promise<Response> {
  let body: { email?: string; password?: string; name?: string };
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
  const name = body.name?.trim();

  if (!email) {
    return c.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "請填寫 Email",
      },
      400
    );
  }

  if (!password || password.length < 6) {
    return c.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "密碼至少 6 個字元",
      },
      400
    );
  }

  const prisma = getPrisma(c.env.DB);

  const existing = await prisma.user.findUnique({
    where: { email },
  });
  if (existing) {
    return c.json(
      {
        success: false,
        code: "EMAIL_EXISTS",
        message: "此 Email 已註冊",
      },
      409
    );
  }

  const password_hash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password_hash,
      name: name || null,
      status: "active",
    },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      created_at: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      user_id: user.id,
      action: "CREATE_USER",
      target: user.id,
      payload: JSON.stringify({ email: user.email }),
    },
  });

  return c.json({ success: true, data: user }, 201);
}

export async function updateUserPermissions(
  c: Context<HonoEnv>
): Promise<Response> {
  const userId = c.req.param("userId");
  if (!userId) {
    return c.json(
      { success: false, code: "MISSING_USER_ID", message: "缺少使用者 ID" },
      400
    );
  }
  let body: { permissions?: Array<{ project_id: string; role: string }> };
  try {
    body = await c.req.json();
  } catch {
    return c.json(
      { success: false, code: "INVALID_JSON", message: "無效的 JSON" },
      400
    );
  }

  const permissions = body.permissions;
  if (!Array.isArray(permissions)) {
    return c.json(
      {
        success: false,
        code: "VALIDATION_ERROR",
        message: "請提供 permissions 陣列",
      },
      400
    );
  }

  const validRoles = ["admin", "editor", "viewer"];
  for (const p of permissions) {
    if (!p.project_id || !validRoles.includes(p.role?.toLowerCase() ?? "")) {
      return c.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          message: "每筆 permission 需包含 project_id 與 role (admin/editor/viewer)",
        },
        400
      );
    }
  }

  const prisma = getPrisma(c.env.DB);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return c.json(
      { success: false, code: "USER_NOT_FOUND", message: "使用者不存在" },
      404
    );
  }

  await prisma.permission.deleteMany({
    where: { user_id: userId },
  });

  // 依 project_id 去重，避免 unique(project_id, user_id) 衝突
  const uniqueByProject = permissions.reduce(
    (acc, p) => {
      acc.set(p.project_id, p);
      return acc;
    },
    new Map<string, { project_id: string; role: string }>()
  );
  const deduped = Array.from(uniqueByProject.values());

  const scopesByRole: Record<string, string> = {
    admin: '{"can_create":true,"can_delete":true,"can_edit":true,"can_read":true}',
    editor:
      '{"can_create":true,"can_delete":false,"can_edit":true,"can_read":true}',
    viewer:
      '{"can_create":false,"can_delete":false,"can_edit":false,"can_read":true}',
  };

  try {
    await prisma.permission.createMany({
      data: deduped.map((p) => ({
        project_id: p.project_id,
        user_id: userId,
        role: p.role.toLowerCase(),
        scopes: scopesByRole[p.role.toLowerCase()] ?? scopesByRole.viewer,
      })),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return c.json(
      {
        success: false,
        code: "PERMISSION_ERROR",
        message: "儲存權限失敗：" + msg,
      },
      500
    );
  }

  const updated = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      created_at: true,
      project_roles: {
        select: {
          project_id: true,
          project: { select: { name: true } },
          role: true,
        },
      },
    },
  });

  const operator = c.get("user");
  const permissionsDetail = updated?.project_roles?.map((pr) => ({
    project_name: pr.project.name,
    role: pr.role,
  })) ?? deduped.map((p) => ({ project_id: p.project_id, role: p.role }));

  await prisma.auditLog.create({
    data: {
      user_id: operator?.id ?? null,
      action: "UPDATE_PERMISSIONS",
      target: userId,
      payload: JSON.stringify({
        target_user_email: user.email,
        target_user_name: user.name,
        operator_email: operator?.email,
        permissions: permissionsDetail,
        count: permissionsDetail.length,
      }),
    },
  });

  return c.json({
    success: true,
    data: updated
      ? {
          ...updated,
          project_roles: updated.project_roles.map((p) => ({
            project_id: p.project_id,
            project_name: p.project.name,
            role: p.role,
          })),
        }
      : null,
  });
}

export async function deleteUser(c: Context<HonoEnv>): Promise<Response> {
  const userId = c.req.param("userId");
  if (!userId) {
    return c.json(
      { success: false, code: "MISSING_USER_ID", message: "缺少使用者 ID" },
      400
    );
  }

  const operator = c.get("user");
  if (operator?.id === userId) {
    return c.json(
      {
        success: false,
        code: "CANNOT_DELETE_SELF",
        message: "無法刪除自己的帳號",
      },
      400
    );
  }

  const prisma = getPrisma(c.env.DB);
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return c.json(
      { success: false, code: "USER_NOT_FOUND", message: "使用者不存在" },
      404
    );
  }

  if (user.email === "antsyduan@gmail.com") {
    return c.json(
      {
        success: false,
        code: "CANNOT_DELETE_SUPER_ADMIN",
        message: "此使用者為系統最高權限帳號，無法刪除",
      },
      400
    );
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return c.json(
      {
        success: false,
        code: "DELETE_ERROR",
        message: "刪除失敗：" + msg,
      },
      500
    );
  }

  await prisma.auditLog.create({
    data: {
      user_id: operator?.id ?? null,
      action: "DELETE_USER",
      target: userId,
      payload: JSON.stringify({
        deleted_email: user.email,
        deleted_name: user.name,
        operator_email: operator?.email,
      }),
    },
  });

  return c.json({ success: true });
}
