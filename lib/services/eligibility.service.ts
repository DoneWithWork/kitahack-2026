import type { User } from "@/lib/schemas/user.schema";
import type { Transcript } from "@/lib/schemas/transcript.schema";
import type { Scholarship } from "@/lib/schemas/application.schema";

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
  gradeDetails?: {
    userGradeCounts: Record<string, number>;
    rawGradeCounts: Record<string, number>;
    requiredGradeCounts: Record<string, number>;
    extractedCGPA: number | null;
    userGPA: number | null;
    requiredCGPA: number | null;
  };
}

/**
 * Maps a letter grade string to its tier for counting purposes.
 * Returns the tier name (e.g. "A*", "A", "B", "C", etc.) or null.
 */
function getGradeTier(grade: string | number): string | null {
  if (typeof grade === "number") {
    if (grade >= 90) return "A";
    if (grade >= 80) return "B";
    if (grade >= 70) return "C";
    if (grade >= 60) return "D";
    return "F";
  }

  // Extract the letter-grade prefix from potentially verbose strings
  // like "A+ (CEMERLANG TERTINGGI)" or "B (KEPUJIAN TINGGI)"
  const prefixMatch = grade
    .trim()
    .toUpperCase()
    .match(/^(A\+|A\*|A-|A|B\+|B-|B|C\+|C-|C|D\+|D-|D|E|F)(?:\s|$|\(|,)/);

  if (!prefixMatch) return null;

  const letter = prefixMatch[1];

  if (letter === "A+" || letter === "A*") return "A*";
  if (letter === "A" || letter === "A-") return "A";
  if (letter === "B+" || letter === "B" || letter === "B-") return "B";
  if (letter === "C+" || letter === "C" || letter === "C-") return "C";
  if (letter === "D+" || letter === "D" || letter === "D-") return "D";
  if (letter === "E" || letter === "F") return "F";

  return null;
}

/**
 * Counts grade tiers from transcript subjects.
 * Returns both raw counts (per tier) and cumulative counts
 * (where higher tiers also count toward lower tiers).
 */
function countGradeTiers(
  transcript: Transcript,
): { raw: Record<string, number>; cumulative: Record<string, number> } {
  const rawCounts: Record<string, number> = {
    "A*": 0,
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    F: 0,
  };

  for (const subject of transcript.subjects) {
    const tier = getGradeTier(subject.grade);
    if (tier && tier in rawCounts) {
      rawCounts[tier]++;
    }
  }

  // Cumulative: higher tiers count toward lower requirements
  const cumulative: Record<string, number> = {
    "A*": rawCounts["A*"],
    A: rawCounts["A*"] + rawCounts["A"],
    B: rawCounts["A*"] + rawCounts["A"] + rawCounts["B"],
    C: rawCounts["A*"] + rawCounts["A"] + rawCounts["B"] + rawCounts["C"],
    D: rawCounts["A*"] + rawCounts["A"] + rawCounts["B"] + rawCounts["C"] + rawCounts["D"],
    F: rawCounts["A*"] + rawCounts["A"] + rawCounts["B"] + rawCounts["C"] + rawCounts["D"] + rawCounts["F"],
  };

  return { raw: rawCounts, cumulative };
}

/**
 * Extracts a CGPA requirement from the scholarship eligibility text.
 * Looks for patterns like "CGPA 3.5", "CGPA 3.8 or above", "GPA of 3.0".
 */
function extractCGPAFromEligibility(eligibilityText?: string): number | null {
  if (!eligibilityText) return null;
  const match = eligibilityText.match(/(?:CGPA|GPA)\s*(?:of\s+)?(\d+\.?\d*)/i);
  if (match) {
    return parseFloat(match[1]);
  }
  return null;
}

/**
 * Converts user GPA (0-100 scale) to CGPA (4.0 scale).
 * The user profile stores GPA on a 0-100 scale.
 * Malaysian scholarships use CGPA on a 4.0 scale.
 */
function convertGPAToCGPA(gpa100: number): number {
  if (gpa100 >= 90) return 4.0;
  if (gpa100 >= 80) return 3.7;
  if (gpa100 >= 75) return 3.5;
  if (gpa100 >= 70) return 3.3;
  if (gpa100 >= 65) return 3.0;
  if (gpa100 >= 60) return 2.7;
  if (gpa100 >= 55) return 2.3;
  if (gpa100 >= 50) return 2.0;
  return 1.0;
}

/**
 * Checks full eligibility of a user for a scholarship.
 * Supports both the seed data format (minimumGrades: { "A*": 0, A: 3, B: 6 })
 * and the discovery schema format (minGPA for CGPA checks).
 */
export const checkEligibility = (
  user: User,
  transcript: Transcript | null,
  scholarship: Scholarship,
): EligibilityResult => {
  const reasons: string[] = [];

  // 1. Citizenship check
  if (scholarship.citizenship && Array.isArray(scholarship.citizenship) && scholarship.citizenship.length > 0) {
    if (
      !user.citizenship ||
      !scholarship.citizenship.includes(user.citizenship)
    ) {
      reasons.push(
        `Citizenship requirement not met. Required: ${scholarship.citizenship.join(", ")}`,
      );
    }
  }

  // 2. Income cap check
  if (scholarship.incomeCap && user.incomeBracket) {
    const incomeValue = { low: 1, medium: 2, high: 3 }[user.incomeBracket];
    const capValue = scholarship.incomeCap;

    if (typeof capValue === "number" && incomeValue > capValue) {
      reasons.push("Income exceeds scholarship cap");
    }
  }

  // 3. CGPA / GPA check from eligibility text
  // Prefer transcript.gpa (already on 4.0 scale from official document)
  // over user.gpa (self-reported 0-100 scale, requires conversion).
  const requiredCGPA = extractCGPAFromEligibility(scholarship.eligibility);
  const transcriptCGPA =
    transcript?.gpa !== undefined && typeof transcript.gpa === "number"
      ? transcript.gpa
      : null;
  const userGPA100 = user.gpa ?? null;
  let userCGPA: number | null = transcriptCGPA;

  if (userCGPA === null && userGPA100 !== null) {
    userCGPA = convertGPAToCGPA(userGPA100);
  }

  if (requiredCGPA !== null && userCGPA !== null) {
    if (userCGPA < requiredCGPA) {
      reasons.push(
        `CGPA requirement not met. Required: ${requiredCGPA.toFixed(1)}, Your CGPA: ${userCGPA.toFixed(1)}`,
      );
    }
  } else if (requiredCGPA !== null && userCGPA === null) {
    reasons.push(
      `CGPA requirement: ${requiredCGPA.toFixed(1)} (GPA not found in transcript or profile)`,
    );
  }

  // Also check minGPA from the discovery schema (scholarship.schema.ts)
  if (scholarship.minGPA) {
    const neededCGPA = scholarship.minGPA;
    const currentCGPA =
      userCGPA ?? (userGPA100 !== null ? convertGPAToCGPA(userGPA100) : null);
    if (currentCGPA !== null && currentCGPA < neededCGPA) {
      reasons.push(
        `Minimum GPA not met. Required: ${neededCGPA.toFixed(1)}, Your CGPA: ${currentCGPA.toFixed(1)}`,
      );
    } else if (currentCGPA === null) {
      reasons.push(
        `Minimum GPA: ${neededCGPA.toFixed(1)} (GPA not found in transcript or profile)`,
      );
    }
  }

  // 4. Grade count check (seed data format: minimumGrades: { "A*": 0, A: 3, B: 6 })
  let userGradeCounts: Record<string, number> = {};
  let rawGradeCounts: Record<string, number> = {};
  const requiredGradeCounts: Record<string, number> = {};

  if (scholarship.minimumGrades && transcript) {
    const gradeTiers = countGradeTiers(transcript);
    userGradeCounts = gradeTiers.cumulative;
    rawGradeCounts = gradeTiers.raw;
    const minGrades = scholarship.minimumGrades as Record<string, number>;

    for (const [tier, requiredCount] of Object.entries(minGrades)) {
      if (requiredCount <= 0) continue;
      requiredGradeCounts[tier] = requiredCount;
      const userCount = userGradeCounts[tier] ?? 0;

      if (userCount < requiredCount) {
        reasons.push(
          `Need ${requiredCount} ${tier} grade(s), you have ${userCount}`,
        );
      }
    }
  } else if (scholarship.minimumGrades && !transcript) {
    const minGrades = scholarship.minimumGrades as Record<string, number>;
    const hasRequirements = Object.values(minGrades).some((v) => v > 0);
    if (hasRequirements) {
      reasons.push("Transcript not uploaded (grade requirements exist)");
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons,
    gradeDetails: {
      userGradeCounts,
      rawGradeCounts,
      requiredGradeCounts,
      extractedCGPA: requiredCGPA,
      userGPA: userCGPA,
      requiredCGPA,
    },
  };
};
