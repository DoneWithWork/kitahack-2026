# Sample Firestore Data

Use this data to populate Firestore for a hackathon demo. Each section maps to a Firestore collection. Copy the JSON objects into the Firestore console or use a seed script.

---

## 1. `users` Collection

**Path:** `users/{uid}`

### User 1 — High-achieving student (eligible for most scholarships)

**Document ID:** `demo-user-001`

```json
{
  "uid": "demo-user-001",
  "email": "aisha.rahman@example.com",
  "name": "Aisha binti Rahman",
  "role": "user",
  "hackathonMode": false,
  "incomeBracket": "low",
  "interests": ["Leadership", "Community Service", "Technology", "Research"],
  "goals": "I want to become a software engineer and build products that improve education access in rural Malaysia.",
  "citizenship": "Malaysian",
  "educationLevel": "pre_university",
  "fieldOfStudy": "Computer Science",
  "currentSchool": "Kolej Matrikulasi Selangor",
  "graduationYear": 2027,
  "targetField": "computer_science",
  "gpa": 92,
  "onboardingCompleted": true,
  "onboardingStep": 5,
  "documentsUploaded": true,
  "transcriptUploaded": true,
  "createdAt": "2026-01-10T08:00:00.000Z",
  "updatedAt": "2026-02-27T09:00:00.000Z"
}
```

### User 2 — Average student (eligible for some scholarships)

**Document ID:** `demo-user-002`

```json
{
  "uid": "demo-user-002",
  "email": "hafiz.abdullah@example.com",
  "name": "Hafiz bin Abdullah",
  "role": "user",
  "hackathonMode": false,
  "incomeBracket": "medium",
  "interests": ["Sports", "Entrepreneurship", "Finance"],
  "goals": "I plan to pursue a career in banking and eventually start my own fintech company.",
  "citizenship": "Malaysian",
  "educationLevel": "pre_university",
  "fieldOfStudy": "Business Administration",
  "currentSchool": "MRSM Langkawi",
  "graduationYear": 2027,
  "targetField": "business",
  "gpa": 72,
  "onboardingCompleted": true,
  "onboardingStep": 5,
  "documentsUploaded": true,
  "transcriptUploaded": true,
  "createdAt": "2026-01-15T10:00:00.000Z",
  "updatedAt": "2026-02-27T09:00:00.000Z"
}
```

### User 3 — Admin user for reviewing applications

**Document ID:** `demo-admin-001`

