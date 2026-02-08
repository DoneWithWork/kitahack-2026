import { generateContent } from "@/lib/ai/gemini";
import { logger } from "@/lib/utils/logger";
import type { ExtractedScholarship } from "@/lib/schemas/scholarship.schema";
import { extractedScholarshipSchema } from "@/lib/schemas/scholarship.schema";
import type { ExtractedTranscript } from "@/lib/schemas/transcript.schema";
import { extractedTranscriptSchema } from "@/lib/schemas/transcript.schema";

export const parseScholarshipText = async (
  rawText: string
): Promise<ExtractedScholarship> => {
  try {
    const systemInstruction = `You are a data extraction specialist. Extract structured scholarship information from unstructured text. Return only valid JSON matching the schema. Be precise with dates (ISO 8601 format) and numbers.`;

    const prompt = `
Extract scholarship information from this text and return it as JSON:

Text:
${rawText}

Return JSON with these fields:
- title: string (required)
- description: string (required)
- provider: string (required)
- citizenship: string array (optional)
- incomeCap: number (optional, 1=low, 2=medium, 3=high)
- minGrades: object mapping subject names to minimum grade numbers (optional)
- fieldsAllowed: string array (optional)
- deadline: ISO 8601 datetime string (required)
- benefits: string (required)
- applicationUrl: string (optional)

JSON:
`;

    const response = await generateContent(prompt, systemInstruction);
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const validated = extractedScholarshipSchema.parse(parsed);
    return validated;
  } catch (error) {
    logger.error({ error }, "Scholarship parsing error");
    throw new Error("Failed to parse scholarship information");
  }
};

export const parseTranscriptText = async (
  rawText: string
): Promise<ExtractedTranscript> => {
  try {
    const systemInstruction = `You are a data extraction specialist. Extract academic transcript information from OCR text. Return only valid JSON. Handle various formats and grade systems.`;

    const prompt = `
Extract transcript information from this OCR text and return it as JSON:

Text:
${rawText}

Return JSON with these fields:
- subjects: array of { name: string, grade: number } (required)
- gpa: number (required)
- year: number (required, graduation year)

Extract all subjects and their grades. Convert letter grades to numbers (A=90, B=80, C=70, D=60, F=0) if needed.

JSON:
`;

    const response = await generateContent(prompt, systemInstruction);
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const validated = extractedTranscriptSchema.parse(parsed);
    return validated;
  } catch (error) {
    logger.error({ error }, "Transcript parsing error");
    throw new Error("Failed to parse transcript information");
  }
};
