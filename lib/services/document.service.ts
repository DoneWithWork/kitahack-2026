import { generateContent } from "@/lib/ai/gemini";
import { logger } from "@/lib/utils/logger";
import type { CertificateExtractedData } from "@/lib/schemas/document.schema";
import { certificateExtractedDataSchema } from "@/lib/schemas/document.schema";

export const parseCertificateText = async (
  rawText: string
): Promise<CertificateExtractedData> => {
  try {
    const systemInstruction = `You are a document analysis specialist. Extract structured certificate/academic credential information from OCR text. Return only valid JSON. Handle various certificate formats including diplomas, certifications, and awards.`;

    const prompt = `
Extract certificate information from this OCR text and return it as JSON:

Text:
${rawText}

Return JSON with these fields:
- certificateName: string (name of the certificate/qualification)
- issuer: string (organization that issued the certificate)
- issueDate: string (date issued in ISO 8601 format if available, or as found)
- expiryDate: string (expiry date if applicable, in ISO 8601 format)
- grade: string (grade/score achieved if applicable)
- level: string (level of qualification - e.g., "Bachelor's", "Master's", "High School", "Professional")
- description: string (brief description of what the certificate represents)
- skills: string array (list of skills or competencies demonstrated by this certificate)

If any field is not found in the text, use null or empty string. Be thorough and accurate.

JSON:
`;

    const response = await generateContent(prompt, systemInstruction);
    const cleaned = response.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const validated = certificateExtractedDataSchema.parse(parsed);
    return validated;
  } catch (error) {
    logger.error({ error }, "Certificate parsing error");
    throw new Error("Failed to parse certificate information");
  }
};

export const classifyDocument = async (
  rawText: string
): Promise<"transcript" | "certificate" | "recommendation_letter" | "essay" | "other"> => {
  try {
    const systemInstruction = `You are a document classification specialist. Classify the given text into one of the document types. Return only the classification type.`;

    const prompt = `
Classify this document text into one of these categories:
- transcript (academic records, grades, report cards)
- certificate (diplomas, certifications, awards, credentials)
- recommendation_letter (letters of recommendation, reference letters)
- essay (personal statements, application essays, written submissions)
- other (any other document type)

Text:
${rawText.substring(0, 1000)}

Return only one word: transcript, certificate, recommendation_letter, essay, or other.
`;

    const response = await generateContent(prompt, systemInstruction);
    const classification = response.trim().toLowerCase();

    if (["transcript", "certificate", "recommendation_letter", "essay", "other"].includes(classification)) {
      return classification as "transcript" | "certificate" | "recommendation_letter" | "essay" | "other";
    }

    return "other";
  } catch (error) {
    logger.error({ error }, "Document classification error");
    return "other";
  }
};
