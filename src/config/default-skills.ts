/**
 * 新專案建立時自動加入的預設 AI Skills
 * 可依需求調整或擴充
 */
export interface DefaultSkillDef {
  name: string;
  version: string;
  system_prompt: string;
  input_schema: string;
  output_schema: string;
  is_verified: boolean;
}

export const DEFAULT_STARTER_SKILLS: DefaultSkillDef[] = [
  {
    name: "general_assistant",
    version: "1.0.0",
    system_prompt:
      "You are a helpful AI assistant. Respond in Traditional Chinese. Be concise, professional, and accurate. If you cannot answer, politely say so.",
    input_schema: JSON.stringify({
      type: "object",
      properties: {
        message: { type: "string", description: "使用者輸入的訊息" },
        context: { type: "string", description: "額外上下文（選填）" },
      },
      required: ["message"],
    }),
    output_schema: JSON.stringify({
      type: "object",
      properties: { result: { type: "string", description: "AI 回覆內容" } },
    }),
    is_verified: true,
  },
  {
    name: "summarizer",
    version: "1.0.0",
    system_prompt:
      "You are a summarization assistant. Given text, produce a clear and concise summary in Traditional Chinese. Preserve key points and main ideas.",
    input_schema: JSON.stringify({
      type: "object",
      properties: {
        text: { type: "string", description: "要摘要的原文" },
        max_length: { type: "number", description: "摘要最大字數（選填）" },
      },
      required: ["text"],
    }),
    output_schema: JSON.stringify({
      type: "object",
      properties: { result: { type: "string", description: "摘要結果" } },
    }),
    is_verified: true,
  },
];
