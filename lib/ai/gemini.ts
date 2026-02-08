import { GoogleAuth } from "google-auth-library";
import { logger } from "@/lib/utils/logger";

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT!;
const LOCATION = "us-central1";
const MODEL = "gemini-2.0-flash-001";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

export const generateContent = async (
  prompt: string,
  systemInstruction?: string,
): Promise<string> => {
  try {
    const auth = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const client = await auth.getClient();
    const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent`;

    const body: Record<string, unknown> = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
        topP: 0.95,
        topK: 40,
      },
    };

    if (systemInstruction) {
      body.systemInstruction = {
        role: "system",
        parts: [{ text: systemInstruction }],
      };
    }

    const response = await client.request<GeminiResponse>({
      url,
      method: "POST",
      data: body,
    });

    const data = response.data;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No content generated");
    }

    return text;
  } catch (error) {
    logger.error({ error }, "Gemini API error");
    throw error;
  }
};

export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    const auth = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const client = await auth.getClient();
    const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/text-embedding-004:predict`;

    const response = await client.request<{
      predictions?: Array<{
        embeddings?: {
          values?: number[];
        };
      }>;
    }>({
      url,
      method: "POST",
      data: {
        instances: [{ content: text }],
      },
    });

    const embedding = response.data.predictions?.[0]?.embeddings?.values;

    if (!embedding) {
      throw new Error("No embedding generated");
    }

    return embedding;
  } catch (error) {
    logger.error({ error }, "Embedding generation error");
    throw error;
  }
};
