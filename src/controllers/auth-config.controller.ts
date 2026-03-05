/**
 * Auth Config API
 * 專案以 3rdPKey 取得 Google OAuth、Line 登入設定
 *
 * POST /v1/auth/config 或 GET /v1/auth/config
 * Headers: X-Project-Key: <3rdPKey>
 * Body (POST): { "project_key": "<3rdPKey>" }
 */
import { getPrisma } from "../lib/db";
import { getAuthConfigForProject } from "../services/auth-config.service";
import {
  errorResponse,
  successResponse,
} from "../utils/response";

const HEADER_PROJECT_KEY = "x-project-key";

async function getProjectKey(request: Request): Promise<string | undefined> {
  let key: string | undefined;
  try {
    const ct = request.headers.get("content-type") ?? "";
    if (request.method === "POST" && ct.includes("application/json")) {
      const body = (await request.clone().json()) as { project_key?: string };
      key = body?.project_key?.trim();
    }
  } catch {
    // ignore
  }
  return (
    key ??
    request.headers.get(HEADER_PROJECT_KEY)?.trim() ??
    new URL(request.url).searchParams.get("key")?.trim()
  );
}

export async function handleAuthConfig(
  request: Request,
  env: { DB: D1Database; MASTER_KEY?: string }
): Promise<Response> {
  if (request.method !== "POST" && request.method !== "GET") {
    return errorResponse("METHOD_NOT_ALLOWED", "僅支援 POST、GET", 405);
  }

  const projectKey = await getProjectKey(request);
  if (!projectKey) {
    return errorResponse(
      "MISSING_PROJECT_KEY",
      "請提供 X-Project-Key header 或 query key",
      401
    );
  }

  const masterKey = env.MASTER_KEY?.trim();
  if (!masterKey) {
    return errorResponse(
      "MASTER_KEY_NOT_CONFIGURED",
      "伺服器未設定 MASTER_KEY",
      503
    );
  }

  const prisma = getPrisma(env.DB);
  const result = await getAuthConfigForProject(prisma, projectKey, masterKey);

  if (!result.valid) {
    return errorResponse(
      "INVALID_PROJECT_KEY",
      "無效或已停用的專案金鑰",
      401
    );
  }

  return successResponse({
    project: result.project,
    auth: result.auth ?? {},
  });
}
