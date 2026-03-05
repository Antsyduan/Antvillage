/**
 * Gemini API 代理服務
 * 使用專案金鑰呼叫 Google Gemini，金鑰不離開伺服器
 */

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = "gemini-2.0-flash";

export interface GeminiGenerateParams {
  apiKey: string;
  systemInstruction?: string;
  userContent: string;
  model?: string;
}

export interface GeminiGenerateResult {
  text: string;
  totalTokenCount?: number;
  raw?: unknown;
}

/**
 * 呼叫 Gemini generateContent API
 */
export async function generateContent(
  params: GeminiGenerateParams
): Promise<GeminiGenerateResult> {
  const { apiKey, systemInstruction, userContent, model = DEFAULT_MODEL } =
    params;

  const body: Record<string, unknown> = {
    contents: [
      {
        role: "user",
        parts: [{ text: userContent }],
      },
    ],
  };

  if (systemInstruction?.trim()) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const res = await fetch(
    `${GEMINI_BASE}/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errBody = await res.text();
    let message = `Gemini API error: ${res.status}`;
    try {
      const parsed = JSON.parse(errBody);
      message =
        parsed?.error?.message || parsed?.error?.details?.[0]?.message || message;
    } catch {
      if (errBody) message += ` - ${errBody.slice(0, 200)}`;
    }
    throw new Error(message);
  }

  const json = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
    usageMetadata?: {
      promptTokenCount?: number;
      candidatesTokenCount?: number;
      totalTokenCount?: number;
    };
  };

  const text =
    json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
  const totalTokenCount =
    json?.usageMetadata?.totalTokenCount ??
    (json?.usageMetadata as { total_token_count?: number })?.total_token_count;

  return { text, totalTokenCount, raw: json };
}
