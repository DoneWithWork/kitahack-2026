# MyDana — AI-Powered Scholarship Intelligence Platform

MyDana centralizes scholarship discovery and simplifies the application process for Malaysian SPM school leavers, particularly students from B40, rural, and first-generation education backgrounds. The platform uses Google AI to transform fragmented scholarship information into structured, personalized guidance — ensuring students miss fewer opportunities due to information gaps rather than lack of ability.

Built for **KitaHack 2026**.

---

## Technical Implementation

### Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 (Strict) |
| Styling | Tailwind CSS 4, shadcn/ui, Radix UI primitives |
| API | tRPC v11 (end-to-end type safety), TanStack React Query |
| Database | Cloud Firestore (NoSQL, real-time sync) |
| Auth | Firebase Authentication (Google sign-in) |
| Storage | Firebase Storage (transcript/document uploads) |
| Analytics | Firebase Analytics |
| AI — Fast Extraction | Google Gemini 2.5 Flash Lite via `@google/genai` SDK |
| AI — Complex Reasoning | Google Gemini 3 Flash Preview via `@google/genai` SDK |
| AI — Embeddings | Vertex AI (`text-embedding-004`) for semantic similarity |
| Validation | Zod v4 (runtime schemas + Gemini structured output via `z.toJSONSchema()`) |
| Runtime | Bun (package manager + script execution) |
| Deployment | Vercel (serverless functions) |
| Logging | Pino (structured server-side logging) |

### Google Technologies Used

- **Google Gemini (2.5 Flash Lite + 3 Flash Preview):** Powers transcript OCR, eligibility extraction, essay feedback, and interview scenario generation. Schema-validated generation via Zod ensures reliably parseable AI responses.
- **Google Vertex AI:** Provides text embeddings for semantic scholarship-to-student interest matching.
- **Firebase Firestore:** Document-based storage for scholarship metadata, user profiles, transcripts, and application tracking.
- **Firebase Auth:** Google sign-in integration for frictionless student onboarding.
- **Firebase Storage:** Secure upload and retrieval of academic documents (PDFs, images).
- **Firebase Analytics:** Usage tracking with measurement ID for monitoring platform engagement.

---

## Technical Architecture

MyDana follows a **Deterministic Intelligence Pattern** — AI handles interpretation and extraction, but eligibility decisions are made by auditable TypeScript business logic.

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js 16)              │
│         App Router + RSC + Tailwind + shadcn/ui      │
└──────────────────────┬──────────────────────────────┘
                       │ tRPC (type-safe RPC)
┌──────────────────────▼──────────────────────────────┐
│              Server Layer (12 tRPC Routers)           │
│   auth · profile · scholarship · transcript · match  │
│   assistant · workflow · document · onboarding        │
│   application · admin · scrape                        │
└────────┬─────────────────┬──────────────────────────┘
         │                 │
┌────────▼───────┐  ┌──────▼───────────────────────┐
│  AI Layer      │  │  Deterministic Engine          │
│  Gemini 2.5    │  │  TypeScript eligibility logic  │
│  Gemini 3      │  │  Grade hierarchy matching      │
│  Vertex AI     │  │  Composite scoring (60/40)     │
│  Embeddings    │  │  Zod-validated schemas          │
└────────┬───────┘  └──────┬───────────────────────┘
         │                 │
┌────────▼─────────────────▼──────────────────────────┐
│              Data Layer (Firebase)                    │
│   Firestore · Auth · Storage · Analytics             │
│   Repository pattern (6 collections)                 │
└─────────────────────────────────────────────────────┘
```

**Key design decisions:**
- AI is restricted to the **interpretation layer** (extracting data, generating guidance). The **matching engine** runs deterministic TypeScript logic, preventing hallucination from affecting eligibility results.
- tRPC provides compile-time type safety between frontend and backend, eliminating runtime contract mismatches across 12 routers.
- Repository pattern abstracts Firestore operations, making the data layer swappable without modifying service logic.

---

## Implementation Details

**Structured AI Output:** Early attempts at prompt-engineering Gemini to return JSON were unreliable — the model would include explanatory text that broke `JSON.parse`. We solved this by implementing Zod v4's `z.toJSONSchema()` for schema-validated generation, ensuring 100% parseable responses from Gemini without post-processing.

**Multi-Model Orchestration:** Different Gemini models serve different roles. Gemini 2.5 Flash Lite handles high-speed transcript OCR and data extraction. Gemini 3 Flash Preview handles complex reasoning for essay feedback and scenario-based interview simulation. Vertex AI embeddings power semantic similarity matching between student interests and scholarship descriptions.

**Deterministic Eligibility Matching:** A cumulative grade hierarchy system ensures higher grades (A+) automatically satisfy lower requirements (A, B). Matching uses a composite score: 60% academic eligibility + 40% semantic interest similarity via Vertex AI embeddings.

**Dashboard Optimization:** A single tRPC query parallelizes multiple Firestore reads for the student dashboard, reducing load times by approximately 70% compared to sequential fetching.

---

## Challenges Faced

1. **AI Response Consistency:** Gemini occasionally returned malformed JSON despite prompt constraints. Transitioning to native schema-validated generation (Zod-to-JSON-Schema) eliminated parsing failures entirely and simplified backend integration.

2. **Trust vs. Automation Trade-off:** User research showed students want automation but distrust AI decisions. We addressed this by separating AI (interpretation only) from deterministic logic (decisions), making eligibility results auditable and explainable.

3. **Essay Authenticity Concern:** Users worried that AI-generated essays would sound generic. We pivoted from essay generation to scenario-based writing guidance — providing structural feedback, grammar correction, and idea prompts while preserving the student's original voice.

4. **Privacy-First Architecture:** Students raised concerns about academic data security. We implemented controlled inference pipelines where sensitive data stays within Firebase's ecosystem and is not passed to external training processes.

---

## Future Roadmap

**Phase 1 — Pilot (0–6 months)**
Expand the curated scholarship database to 200+ verified Malaysian opportunities. Refine transcript extraction accuracy and conduct continuous user testing to validate discovery efficiency improvements.

**Phase 2 — National Scale (6–18 months)**
Introduce automated scholarship data pipelines, modular AI orchestration (separate models for eligibility, writing, and guidance), and analytics dashboards for scholarship providers. Transition to cloud-native infrastructure supporting thousands of concurrent users.

**Phase 3 — Regional Expansion (18–36 months)**
Adapt the platform for Southeast Asian education systems (Indonesia, Vietnam, Thailand). Add multi-language AI guidance, cross-country scholarship discovery, and vocational/foundation pathway support. Position MyDana as regional scholarship intelligence infrastructure.

---

## SDG Alignment

- **SDG 4 (Quality Education):** Ensures financial barriers and information fragmentation do not prevent capable students from accessing tertiary education.
- **SDG 8 (Decent Work & Economic Growth):** Strengthens the education-to-employment pipeline by reducing information inefficiencies that cause human capital loss.
- **SDG 10 (Reduced Inequalities):** Levels the playing field for B40 and rural students who lack professional mentorship by providing AI-assisted guidance independent of school resources.
