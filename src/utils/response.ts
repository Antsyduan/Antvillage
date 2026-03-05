/**
 * 標準化 API 回應格式
 * 符合 .cursorrules: { success: false, code: string, message: string }
 */

export interface ApiError {
  success: false;
  code: string;
  message: string;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

export function jsonResponse<T>(data: ApiResponse<T>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function errorResponse(
  code: string,
  message: string,
  status = 400
): Response {
  return jsonResponse<never>(
    { success: false, code, message },
    status
  );
}

export function successResponse<T>(data: T, status = 200): Response {
  return jsonResponse({ success: true, data }, status);
}
