# Scholarship Guide

An AI-Powered Scholarship Guidance Platform for Post-SPM Students

## Overview

Scholarship Guide is an intelligent platform that transforms scholarship discovery into an automatic eligibility and execution workflow. The platform uses AI for data normalization while maintaining deterministic business logic for eligibility decisions.

### Core Philosophy

- **AI never decides eligibility** - AI only normalizes unstructured data
- **All business logic is deterministic** - Pure functions for eligibility checks
- **Server owns all intelligence** - Client renders state only
- **End-to-end type safety** - tRPC provides type-safe APIs
- **Validation at every step** - Zod schemas enforce data integrity

## Features

### 1. Scholarship Ingestion (AI-Powered)
- Upload scholarship descriptions in any format
- AI extracts structured requirements (citizenship, income caps, grades, deadlines)
- Automatic embedding generation for semantic matching
- Zod validation ensures data quality

### 2. Transcript Processing (AI-Powered)
- Upload transcripts via PDF or image
- Google Vision API performs OCR
- Gemini AI normalizes grades and subjects
- Validated against transcript schema

### 3. Eligibility Engine (Deterministic)
- Pure function checks eligibility
- Validates citizenship, income, academic requirements
- Returns boolean result with rejection reasons
- No AI involved in decision-making

### 4. Semantic Matching
- Embeds user interests and goals
- Embeds scholarship descriptions
- Calculates cosine similarity
- Composite score: 60% eligibility + 40% similarity

### 5. Application Assistant (AI-Powered)
- Generate essay drafts based on profile
- Refine existing essays with feedback
- Interview question preparation
- Personalized guidance framework

### 6. Workflow & Reminders
- Track application status
- Deadline monitoring
- Automated checklist generation
- Priority-based reminders

## Technology Stack

### Frontend
- **Next.js 16** - App Router for server components
- **TypeScript** - Strict mode enabled
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - Minimal UI primitives

### Backend
- **tRPC** - End-to-end type-safe APIs
- **Firebase**
  - Authentication (Google Sign-In)
  - Firestore (NoSQL database)
  - Storage (File uploads)
- **Zod** - Runtime validation

### AI/ML
- **Google Gemini** (Vertex AI) - Text generation and embeddings
- **Google Vision API** - OCR for documents

### Tooling
- **Bun** - Package manager and runtime
- **Pino** - Structured logging
- **ESLint** - Code linting with Next.js rules

## Project Structure

```
kitahack-2026/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── trpc/[trpc]/route.ts  # tRPC API handler
│   │   └── upload/route.ts       # File upload handler
│   ├── dashboard/page.tsx        # Match dashboard
│   ├── scholarships/page.tsx     # Scholarship management
│   ├── upload/page.tsx           # Transcript upload
│   ├── assistant/page.tsx        # AI assistant
│   ├── profile/page.tsx          # User profile
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   └── tabs.tsx
│   └── providers/
│       ├── auth-provider.tsx     # Firebase auth context
│       └── trpc-provider.tsx     # tRPC client provider
├── lib/
│   ├── ai/                       # AI integration layer
│   │   ├── gemini.ts            # Gemini API wrapper
│   │   ├── vision.ts            # Vision API wrapper
│   │   └── embeddings.ts        # Embedding cache
│   ├── firebase/                 # Firebase configuration
│   │   ├── admin.ts             # Admin SDK
│   │   └── client.ts            # Client SDK
│   ├── schemas/                  # Zod schemas
│   │   ├── user.schema.ts
│   │   ├── scholarship.schema.ts
│   │   ├── transcript.schema.ts
│   │   └── ai.schema.ts
│   ├── services/                 # Business logic
│   │   ├── eligibility.service.ts
│   │   ├── matching.service.ts
│   │   ├── assistant.service.ts
│   │   ├── reminders.service.ts
│   │   └── parsing.service.ts
│   ├── repositories/             # Data access layer
│   │   ├── users.repo.ts
│   │   ├── scholarships.repo.ts
│   │   ├── transcripts.repo.ts
│   │   └── applications.repo.ts
│   ├── trpc/                     # tRPC configuration
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── router.ts
│   │   └── config.ts
│   ├── utils/                    # Utilities
│   │   ├── logger.ts
│   │   ├── dates.ts
│   │   └── math.ts
│   └── server/routers/           # tRPC routers
│       ├── auth.router.ts
│       ├── profile.router.ts
│       ├── scholarship.router.ts
│       ├── transcript.router.ts
│       ├── match.router.ts
│       ├── assistant.router.ts
│       └── workflow.router.ts
├── types/                        # TypeScript types
├── styles/
│   └── globals.css
├── AGENTS.md                     # AI coding guidelines
├── plan.md                       # Original project plan
└── README.md                     # This file
```

