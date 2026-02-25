import { generateContent } from "@/lib/ai/gemini";
import { logger } from "@/lib/utils/logger";
import type { User } from "@/lib/schemas/user.schema";
import type { Scholarship } from "@/lib/schemas/application.schema";

export const generateEssayDraft = async (
  user: User,
  scholarship: Scholarship,
  prompt: string,
): Promise<string> => {
  try {
    const systemInstruction = `You are an expert scholarship essay advisor. Help students write compelling scholarship essays based on their profile and the scholarship requirements. Be encouraging but honest. Focus on authentic storytelling that highlights the student's unique qualities.`;

    const userPrompt = `
Scholarship: ${scholarship.title}
Provider: ${scholarship.provider ?? "Not specified"}
Description: ${scholarship.description}

Student Profile:
- Name: ${user.name}
- Interests: ${user.interests.join(", ")}
- Goals: ${user.goals || "Not specified"}

Essay Prompt: ${prompt}

Please write a compelling draft essay that:
1. Addresses the prompt directly
2. Highlights the student's relevant experiences and goals
3. Demonstrates alignment with the scholarship's values
4. Is authentic and personal
5. Is approximately 500 words

Draft Essay:
`;

    return await generateContent(userPrompt, systemInstruction);
  } catch (error) {
    logger.error({ error }, "Essay generation error");
    throw new Error("Failed to generate essay draft");
  }
};

export const refineEssay = async (
  currentEssay: string,
  feedback: string,
): Promise<string> => {
  try {
    const systemInstruction = `You are an expert essay editor. Help students improve their scholarship essays based on specific feedback. Maintain the student's voice while enhancing clarity, impact, and flow.`;

    const prompt = `
Current Essay:
${currentEssay}

Feedback to Address:
${feedback}

Please provide a refined version of the essay that incorporates the feedback while maintaining the student's authentic voice.

Refined Essay:
`;

    return await generateContent(prompt, systemInstruction);
  } catch (error) {
    logger.error({ error }, "Essay refinement error");
    throw new Error("Failed to refine essay");
  }
};

export const generateInterviewQuestions = async (
  scholarship: Scholarship,
): Promise<string[]> => {
  try {
    const prompt = `
Generate 5 common interview questions for this scholarship:

Scholarship: ${scholarship.title}
Provider: ${scholarship.provider ?? "Not specified"}
Description: ${scholarship.description}

Provide the questions in a numbered list format.
`;

    const response = await generateContent(prompt);
    return response
      .split("\n")
      .filter((line) => line.trim().match(/^\d+\./))
      .map((line) => line.replace(/^\d+\.\s*/, "").trim());
  } catch (error) {
    logger.error({ error }, "Interview questions generation error");
    return [];
  }
};

export const generateInterviewAnswer = async (
  user: User,
  question: string,
): Promise<string> => {
  try {
    const systemInstruction = `You are an interview coach. Help students prepare strong answers to scholarship interview questions. Provide a framework for answering, not a script to memorize.`;

    const prompt = `
Student Profile:
- Name: ${user.name}
- Interests: ${user.interests.join(", ")}
- Goals: ${user.goals || "Not specified"}

Interview Question: ${question}

Please provide:
1. Key points to address
2. A suggested structure for the answer
3. Tips for delivering confidently

Response:
`;

    return await generateContent(prompt, systemInstruction);
  } catch (error) {
    logger.error({ error }, "Interview answer generation error");
    throw new Error("Failed to generate interview guidance");
  }
};
