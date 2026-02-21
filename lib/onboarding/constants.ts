const steps = [
  { id: 0, title: "Welcome", description: "Let's get you started" },
  { id: 1, title: "Profile", description: "Tell us about yourself" },
  { id: 2, title: "Transcript", description: "Upload your academic results" },
  { id: 3, title: "Documents", description: "Add certificates & credentials" },
  { id: 4, title: "Complete", description: "You're all set!" },
];

const targetFields = [
  { value: "computer_science", label: "Computer Science & IT" },
  { value: "engineering", label: "Engineering" },
  { value: "medicine", label: "Medicine & Healthcare" },
  { value: "business", label: "Business & Management" },
  { value: "law", label: "Law" },
  { value: "accounting", label: "Accounting & Finance" },
  { value: "sciences", label: "Natural Sciences" },
  { value: "arts", label: "Arts & Humanities" },
  { value: "social_sciences", label: "Social Sciences" },
  { value: "education", label: "Education" },
  { value: "architecture", label: "Architecture & Design" },
  { value: "communication", label: "Communication & Media" },
  { value: "agriculture", label: "Agriculture & Food Science" },
  { value: "environment", label: "Environmental Studies" },
  { value: "psychology", label: "Psychology" },
  { value: "mathematics", label: "Mathematics & Statistics" },
  { value: "hospitality", label: "Hospitality & Tourism" },
  { value: "other", label: "Other" },
];

const incomeBrackets = [
  { value: "low", label: "B40 (≤ RM4,850/month)" },
  { value: "medium", label: "M40 (RM4,851 - RM10,970/month)" },
  { value: "high", label: "T20 (> RM10,970/month)" },
];

const commonInterests = [
  "Leadership",
  "Community Service",
  "Sports",
  "Music & Arts",
  "Science & Research",
  "Technology",
  "Entrepreneurship",
  "Debate & Public Speaking",
  "Writing & Journalism",
  "Environmental Advocacy",
  "Student Council",
  "Clubs & Societies",
];

export { steps, targetFields, incomeBrackets, commonInterests };
