# MyDana: AI-Powered Malaysian Scholarship Platform

**MyDana** transforms the fragmented scholarship discovery process into an intelligent, automated, and deterministic workflow. Built for **KitaHack 2026**, it leverages AI to simplify requirements while using strict business logic to ensure fairness and accuracy.

---

## 📖 Table of Contents
- [Problem Statement & SDG Alignment](#1-problem-statement--sdg-alignment)
- [Tech Stack](#2-tech-stack)
- [Technical Architecture](#3-technical-architecture)
- [Core Features](#4-core-features)
- [Implementation Details](#5-implementation-details)
- [User Feedback & Iteration](#6-user-feedback--iteration)
- [Success Metrics](#7-success-metrics)
- [Roadmap & Scalability](#8-roadmap--scalability)

---

## 1. Problem Statement & SDG Alignment

### The Problem
SPM school leavers in Malaysia face a fragmented scholarship landscape. Information is scattered across individual websites, requirements are complex, and documentation is overwhelming. 
- **Information Gap:** Outdated info and missed deadlines.
- **Complexity:** Difficulty interpreting eligibility criteria.
- **Essay Fatigue:** Over-reliance on generic AI-generated essays, reducing authenticity.

### SDG Alignment
- **SDG 4 (Quality Education):** Ensuring financial barriers don't prevent qualified students from pursuing tertiary studies.
- **SDG 8 (Decent Work & Economic Growth):** Strengthening the education-to-employment pipeline by preventing human capital loss due to information gaps.
- **SDG 10 (Reduced Inequalities):** Leveling the playing field for B40 and rural students who lack professional guidance.

---

## 2. Tech Stack

### Frontend & Framework
- **Next.js 16 (App Router):** Server-side rendering and high-performance routing.
- **Tailwind CSS 4:** Utility-first styling for a premium, modern UI.
- **shadcn/ui:** Accessible, consistent UI primitives.
- **Lucide React:** Iconography.

### Backend & Infrastructure
- **tRPC:** End-to-end type-safety between client and server.
- **Firebase (Firestore, Auth, Storage):** Real-time database, Google Auth, and document storage.
- **Bun:** High-performance JavaScript runtime and package manager.

### AI & Intelligence
- **Google Gemini (Vertex AI):** NLP for requirement extraction and AI-assisted essay feedback.
- **Google Vision API:** OCR for transcript processing and data normalization.

---

## 3. Technical Architecture

MyDana follows a **Deterministic Intelligence** pattern:
1.  **AI for Normalization:** AI processes unstructured transcripts and scholarship PDFs into a standardized schema (Zod).
2.  **Deterministic Logic:** Pure TypeScript functions handle eligibility matching (e.g., Grade "A+" counting towards "A" requirements). **AI never decides who gets a scholarship.**
3.  **Type-Safe Communication:** tRPC ensures the frontend and backend are always in sync, preventing runtime crashes.

---

## 4. Core Features

### 🔍 Discovery & Matching
AI recommends scholarships based on student profiles (grades, income, interests). Our algorithm uses a composite score of 60% academic eligibility and 40% semantic interest similarity.

### 📄 Intelligent Transcript Processing
Students upload their results (PDF/Image). The platform performs OCR and normalizes Malaysian grades (SPM/STPM/Foundation) into a unified internal format for instant eligibility checking.

### ✍️ AI-Assisted Essay Feedback
Unlike generation tools, our AI provides structure suggestions and grammar feedback to help students maintain their **authentic voice** while improving competitiveness.

### 🎭 Scenario-Based Interview Prep
Simulates company-specific interviews (e.g., Maxis, Petronas) using AI trained on corporate mission statements and historical focus areas.

---

## 5. Implementation Details

- **Grade Hierarchy Logic:** Implemented a cumulative grade matching system where higher grades (A+) automatically fulfill lower requirements (A, B).
- **Admin Simulation Mode:** A dedicated mode for judges to visualize the approval workflow from a provider's perspective without needing a separate account.
- **N+1 Optimization:** Consolidated dashboard data fetching into a single tRPC query that parallelizes Firestore reads, reducing loading times by ~70%.

---

## 6. User Feedback & Iteration

### Insights from Initial Survey
1.  **Privacy Concerns:** Users were wary of how their academic data is used. **Iteration:** Implemented a privacy-first architecture with localized AI processing.
2.  **"GPT-ism" in Essays:** Users wanted help writing, not just a generator. **Iteration:** Shifted from "Essay Generation" to "Scenario-Based Feedback."
3.  **Role Play Prep:** Users requested interview simulation. **Iteration:** Added the "Interview Preparation" stage with AI-driven scenario questions.

---

## 7. Success Metrics

- **Discovery Efficiency:** Target ≥50% reduction in time spent identifying eligible scholarships.
- **Match Precision:** Aiming for ≥85% relevance accuracy in recommended opportunities.
- **Application Completion:** Goal of ≥40% improvement in finished submissions through automated tracking and reminders.
- **Authentic Confidence:** ≥80% of users reporting improved confidence in their original essay voice.

---

## 8. Roadmap & Scalability

### Phase 1: Pilot (0–6 Months)
- Malaysian SPM leavers focus.
- Curated database of top 200 scholarships.
- AI-powered eligibility filtering.

### Phase 2: National Scale (6–18 Months)
- Automated scholarship scraping + verification pipeline.
- Modular AI orchestration (Eligibility vs. Writing-Assist).
- Direct partnerships with foundations for internal dashboard access.

### Phase 3: Regional Expansion (18–36 Months)
- Expansion to SEA (Indonesia, Vietnam, Thailand).
- Multi-language AI writing support.
- Adaptable eligibility models for regional qualification standards.

---
**MyDana** — *Unlocking futures, one application at a time.*
Built for **KitaHack 2026**.
