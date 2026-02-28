# MyDANA: AI-Powered Malaysian Scholarship Platform

**MyDANA**  transforms the fragmented scholarship discovery process into an intelligent, automated, and deterministic workflow. Built for **KitaHack 2026**, it leverages Google Cloud's AI suite to simplify requirements while using strict business logic to ensure fairness and accuracy.

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

## 2. Tech Stack & Google Cloud Integration

MyDANA leverages a robust modern stack with deep integration into the Google Cloud ecosystem for high-performance AI and infrastructure.

### Google Cloud & AI Tools
- **Google Gemini 3.0 & 2.5 Flash:** Orchestrated via Google Cloud to power the platform's multi-modal intelligence.
  - **Gemini 3.0:** Handles complex reasoning for personalized essay feedback and scenario-based interview simulation.
  - **Gemini 2.5 Flash:** Used for high-speed OCR and data extraction from transcripts and scholarship documents.
- **Firebase Authentication:** Secure, seamless Google-integrated identity management.
- **Cloud Firestore:** NoSQL real-time database for managing scholarship data and application states.
- **Firebase Storage:** Secure cloud storage for student documents and transcripts.

### Frontend & Framework
- **Next.js 16 (App Router):** Utilizing React Server Components (RSC) for optimal performance and SEO.
- **Tailwind CSS 4:** Cutting-edge utility-first styling for a premium, high-fidelity UI.
- **shadcn/ui:** Accessible, consistent UI primitives for a professional dashboard experience.

### Backend & Runtime
- **tRPC:** End-to-end type-safety between the Next.js server and the React client.
- **Bun:** High-performance JavaScript runtime and package manager used for development and execution.
- **Zod:** Strict schema validation ensuring data integrity across the entire application.

---

## 3. Technical Architecture & Implementation Overview

MyDANA follows a **Deterministic Intelligence** pattern:
1.  **AI for Normalization (Gemini 2.5 Flash):** High-speed multi-modal extraction of text from transcripts and scholarship PDFs into a standardized Zod schema.
2.  **Deterministic Logic:** Pure TypeScript functions handle eligibility matching (e.g., Grade "A+" counting towards "A" requirements). **AI never decides who gets a scholarship.**
3.  **Complex Reasoning (Gemini 3.0):** Powers the intelligent essay feedback and interview scenario generation, ensuring high-quality, personalized student support.
4.  **Type-Safe Communication (tRPC):** End-to-end type safety ensures the frontend and backend are always in sync.
5.  **Optimized Data Access:** Dashboard logic uses a single tRPC query to parallelize Firestore reads, reducing load times by ~70%.

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
**MyDANA** — *Unlocking futures, one application at a time.*
Built for **KitaHack 2026**.
