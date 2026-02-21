import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});
const groundingTool = {
  googleSearch: {},
};

type CallGeminiProps<T> = {
  prompt: string;
  model?: "gemini-2.5-flash-lite" | "gemini-3-flash-preview";
  schema: z.ZodType<T>;
};

export async function CallGemini<T>({
  prompt,
  model = "gemini-2.5-flash-lite",
  schema,
}: CallGeminiProps<T>): Promise<T> {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(schema),
    },
  });

  if (!response.text) {
    throw new Error("Empty model response");
  }
  const totalTokens = response.usageMetadata?.totalTokenCount;
  console.log(`Total tokens: ${totalTokens}`);
  const data = schema.parse(JSON.parse(response.text));
  return data;
}
export async function CallGeminiWithTool<T>({
  prompt,
  model = "gemini-3-flash-preview",
  schema,
}: CallGeminiProps<T>): Promise<T> {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseJsonSchema: z.toJSONSchema(schema),
      responseMimeType: "application/json",
      tools: [groundingTool],
    },
  });

  if (!response.text) {
    throw new Error("Empty model response");
  }

  const text = response.text;
  console.log("Raw model response:", text);
  if (!text) {
    throw new Error("No text response from Gemini");
  }
  return schema.parse(JSON.parse(text));
}
type ExtractTextProps<T> = {
  model?: "gemini-2.5-flash-lite" | "gemini-3-flash-preview";
  schema: z.ZodType<T>;
  buffer: Buffer<ArrayBuffer>;
  file: File;
  prompt: string;
};
export async function extractText<T>({
  model = "gemini-2.5-flash-lite",
  schema,
  buffer,
  file,
  prompt: extractGradesPrompt,
}: ExtractTextProps<T>): Promise<T> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  const blob = new Blob([buffer], { type: file.type });

  const uploaded = await ai.files.upload({
    file: blob,
    config: {
      mimeType: file.type,
      displayName: file.name,
    },
  });

  if (!uploaded.uri || !uploaded.mimeType) {
    throw new Error("Gemini file upload failed");
  }

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",

    contents: [
      {
        role: "user",
        parts: [
          {
            fileData: { fileUri: uploaded.uri, mimeType: uploaded.mimeType },
          },
          { text: extractGradesPrompt },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(schema),
    },
  });
  const rawText = result.text;
  if (!rawText) {
    throw new Error("No response text from Gemini");
  }

  const parsed = schema.parse(JSON.parse(rawText));
  return parsed;
}
