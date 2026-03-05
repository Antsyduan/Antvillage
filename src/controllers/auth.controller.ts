/**
 * Auth Controller
 * 權限驗證 API
 */
import { getPrisma } from "../lib/db";
import { verifyProjectKey } from "../services/auth.service";
import {
  errorResponse,
  successResponse,
} from "../utils/response";

const HEADER_PROJECT_KEY = "x-project-key";
const HEADER_AUTHORIZATION = "authorization";

/**
 * POST /api/auth/verify
 * 驗證 Project 3rd Party Key，可選帶 userId 取得權限
 *
 * Headers:
 *   X-Project-Key: <third_party_key> (必填)
 *   Authorization: Bearer <jwt> (選填，未來擴充)
 *
 * Body (JSON, 選填):
 *   { "userId": "uuid" } - 若提供，回傳該使用者在專案中的 role/scopes
 */
export async function handleVerify(
  request: Request,
  env: { DB: D1Database }
): Promise<Response> {
  if (request.method !== "POST" && request.method !== "GET") {
    return errorResponse("METHOD_NOT_ALLOWED", "僅支援 POST、GET", 405);
  }

  let projectKey: string | undefined;
  let userId: string | undefined;

  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (request.method === "POST" && contentType.includes("application/json")) {
      const body = (await request.json()) as {
        project_key?: string;
        userId?: string;
      };
      projectKey = body?.project_key?.trim();
      userId = body?.userId?.trim();
    }
  } catch {
    // 忽略 body 解析錯誤
  }

  projectKey ??=
    request.headers.get(HEADER_PROJECT_KEY)?.trim() ??
    new URL(request.url).searchParams.get("key")?.trim();

  if (!projectKey) {
    return errorResponse(
      "MISSING_PROJECT_KEY",
      "請提供 X-Project-Key header、query key 或 body.project_key",
      401
    );
  }

  const prisma = getPrisma(env.DB);
  const result = await verifyProjectKey(prisma, projectKey, userId);

  if (!result.valid) {
    return errorResponse(
      "INVALID_PROJECT_KEY",
      "無效或已停用的專案金鑰",
      401
    );
  }

  return successResponse({
    valid: true,
    project: result.project,
    permission: result.permission ?? null,
  });
}