## Local Setup

### Prerequisites

- **Bun** (recommended) or Node.js 20+
- Firebase project with Authentication, Firestore, and Storage enabled
- Google Cloud project with Vertex AI and Vision API enabled

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd kitahack-2026
```

2. **Install dependencies**
```bash
bun install
# or
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the project root:

```bash
# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin (Private)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Google Cloud
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
```

4. **Set up Firebase**

- Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
- Enable Authentication (Google Sign-In provider)
- Create Firestore database
- Enable Storage
- Generate a service account key (Project Settings > Service Accounts)
- Download and save as `service-account.json` (add to `.gitignore`)

5. **Set up Google Cloud**

- Enable Vertex AI API
- Enable Vision API
- Ensure the service account has necessary permissions:
  - `aiplatform.user`
  - `storage.objectViewer`
  - `storage.objectCreator`

6. **Run the development server**
```bash
bun run dev
# or
npm run dev
```

7. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Development Guidelines

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Double quotes for strings and JSX
- **Semicolons**: Required at end of statements
- **Trailing Commas**: ES5 style

### Import Conventions

Always use path aliases for internal imports:

```typescript
// ✅ Good
import { Button } from "@/components/ui/button";
import { checkEligibility } from "@/lib/services/eligibility.service";

// ❌ Bad
import { Button } from "../../../components/ui/button";
```

Import ordering:
1. External dependencies
2. Internal components and utilities
3. Styles
4. Types

### Server vs Client Components

- **Default**: All components in `app/` are Server Components
- **"use client"**: Only when needed for:
  - Event listeners (`onClick`, `onChange`)
  - React Hooks (`useState`, `useEffect`)
  - Browser APIs (`window`, `localStorage`)

### Naming Conventions

- **Components**: PascalCase (e.g., `DashboardPage`)
- **Files**: kebab-case for directories, PascalCase for components
- **Functions/Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Interfaces/Types**: PascalCase

### TypeScript Rules

- Strict mode is enabled
- Always define return types for complex functions
- Define component props using interfaces
- Avoid `any` - use `unknown` or specific types

### tRPC Best Practices

```typescript
// Define input schemas with Zod
const inputSchema = z.object({
  scholarshipId: z.string(),
  prompt: z.string(),
});

// Use proper procedure types
export const router = router({
  myEndpoint: protectedProcedure
    .input(inputSchema)
    .mutation(async ({ ctx, input }) => {
      // Implementation
    }),
});
```

### AI Integration Guidelines

1. **AI is for normalization only** - Never use AI for eligibility decisions
2. **Always validate AI output** with Zod schemas
3. **Handle failures gracefully** - Log errors and return meaningful messages
4. **Cache embeddings** - Store in Firestore to reduce API calls

### Database Schema

