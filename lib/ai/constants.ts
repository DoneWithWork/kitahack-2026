export const extractGradesPrompt = `
You are an information extraction system.

Input: An academic transcript (image or PDF).

Task:
Extract all subject grades and return structured data that strictly follows the provided JSON schema.

Rules:
- Return ONLY valid JSON.
- Do not include explanations.
- Do not include markdown.
- Do not infer missing grades.
- If a required field is missing in the document, return null.
- Preserve subject names exactly as written.
- For grades: normalize to a clean short form. Extract only the letter grade portion (e.g., "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D", "E", "F"). Remove any descriptive text, parenthetical explanations, or non-grade text. For example:
  - "A+ (CEMERLANG TERTINGGI)" → "A+"
  - "A (CEMERLANG TINGGI)" → "A"
  - "A- (CEMERLANG)" → "A-"
  - "B (KEPUJIAN TINGGI)" → "B"
  - "Distinction" → "A"
  - If the grade is purely numeric (e.g., 85, 92), keep it as a number.
- For GPA/CGPA: extract the numeric value if present (e.g., 3.5, 3.85). If only letter grades exist and no numeric GPA is stated on the document, omit the gpa field.
- Ignore logos, signatures, stamps, and irrelevant text.
- If multiple semesters exist, extract all of them.

If the document is unclear or unreadable, return empty arrays but still follow the schema.

Extract now.`;

