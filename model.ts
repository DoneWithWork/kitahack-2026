// scholarships/{scholarshipId}
export type Scholarship = {
  title: string;
  description: string;
  sourceUrl: string;

  benefits: string[];

  minimumGrades: {
    "A*": number;
    A: number;
    B: number;
  };

  studyLevel: string[];
  fieldOfStudy: string;

  essayQuestion: string;
  groupTaskDescription: string;
  interviewFocusAreas: string[];
  stages: ["essay", "group", "interview"];

  status: "open" | "closed";
  openingDate: Date;
  closingDate: Date;

  createdAt: Date;
};

// scholarships/{sc.rholarshipId}/applications/{applicationId}

// {
//   userId: string,
//   scholarshipId: string,

//   status:
//     | "in_progress"
//     | "essay_passed"
//     | "group_passed"
//     | "accepted"
//     | "rejected",

//   currentStage: "essay" | "group" | "interview",

//   eligibilitySnapshot: {
//     meetsGradeRequirement: boolean,
//     checkedAt: Timestamp
//   },

//   stages: {
//     essay: {
//       draft: string,
//       submitted: boolean,
//       reviewerScore: number | null,
//       reviewerNotes: string | null,
//       aiUsed: boolean
//     },

//     group: {
//       score: number | null,
//       notes: string | null,
//       aiPreparationUsed: boolean
//     },

//     interview: {
//       score: number | null,
//       notes: string | null,
//       aiPreparationUsed: boolean
//     }
//   },

//   createdAt: Timestamp,
//   updatedAt: Timestamp
// }
