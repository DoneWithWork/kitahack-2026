import type { User } from "@/lib/schemas/user.schema";
import type { Transcript } from "@/lib/schemas/transcript.schema";
import type { Scholarship } from "@/lib/schemas/scholarship.schema";

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

export const checkEligibility = (
  user: User,
  transcript: Transcript | null,
  scholarship: Scholarship,
): EligibilityResult => {
  const reasons: string[] = [];

  if (scholarship.citizenship && scholarship.citizenship.length > 0) {
    if (
      !user.citizenship ||
      !scholarship.citizenship.includes(user.citizenship)
    ) {
      reasons.push(
        `Citizenship requirement not met. Required: ${scholarship.citizenship.join(", ")}`,
      );
    }
  }

  if (scholarship.incomeCap && user.incomeBracket) {
    const incomeValue = { low: 1, medium: 2, high: 3 }[user.incomeBracket];
    const capValue = scholarship.incomeCap as number;

    if (typeof capValue === "number" && incomeValue > capValue) {
      reasons.push("Income exceeds scholarship cap");
    }
  }

  if (scholarship.minGrades && transcript) {
    for (const [subject, minGrade] of Object.entries(scholarship.minGrades)) {
      const userSubject = transcript.subjects.find(
        (s) => s.name.toLowerCase() === subject.toLowerCase(),
      );

      if (!userSubject) {
        reasons.push(`Required subject "${subject}" not found`);
      } else if (userSubject.grade < minGrade) {
        reasons.push(
          `Grade requirement not met for ${subject}. Required: ${minGrade}, Got: ${userSubject.grade}`,
        );
      }
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
};
