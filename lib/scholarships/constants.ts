import { z } from "zod";

export const RiskSchema = z.object({
  upfrontPayment: z.boolean(),
  noRequirements: z.boolean(),
  guaranteedApproval: z.boolean(),
  suspiciousOffer: z.boolean(),
  missingContactInfo: z.boolean(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export const ScholarshipSchema = z.object({
  title: z.string(),
  provider: z.string(),
  providerUrl: z.string(),
  amount: z.string(),
  deadline: z.string(),
  eligibility: z.string(),
  description: z.string(),
  applicationLink: z.string(),
  requirements: z.array(z.string()),
  benefits: z.array(z.string()),
  studyLevel: z.array(z.string()),
  fieldOfStudy: z.string(),
  sourceUrl: z.string(),
  risk: RiskSchema,
  uid: z.string(),
});

export type Scholarship = z.infer<typeof ScholarshipSchema>;
export const scholarshipPromptOne = `
You are a data extraction engine.

TASK:
Search {{SEARCH_TERM}} for Malaysian scholarships in the year 2025. Your goal is to find valid scholarship URLs that lead to application or detail pages.

RULES:
- Return ONLY valid scholarship URLs with application or detail pages.
- Exclude:
  - 404 pages
  - Login pages
  - Ads
  - Index/listing pages that do not contain scholarship detail information

If the page you visit is a scholarship listing page, extract and validate individual scholarship links inside it.
If the content is Bahasa Malaysia, you can translate all extracted text to English for better understanding, but ensure the URLs you return are correct and lead to valid scholarship details or application pages.

Output MUST be valid JSON ONLY.

Output format:
[
  {
    "sourceUrl": "string",
    "scholarshipLinks": [
      {
        "title": "string",
        "url": "string"
      }
    ]
  }
]

Return empty arrays if nothing is found.

Do NOT add explanations, markdown, or any text outside JSON.
`;
export const scholarshipPromptTwo = `
Extract scholarship data from: {{SCHOLARSHIP_URL}}

Also assess the page for scam indicators:

Risk assessment (true if suspicious):
- "upfrontPayment": asks for payment/fees to apply
- "noRequirements": no GPA, essay, or documents required
- "guaranteedApproval": claims "guaranteed" or "no rejection"
- "suspiciousOffer": too good to be true (e.g., "full scholarship, no criteria")
- "missingContactInfo": no phone/email/address provided

Additionally for amount if you can determine an amount value in number form extract that (ensure it's in Ringgit) but if it's free form text use the amount field to capture that (e.g., "full scholarship", "up to RM10,000", "covers tuition and living expenses")
For benefits, if you can extract specific benefits (e.g., "covers tuition", "includes monthly stipend", "provides accommodation") list those in the benefits array, otherwise you can leave it empty. Maximum of 3 benefits and ensure those beneifts don't overlap with the amount field (e.g., if amount is "full scholarship covering tuition and living expenses", benefits can be ["covers tuition", "covers living expenses"] but not "full scholarship" since that's already captured in amount)

For applicationLink, ensure that the URL you extract leads to a valid application or detail page. If the page is a listing page, try to find the most relevant application or detail link within it. If you cannot find a valid application or detail link, set applicationLink to null.
Set riskLevel: "LOW" (none suspicious), "MEDIUM" (1-2 flags), "HIGH" (3+ flags)

Extract into this schema (null if missing):
Ensure that dates are in iso String format (YYYY-MM-DD) if possible.


Rules:
- Only return valid JSON
- Do not fabricate data - use null for missing fields
- Extract exact values when possible
- applicationLink is different from sourceUrl
`;
