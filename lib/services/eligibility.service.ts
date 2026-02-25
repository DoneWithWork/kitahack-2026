import type { User } from "@/lib/schemas/user.schema";
import type { Transcript } from "@/lib/schemas/transcript.schema";
import type { Scholarship } from "@/lib/schemas/scholarship.schema";

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

function convertGradeToNumber(grade: string): number | null {
  const gradeMap: Record<string, number> = {
    "A+": 100, "A": 95, "A-": 90,
    "B+": 89, "B": 85, "B-": 80,
    "C+": 79, "C": 75, "C-": 70,
    "D+": 69, "D": 65, "D-": 60,
    "E": 50, "F": 0,
  };
  const match = grade.match(/^([A-F][+-]?|A\+|E|F)/i);
  if (match) {
    return gradeMap[match[0].toUpperCase()] ?? null;
  }
  return null;
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
      } else {
        const userGrade = userSubject.grade;
        const userGradeNum = typeof userGrade === "string" ? convertGradeToNumber(userGrade) : userGrade;
        if (userGradeNum !== null && userGradeNum < (minGrade as number)) {
          reasons.push(
            `Grade requirement not met for ${subject}. Required: ${minGrade}, Got: ${userGrade}`,
          );
        }
      }
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
};
