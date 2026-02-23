import type { Match } from "@/lib/schemas/ai.schema";

export interface MatchScore {
  scholarshipId: string;
  eligible: boolean;
  reasons: string[];
  score: number;
  similarity: number;
}

// export const calculateMatchScore = async (
//   user: User,
//   transcript: Transcript | null,
//   scholarship: Scholarship,
// ): Promise<MatchScore> => {
//   const eligibility = checkEligibility(user, transcript, scholarship);

//   let similarity = 0;
//   // if (scholarship.embedding && user.interests.length > 0) {
//   //   const userInterestText =
//   //     user.interests.join(" ") + " " + (user.goals || "");
//   //   const userEmbedding = await getEmbedding(userInterestText);
//   //   similarity = cosineSimilarity(userEmbedding, scholarship.embedding);
//   // }

//   const eligibilityScore = eligibility.eligible ? 60 : 0;
//   const similarityScore = similarity * 40;
//   const totalScore = eligibilityScore + similarityScore;

//   return {
//     scholarshipId: scholarship.uid,
//     eligible: eligibility.eligible,
//     reasons: eligibility.reasons,
//     score: Math.round(totalScore),
//     similarity,
//   };
// };

export const rankMatches = (matches: Match[]): Match[] => {
  return [...matches].sort((a, b) => b.score - a.score);
};
