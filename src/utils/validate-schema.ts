/**
 * JSON Schema 驗證工具
 * 用於 /v1/ai/execute 的 Params 校驗
 * 支援 type、required、properties
 */

interface JsonSchema {
  type?: string;
  required?: string[];
  properties?: Record<string, { type?: string }>;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

/**
 * 根據 Input Schema 驗證 params
 */
export function validateParams(
  inputSchema: string,
  params: unknown
): ValidationResult {
  if (params === null || typeof params !== "object" || Array.isArray(params)) {
    return { valid: false, errors: ["params 必須為物件"] };
  }

  let schema: JsonSchema;
  try {
    schema = JSON.parse(inputSchema) as JsonSchema;
  } catch {
    return { valid: false, errors: ["input_schema 格式錯誤"] };
  }

  const obj = params as Record<string, unknown>;
  const errors: string[] = [];

  // 檢查 required
  const required = schema.required ?? [];
  for (const key of required) {
    if (!(key in obj) || obj[key] === undefined || obj[key] === null) {
      errors.push(`缺少必填欄位: ${key}`);
    }
  }

  // 檢查 properties 類型
  const properties = schema.properties ?? {};
  for (const [key, prop] of Object.entries(properties)) {
    if (!(key in obj)) continue;
    const val = obj[key];
    const expectedType = prop?.type ?? "string";
    const actualType = typeof val;
    if (expectedType === "string" && actualType !== "string") {
      errors.push(`欄位 ${key} 應為 string`);
    } else if (expectedType === "number" && actualType !== "number") {
      errors.push(`欄位 ${key} 應為 number`);
    } else if (expectedType === "boolean" && actualType !== "boolean") {
      errors.push(`欄位 ${key} 應為 boolean`);
    } else if (expectedType === "object" && (actualType !== "object" || Array.isArray(val))) {
      errors.push(`欄位 ${key} 應為 object`);
    } else if (expectedType === "array" && !Array.isArray(val)) {
      errors.push(`欄位 ${key} 應為 array`);
    }
  }

  return errors.length > 0
    ? { valid: false, errors }
    : { valid: true };
}