#### Users Collection (`users/{uid}`)
```typescript
{
  uid: string;
  email: string;
  name: string;
  citizenship?: string;
  incomeBracket?: "low" | "medium" | "high";
  interests: string[];
  goals?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Scholarships Collection (`scholarships/{id}`)
```typescript
{
  id: string;
  title: string;
  description: string;
  provider: string;
  citizenship?: string[];
  incomeCap?: number;
  minGrades?: Record<string, number>;
  fieldsAllowed?: string[];
  deadline: string;
  benefits: string;
  applicationUrl?: string;
  embedding?: number[];
  createdAt: string;
  updatedAt: string;
}
```

#### Transcripts Collection (`transcripts/{uid}`)
```typescript
{
  uid: string;
  subjects: Array<{ name: string; grade: number; code?: string }>;
  gpa: number;
  year: number;
  uploadedAt: string;
  fileUrl?: string;
}
```

#### Matches Subcollection (`matches/{uid}/items/{scholarshipId}`)
```typescript
{
  uid: string;
  scholarshipId: string;
  eligible: boolean;
  reasons: string[];
  score: number;
  similarity: number;
  calculatedAt: string;
}
```

#### Applications Subcollection (`applications/{uid}/items/{scholarshipId}`)
```typescript
{
  uid: string;
  scholarshipId: string;
  status: "interested" | "applied" | "interview" | "accepted" | "rejected";
  checklist: Array<{ item: string; completed: boolean }>;
  deadline: string;
  lastUpdated: string;
}
```

### Testing Strategy

Currently no testing framework is configured. To add tests:

```bash
bun add -D vitest @testing-library/react @testing-library/jest-dom
```

Recommended test coverage:
- Eligibility service (pure functions, easy to test)
- Zod schema validation
- API route handlers
- Utility functions

### Security Rules

#### Firestore Rules (Basic)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /transcripts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Scholarships are public read, admin write
    match /scholarships/{scholarshipId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // User-specific subcollections
    match /{collection}/{userId}/items/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Deployment

1. **Build the project**
```bash
bun run build
# or
npm run build
```

2. **Deploy to Vercel**
```bash
vercel --prod
```

3. **Environment Variables**
Ensure all environment variables are set in your deployment platform.

### Monitoring & Logging

- **Pino** is configured for structured logging
- Logs include request context and error details
- Check logs in Vercel dashboard or Cloud Logging

### Performance Considerations

1. **Embedding Caching**: Embeddings are cached in memory and should be stored in Firestore
2. **Batch Operations**: Use Firestore batch writes for multiple operations
3. **Image Optimization**: Use Next.js Image component for optimized images
4. **Route Splitting**: Each major feature has its own route for code splitting

## Contributing

### Commit Message Convention

Use Conventional Commits:

```
feat: add user profile editing
fix: resolve eligibility calculation bug
chore: update dependencies
docs: update API documentation
refactor: simplify matching algorithm
test: add eligibility service tests
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make changes following the code style guidelines
3. Update documentation if needed
4. Run linting: `bun run lint`
5. Submit PR with clear description

### Code Review Checklist

- [ ] TypeScript compiles without errors
- [ ] No `any` types without justification
- [ ] Zod schemas validate all inputs
- [ ] AI outputs are validated before use
- [ ] Error handling is implemented
- [ ] Logging is added for important events
- [ ] No secrets in code

## Troubleshooting

### Common Issues

**Firebase Auth not working**
- Check that Firebase config is correct
- Ensure Google Sign-In is enabled in Firebase Console
- Verify `authDomain` matches your domain

**tRPC errors**
- Ensure client and server routers are in sync
- Check that mutations are awaited properly
- Verify Zod schemas match expected inputs

**AI API errors**
- Check GOOGLE_CLOUD_PROJECT is set correctly
- Verify service account has Vertex AI permissions
- Check API quotas and billing

**Build errors**
- Delete `.next` folder and rebuild
- Ensure all dependencies are installed
- Check for TypeScript errors: `tsc --noEmit`

### Getting Help

- Check the [AGENTS.md](./AGENTS.md) file for coding guidelines
- Review the [plan.md](./plan.md) for architecture decisions
- Open an issue on GitHub for bugs or feature requests

## License

[Your License Here]

## Acknowledgments

- Built for KitaHack 2026
- Uses Google Cloud AI/ML services
- Powered by Next.js and Firebase

---

**Happy Coding!** 🚀