```json
{
  "uid": "demo-admin-001",
  "email": "admin@scholarshipguide.my",
  "name": "Admin Demo",
  "role": "admin_simulated",
  "hackathonMode": true,
  "incomeBracket": "high",
  "interests": [],
  "goals": "",
  "citizenship": "Malaysian",
  "educationLevel": "postgraduate",
  "fieldOfStudy": "Education",
  "currentSchool": "Admin",
  "graduationYear": 2024,
  "targetField": "education",
  "gpa": 95,
  "onboardingCompleted": true,
  "onboardingStep": 5,
  "documentsUploaded": false,
  "transcriptUploaded": false,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

## 2. `transcripts` Collection

**Path:** `transcripts/{uid}`

### Transcript for User 1 (Aisha — high achiever)

**Document ID:** `demo-user-001`

```json
{
  "uid": "demo-user-001",
  "subjects": [
    { "name": "Mathematics", "grade": "A+", "code": "950" },
    { "name": "Physics", "grade": "A", "code": "960" },
    { "name": "Chemistry", "grade": "A", "code": "962" },
    { "name": "Biology", "grade": "A-", "code": "964" },
    { "name": "Further Mathematics", "grade": "A", "code": "954" },
    { "name": "General Studies", "grade": "A", "code": "900" },
    { "name": "English Language", "grade": "A+", "code": "910" },
    { "name": "Bahasa Melayu", "grade": "A", "code": "920" },
    { "name": "Computer Science", "grade": "A+", "code": "970" },
    { "name": "Economics", "grade": "B+", "code": "944" }
  ],
  "gpa": 3.89,
  "year": 2025,
  "uploadedAt": "2026-01-12T14:30:00.000Z",
  "fileUrl": "https://storage.googleapis.com/demo-bucket/transcripts/demo-user-001.pdf"
}
```

**Grade summary for eligibility matching:**
- A+ (A*): 3 (Mathematics, English Language, Computer Science)
- A/A-: 5 (Physics, Chemistry, Biology, Further Mathematics, General Studies, Bahasa Melayu)
- B+: 1 (Economics)
- Cumulative: A* = 3, A = 8, B = 9 (passes most `minimumGrades` requirements)

### Transcript for User 2 (Hafiz — average)

**Document ID:** `demo-user-002`

```json
{
  "uid": "demo-user-002",
  "subjects": [
    { "name": "Mathematics", "grade": "B+", "code": "950" },
    { "name": "Physics", "grade": "B", "code": "960" },
    { "name": "Chemistry", "grade": "B", "code": "962" },
    { "name": "Bahasa Melayu", "grade": "A-", "code": "920" },
    { "name": "English Language", "grade": "A", "code": "910" },
    { "name": "General Studies", "grade": "B+", "code": "900" },
    { "name": "Economics", "grade": "A", "code": "944" },
    { "name": "Accounting", "grade": "B+", "code": "948" },
    { "name": "Business Studies", "grade": "B", "code": "946" }
  ],
  "gpa": 3.22,
  "year": 2025,
  "uploadedAt": "2026-01-18T11:00:00.000Z",
  "fileUrl": "https://storage.googleapis.com/demo-bucket/transcripts/demo-user-002.pdf"
}
```

**Grade summary for eligibility matching:**
- A+ (A*): 0
- A/A-: 3 (Bahasa Melayu, English Language, Economics)
- B+/B/B-: 5 (Mathematics, Physics, Chemistry, General Studies, Accounting, Business Studies)
- Cumulative: A* = 0, A = 3, B = 8 (fails scholarships requiring 4+ A grades)

---

## 3. `scholarships` Collection

**Path:** `scholarships/{auto-id}`

The seed script (`scripts/seed-scholarships.ts`) already has 19 scholarships. Below are 3 additional scholarships with varied requirements to demonstrate eligibility filtering.

### Scholarship 1 — Easy entry (low grade requirements)

**Document ID:** `demo-schol-easy-001`

```json
{
  "uid": "demo-schol-easy-001",
  "title": "MyDigital Talent Scholarship",
  "description": "The MyDigital Talent Scholarship supports Malaysian students pursuing STEM and digital economy degrees. Open to all education levels with modest academic requirements to encourage participation from diverse backgrounds.",
  "sourceUrl": "https://www.mydigital.gov.my/scholarship",
  "benefits": ["Tuition fees", "Laptop", "Monthly allowance RM 800"],
  "minimumGrades": { "A*": 0, "A": 1, "B": 3 },
  "studyLevel": ["undergraduate", "postgraduate"],
  "fieldOfStudy": "STEM, Digital Economy, Business IT",
  "essayQuestion": "How would you use digital skills to solve a problem in your community?",
  "groupTaskDescription": "Teams will brainstorm a digital solution for improving public transportation efficiency in a Malaysian city. Present a prototype concept with user journey.",
  "interviewFocusAreas": ["Digital literacy", "Community awareness", "Creativity", "Collaboration"],
  "stages": ["essay", "group", "interview"],
  "status": "open",
  "openingDate": "2026-01-01",
  "closingDate": "2026-06-30",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "provider": "Malaysia Digital Economy Corporation",
  "providerUrl": "https://www.mydigital.gov.my",
  "amount": "RM 40,000 per year",
  "deadline": "2026-06-30",
  "eligibility": "Malaysian citizens, CGPA 3.0 or above, interest in digital economy",
  "applicationLink": "https://www.mydigital.gov.my/scholarship/apply",
  "requirements": ["Academic transcripts", "Personal statement", "Proof of citizenship"],
  "risk": {
    "upfrontPayment": false,
    "noRequirements": false,
    "guaranteedApproval": false,
    "suspiciousOffer": false,
    "missingContactInfo": false,
    "riskLevel": "LOW"
  }
}
```

### Scholarship 2 — Hard entry (high grade requirements)

**Document ID:** `demo-schol-hard-001`

```json
{
  "uid": "demo-schol-hard-001",
  "title": "Khazanah Global Scholarship",
  "description": "The Khazanah Global Scholarship is Malaysia's most prestigious award for exceptional students. Full funding for studies at world-class universities including Oxbridge, Ivy League, and top Asian institutions.",
  "sourceUrl": "https://www.khazanah.com.my/scholarship",
  "benefits": ["Full tuition fees", "Living expenses", "Return airfare", "Accommodation", "Book allowance", "Thesis grant"],
  "minimumGrades": { "A*": 3, "A": 7, "B": 9 },
  "studyLevel": ["undergraduate"],
  "fieldOfStudy": "Any field — priority to STEM, Economics, Law, Public Policy",
  "essayQuestion": "Malaysia aspires to become a high-income nation by 2030. What structural reforms would you champion, and how does your chosen field contribute to this vision?",
  "groupTaskDescription": "Teams will develop a national development policy proposal addressing income inequality in Malaysia. Present data-driven recommendations with implementation timeline and budget.",
  "interviewFocusAreas": ["National development vision", "Critical thinking", "Policy awareness", "Leadership track record", "Global perspective"],
  "stages": ["essay", "group", "interview"],
  "status": "open",
  "openingDate": "2026-01-01",
  "closingDate": "2026-04-15",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "provider": "Khazanah Nasional Berhad",
  "providerUrl": "https://www.khazanah.com.my",
  "amount": "Full scholarship up to RM 500,000",
  "deadline": "2026-04-15",
  "eligibility": "Malaysian citizens, CGPA 3.9 or above, exceptional co-curricular record, household income below RM 300,000",
  "applicationLink": "https://www.khazanah.com.my/scholarship/apply",
  "requirements": ["Academic transcripts", "4 reference letters", "Leadership portfolio", "Personal statement", "Research proposal", "Parents' income documents"],
  "risk": {
    "upfrontPayment": false,
    "noRequirements": false,
    "guaranteedApproval": false,
    "suspiciousOffer": false,
    "missingContactInfo": false,
    "riskLevel": "LOW"
  }
}
```

### Scholarship 3 — Medium entry with suspicious risk

**Document ID:** `demo-schol-risky-001`

```json
{
  "uid": "demo-schol-risky-001",
  "title": "Global Education Foundation Award",
  "description": "The Global Education Foundation offers scholarships to students worldwide. Apply now for guaranteed approval and receive funding within 2 weeks of application.",
  "sourceUrl": "https://www.globaledfoundation-scholarships.com",
  "benefits": ["Tuition fees", "Living allowance", "Travel grant"],
  "minimumGrades": { "A*": 0, "A": 0, "B": 2 },
  "studyLevel": ["undergraduate", "postgraduate"],
  "fieldOfStudy": "Any field",
  "essayQuestion": "Why do you deserve this scholarship?",
  "groupTaskDescription": "No group task required.",
  "interviewFocusAreas": ["Motivation"],
  "stages": ["essay"],
  "status": "open",
  "openingDate": "2026-01-01",
  "closingDate": "2026-12-31",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "provider": "Global Education Foundation",
  "providerUrl": "https://www.globaledfoundation-scholarships.com",
  "amount": "USD 50,000",
  "deadline": "2026-12-31",
  "eligibility": "Open to all nationalities, no minimum CGPA",
  "applicationLink": "https://www.globaledfoundation-scholarships.com/apply",
  "requirements": ["Copy of passport or IC"],
  "risk": {
    "upfrontPayment": true,
    "noRequirements": true,
    "guaranteedApproval": true,
    "suspiciousOffer": true,
    "missingContactInfo": true,
    "riskLevel": "HIGH"
  }
}
```

---

## 4. `matches` Collection

**Path:** `matches/{uid}/items/{scholarshipId}`

Use the scholarship IDs from your actual Firestore scholarships collection. Below uses the demo IDs.

### Matches for User 1 (Aisha)

**Document path:** `matches/demo-user-001/items/demo-schol-easy-001`

```json
{
  "uid": "demo-user-001",
  "scholarshipId": "demo-schol-easy-001",
  "eligible": true,
  "reasons": ["Meets CGPA requirement", "Meets grade count requirements", "Citizenship matches"],
  "score": 92,
  "similarity": 0.88,
  "calculatedAt": "2026-02-27T10:00:00.000Z"
}
```

**Document path:** `matches/demo-user-001/items/demo-schol-hard-001`

```json
{
  "uid": "demo-user-001",
  "scholarshipId": "demo-schol-hard-001",
  "eligible": true,
  "reasons": ["Meets CGPA requirement", "Meets grade count requirements", "Strong field match"],
  "score": 87,
  "similarity": 0.82,
  "calculatedAt": "2026-02-27T10:00:00.000Z"
}
```

**Document path:** `matches/demo-user-001/items/demo-schol-risky-001`

```json
{
  "uid": "demo-user-001",
  "scholarshipId": "demo-schol-risky-001",
  "eligible": true,
  "reasons": ["Meets all basic requirements"],
  "score": 45,
  "similarity": 0.35,
  "calculatedAt": "2026-02-27T10:00:00.000Z"
}
```

### Matches for User 2 (Hafiz)

**Document path:** `matches/demo-user-002/items/demo-schol-easy-001`

```json
{
  "uid": "demo-user-002",
  "scholarshipId": "demo-schol-easy-001",
  "eligible": true,
  "reasons": ["Meets CGPA requirement", "Meets grade count requirements"],
  "score": 74,
  "similarity": 0.71,
  "calculatedAt": "2026-02-27T10:00:00.000Z"
}
```

**Document path:** `matches/demo-user-002/items/demo-schol-hard-001`

```json
{
  "uid": "demo-user-002",
  "scholarshipId": "demo-schol-hard-001",
  "eligible": false,
  "reasons": ["CGPA requirement not met. Required: 3.9, Your CGPA: 3.3", "Need 3 A* grade(s), you have 0", "Need 7 A grade(s), you have 3"],
  "score": 22,
  "similarity": 0.55,
  "calculatedAt": "2026-02-27T10:00:00.000Z"
}
```

---

## 5. `scholarships/{id}/applications` Subcollection

**Path:** `scholarships/{scholarshipId}/applications/{applicationId}`

### Application — User 1 applying to the easy scholarship (essay stage)

**Document path:** `scholarships/demo-schol-easy-001/applications/demo-app-001`

```json
{
  "userId": "demo-user-001",
  "scholarshipId": "demo-schol-easy-001",
  "status": "in_progress",
  "currentStage": "essay",
  "eligibilitySnapshot": {
    "meetsGradeRequirement": true,
    "checkedAt": "2026-02-27T10:00:00.000Z"
  },
  "stages": {
    "essay": {
      "draft": "Technology has the power to reshape Malaysia's future in ways we are only beginning to imagine. As a student passionate about computer science, I believe that artificial intelligence and data-driven solutions can bridge the gap between urban and rural communities...",
      "submitted": false,
      "checked": false,
      "passed": false,
      "reviewerNotes": null,
      "aiUsed": true,
      "aiHistory": [
        {
          "id": "ai-001",
          "type": "essay_draft",
          "title": "Initial Essay Draft",
          "response": "Here is a draft essay focusing on your passion for CS and community impact...",
          "createdAt": "2026-02-27T10:30:00.000Z"
        }
      ]
    },
    "group": {
      "checked": false,
      "passed": false,
      "reviewerNotes": null,
      "aiPreparationUsed": false,
      "aiHistory": []
    },
    "interview": {
      "status": "pending",
      "checked": false,
      "passed": false,
      "reviewerNotes": null,
      "aiPreparationGenerated": false,
      "aiHistory": [],
      "interviewer": null,
      "scheduledAt": null,
      "reflectionNotes": null
    }
  },
  "createdAt": "2026-02-27T10:00:00.000Z",
  "updatedAt": "2026-02-27T10:30:00.000Z"
}
```

### Application — User 1 applying to the hard scholarship (passed essay, now at group stage)

**Document path:** `scholarships/demo-schol-hard-001/applications/demo-app-002`

```json
{
  "userId": "demo-user-001",
  "scholarshipId": "demo-schol-hard-001",
  "status": "essay_passed",
  "currentStage": "group",
  "eligibilitySnapshot": {
    "meetsGradeRequirement": true,
    "checkedAt": "2026-02-20T08:00:00.000Z"
  },
  "stages": {
    "essay": {
      "draft": "Malaysia's vision of becoming a high-income nation demands bold structural reforms across education, technology, and governance. In this essay, I argue that investing in open-source digital infrastructure and STEM education reform are the two most impactful levers...",
      "submitted": true,
      "checked": true,
      "passed": true,
      "reviewerNotes": "Excellent essay with strong policy awareness and clear argumentation. Approved.",
      "aiUsed": true,
      "aiHistory": [
        {
          "id": "ai-002",
          "type": "essay_draft",
          "title": "Essay Draft",
          "response": "Draft focusing on structural reforms...",
          "createdAt": "2026-02-20T08:30:00.000Z"
        },
        {
          "id": "ai-003",
          "type": "essay_refine",
          "title": "Essay Refinement",
          "response": "Refined version with stronger conclusion...",
          "createdAt": "2026-02-20T09:00:00.000Z"
        }
      ]
    },
    "group": {
      "checked": false,
      "passed": false,
      "reviewerNotes": null,
      "aiPreparationUsed": true,
      "aiHistory": [
        {
          "id": "ai-004",
          "type": "group_breakdown",
          "title": "Case Study Breakdown",
          "response": "Here is a structured approach to the income inequality policy proposal...",
          "createdAt": "2026-02-25T14:00:00.000Z"
        }
      ]
    },
    "interview": {
      "status": "pending",
      "checked": false,
      "passed": false,
      "reviewerNotes": null,
      "aiPreparationGenerated": false,
      "aiHistory": [],
      "interviewer": null,
      "scheduledAt": null,
      "reflectionNotes": null
    }
  },
  "adminAudit": {
    "lastApprovedBy": "demo-admin-001",
    "lastApprovedAt": "2026-02-22T16:00:00.000Z",
    "notes": "Essay approved — strong candidate."
  },
  "createdAt": "2026-02-20T08:00:00.000Z",
  "updatedAt": "2026-02-25T14:00:00.000Z"
}
```

---

## 6. `applications` Collection (Tracker / Workflow)

**Path:** `applications/{uid}/items/{scholarshipId}`

### Tracked application for User 1

**Document path:** `applications/demo-user-001/items/demo-schol-easy-001`

```json
{
  "uid": "demo-user-001",
  "scholarshipId": "demo-schol-easy-001",
  "status": "applied",
  "checklist": [
    { "item": "Upload academic transcript", "completed": true },
    { "item": "Write personal statement", "completed": true },
    { "item": "Submit online application form", "completed": true },
    { "item": "Prepare for group assessment", "completed": false },
    { "item": "Attend interview", "completed": false }
  ],
  "deadline": "2026-06-30",
  "lastUpdated": "2026-02-27T10:00:00.000Z"
}
```

**Document path:** `applications/demo-user-001/items/demo-schol-hard-001`

```json
{
  "uid": "demo-user-001",
  "scholarshipId": "demo-schol-hard-001",
  "status": "interview",
  "checklist": [
    { "item": "Upload academic transcript", "completed": true },
    { "item": "Obtain 4 reference letters", "completed": true },
    { "item": "Prepare leadership portfolio", "completed": true },
    { "item": "Write personal statement", "completed": true },
    { "item": "Draft research proposal", "completed": true },
    { "item": "Submit parents income documents", "completed": true },
    { "item": "Complete essay stage", "completed": true },
    { "item": "Complete group assessment", "completed": true },
    { "item": "Prepare for final interview", "completed": false }
  ],
  "deadline": "2026-04-15",
  "lastUpdated": "2026-02-25T14:00:00.000Z"
}
```

---

## 7. `documents` Collection

**Path:** `documents/{id}`

### Transcript document for User 1

**Document ID:** `doc-transcript-001`

```json
{
  "id": "doc-transcript-001",
  "uid": "demo-user-001",
  "type": "transcript",
  "name": "STPM Academic Transcript 2025",
  "description": "Official STPM results transcript from Kolej Matrikulasi Selangor",
  "fileUrl": "https://storage.googleapis.com/demo-bucket/transcripts/demo-user-001.pdf",
  "fileName": "stpm-transcript-2025.pdf",
  "fileSize": 312000,
  "mimeType": "application/pdf",
  "extractedData": {
    "gpa": 3.89,
    "school": "Kolej Matrikulasi Selangor",
    "year": 2025,
    "subjectCount": 10
  },
  "ocrText": "SIJIL TINGGI PERSEKOLAHAN MALAYSIA (STPM) 2025\nName: Aisha binti Rahman\nIC No: 040115-10-XXXX\nSchool: Kolej Matrikulasi Selangor\n\nSubject Results:\nMathematics 950 - A+\nPhysics 960 - A\nChemistry 962 - A\nBiology 964 - A-\nFurther Mathematics 954 - A\nGeneral Studies 900 - A\nEnglish Language 910 - A+\nBahasa Melayu 920 - A\nComputer Science 970 - A+\nEconomics 944 - B+\n\nCGPA: 3.89",
  "isVerified": true,
  "uploadedAt": "2026-01-12T14:30:00.000Z",
  "updatedAt": "2026-01-12T14:35:00.000Z"
}
```

### Recommendation letter for User 1

**Document ID:** `doc-rec-001`

```json
{
  "id": "doc-rec-001",
  "uid": "demo-user-001",
  "type": "recommendation_letter",
  "name": "Recommendation Letter — Dr. Lim Wei Chen",
  "description": "Letter of recommendation from Physics lecturer at Kolej Matrikulasi Selangor",
  "fileUrl": "https://storage.googleapis.com/demo-bucket/docs/rec-letter-lim.pdf",
  "fileName": "recommendation-dr-lim.pdf",
  "fileSize": 185000,
  "mimeType": "application/pdf",
  "extractedData": {},
  "isVerified": false,
  "uploadedAt": "2026-02-01T09:00:00.000Z",
  "updatedAt": "2026-02-01T09:05:00.000Z"
}
```

### Essay document for User 1

**Document ID:** `doc-essay-001`

```json
{
  "id": "doc-essay-001",
  "uid": "demo-user-001",
  "type": "essay",
  "name": "Personal Statement — Khazanah Scholarship",
  "description": "Personal statement essay for the Khazanah Global Scholarship application",
  "fileUrl": "https://storage.googleapis.com/demo-bucket/docs/essay-khazanah.pdf",
  "fileName": "personal-statement-khazanah.pdf",
  "fileSize": 98000,
  "mimeType": "application/pdf",
  "extractedData": {},
  "isVerified": false,
  "uploadedAt": "2026-02-18T16:00:00.000Z",
  "updatedAt": "2026-02-18T16:05:00.000Z"
}
```

---

## 8. `certificates` Collection

**Path:** `certificates/{auto-id}`

### SPM Certificate for User 1

```json
{
  "userId": "demo-user-001",
  "certificateTitle": "Sijil Pelajaran Malaysia (SPM) 2023",
  "certificateType": "academic",
  "recipientName": "Aisha binti Rahman",
  "issuerName": "Lembaga Peperiksaan Malaysia",
  "programName": "Sijil Pelajaran Malaysia",
  "result": "9A 1B",
  "issueDate": "2024-03-15",
  "certificateId": "SPM-2023-XXXX",
  "verificationCode": "LP-VER-2024-001",
  "uploadedAt": "2026-01-12T15:00:00.000Z",
  "storagePath": "uploads/1736693200000-spm-cert.pdf"
}
```

### Co-curricular Award for User 1

```json
{
  "userId": "demo-user-001",
  "certificateTitle": "National Science Olympiad — Gold Medal",
  "certificateType": "award",
  "recipientName": "Aisha binti Rahman",
  "issuerName": "Akademi Sains Malaysia",
  "programName": "Malaysian National Science Olympiad 2024",
  "result": "Gold Medal — 1st Place",
  "issueDate": "2024-08-20",
  "uploadedAt": "2026-01-14T10:00:00.000Z",
  "storagePath": "uploads/1736856000000-science-olympiad.pdf"
}
```

### Certificate for User 2

```json
{
  "userId": "demo-user-002",
  "certificateTitle": "Debate Championship Certificate",
  "certificateType": "participation",
  "recipientName": "Hafiz bin Abdullah",
  "issuerName": "MRSM Langkawi",
  "programName": "Inter-MRSM Debate Championship 2024",
  "result": "Semi-Finalist",
  "issueDate": "2024-11-10",
  "uploadedAt": "2026-01-20T08:00:00.000Z",
  "storagePath": "uploads/1737352800000-debate-cert.pdf"
}
```

---

## Eligibility Quick Reference

| Scholarship | Min CGPA | Min Grades | User 1 (CGPA 3.89) | User 2 (CGPA 3.22) |
|---|---|---|---|---|
| Maxis Satria | 3.5 | 3A, 6B | Eligible | Not Eligible (needs 3A, has 3A but CGPA borderline via conversion) |
| Petronas | 3.8 | 5A, 4B | Eligible | Not Eligible |
| Maybank | 3.5 | 4A, 5B | Eligible | Not Eligible (only 3A) |
| Shell Malaysia | 3.8 | 5A, 4B | Eligible | Not Eligible |
| CIMB ASEAN | 3.7 | 5A, 4B | Eligible | Not Eligible |
| Sime Darby | 3.8 | 5A, 4B | Eligible | Not Eligible |
| TNB | 3.7 | 5A, 4B | Eligible | Not Eligible |
| MyDigital (easy) | 3.0 | 1A, 3B | Eligible | Eligible |
| Khazanah (hard) | 3.9 | 3A*, 7A, 9B | Not Eligible (only 3A*, 8A — needs 7A not counting A*) | Not Eligible |
| Risky Foundation | none | 2B | Eligible | Eligible |
| KLHC | 3.0 | 3A, 6B | Eligible | Eligible (3A, 8B) |
| Hartalega | 3.3 | 3A, 6B | Eligible | Not Eligible (CGPA 3.22 < 3.3) |
| UEM Group | 3.3 | 3A, 6B | Eligible | Not Eligible (CGPA) |
| TM | 3.3 | 3A, 6B | Eligible | Not Eligible (CGPA) |
| Axiata | 3.5 | 4A, 5B | Eligible | Not Eligible |
| Public Bank | 3.5 | 4A, 5B | Eligible | Not Eligible |
| Sinar Mas | 3.2 | 3A, 6B | Eligible | Eligible (3A, 8B, CGPA 3.22 >= 3.2) |
| Gamuda | 3.6 | 4A, 5B | Eligible | Not Eligible |
| RHB | 3.5 | 4A, 5B | Eligible | Not Eligible |
| MISC | 3.5 | 4A, 5B | Eligible | Not Eligible |
| Yinson | 3.5 | 4A, 5B | Eligible | Not Eligible |
| KLCBC | 3.5 | 4A, 5B | Eligible | Not Eligible |

**User 1 (Aisha):** Eligible for ~20 of 22 scholarships (fails Khazanah due to needing 7 pure A-tier grades).
**User 2 (Hafiz):** Eligible for ~4 of 22 scholarships (MyDigital, Risky Foundation, KLHC, Sinar Mas).
