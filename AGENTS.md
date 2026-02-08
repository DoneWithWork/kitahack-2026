# AGENTS.md

This file serves as the primary source of truth for agentic coding agents (AI) operating within this repository. It defines the build system, code style, conventions, and operational rules. Always use the context7 mcp for reference to external documentations. 

## 1. Environment & Commands

### Build System
This project is built with **Next.js 16** and uses **Bun** (`bun.lock`) for dependency management.

- **Package Manager:** `bun` (preferred) or `npm`.
- **Node Version:** Compatible with `@types/node` v20+.

### Execution Commands
Use these commands to interact with the project:

- **Install Dependencies:**
  ```bash
  bun install
  # OR
  npm install
  ```

- **Start Development Server:**
  ```bash
  bun run dev
  # OR
  npm run dev
  ```
  Runs on `http://localhost:3000` by default.

- **Production Build:**
  ```bash
  bun run build
  # OR
  npm run build
  ```
  Creates an optimized production build in the `.next` folder.

- **Start Production Server:**
  ```bash
  bun run start
  # OR
  npm start
  ```

- **Linting:**
  ```bash
  bun run lint
  # OR
  npm run lint
  ```
  Runs ESLint configured with Next.js Core Web Vitals and TypeScript rules.

### Testing
⚠️ **Current Status:** No testing framework (Jest, Vitest, Playwright) is currently configured in `package.json`.

- **Running Tests:** N/A.
- **Adding Tests:** If instructed to add tests, install **Vitest** or **Jest** first. Do not hallucinate successful test runs.
- **Agent Action:** If a user asks to "run tests", explain that no framework is installed and offer to set one up.

## 2. Code Style & Conventions

### Technology Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS 4
- **Backend/Services:** Firebase (v12.8.0)
- **Fonts:** `next/font` (Geist, Geist Mono)

### Formatting Rules
- **Indentation:** 2 spaces.
- **Line Length:** Soft limit of 80-100 characters.
- **Quotes:** Double quotes (`"`) for all string literals and JSX attributes.
- **Semicolons:** Required at the end of statements.
- **Trailing Commas:** ES5 trailing commas (objects, arrays, etc.).

### Import Conventions
- **Path Aliases:** ALWAYS use the `@/` alias for imports from the project root.
  - ✅ `import Button from "@/components/Button";`
  - ❌ `import Button from "../../components/Button";`
- **Ordering:**
  1.  External dependencies (e.g., `react`, `next/image`).
  2.  Internal components and utilities (e.g., `@/lib/utils`).
  3.  Styles (e.g., `./globals.css`).
  4.  Types.

### Naming Conventions
- **Directories:**
  - Next.js Routes: `kebab-case` (e.g., `app/blog-posts/`).
  - Components: `kebab-case` or `PascalCase` (consistency is key, typically Next.js apps use kebab-case for folders).
- **Files:**
  - Route files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`.
  - Components: `PascalCase.tsx` (e.g., `Header.tsx`).
  - Utilities: `camelCase.ts` (e.g., `formatDate.ts`).
- **Code:**
  - Components: `PascalCase` (e.g., `function UserProfile()`).
  - Functions/Variables: `camelCase` (e.g., `handleSubmit`, `userData`).
  - Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`).
  - Interfaces/Types: `PascalCase` (e.g., `UserProps`).

### TypeScript Rules
- **Strict Mode:** Enabled. `noImplicitAny` is on.
- **Explicit Types:** Always define return types for complex functions and API handlers.
- **Props:** Define component props using an `interface` or `type` (e.g., `type Props = { ... }`).
- **Avoid `any`:** Use `unknown` or specific types.

### Component Architecture (Next.js App Router)
- **Server vs. Client:**
  - By default, all components in `app/` are **Server Components**.
  - Use `"use client";` at the very top of the file only when you need:
    - Event listeners (`onClick`, `onChange`).
    - React Hooks (`useState`, `useEffect`).
    - Browser-only APIs (`window`, `localStorage`).
- **Data Fetching:** Prefer fetching data in Server Components using `async/await`.

### Styling (Tailwind CSS)
- **Utility First:** Use utility classes directly in the `className` prop.
- **Sorting:** Group layout classes first (display, position), then box model (margin, padding), then visual (colors, fonts).
- **Arbitrary Values:** Use `[]` syntax for one-off values (e.g., `w-[350px]`).
- **Dark Mode:** Support dark mode using the `dark:` prefix (e.g., `bg-white dark:bg-black`).

## 3. Documentation & Comments
- **Self-Documenting Code:** meaningful variable names are better than comments.
- **Complex Logic:** Add a brief `//` comment explaining *why* a complex logic block exists.
- **JSDoc:** Use JSDoc `/** ... */` for exported utility functions explaining parameters and return values.

## 4. Git & Version Control
- **Commit Messages:** Use Conventional Commits format if creating commits.
  - `feat: add user login`
  - `fix: resolve hydration error`
  - `chore: update dependencies`
  - `docs: update README`
- **Files to Ignore:** Respect `.gitignore`. Do not commit `.env` files.

## 5. Specific Rules (Cursor/Copilot)
- **Tool Usage (Mandatory):** Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.
- **Cursor Rules:** None present (`.cursor/rules` or `.cursorrules`).
- **Copilot Instructions:** None present (`.github/copilot-instructions.md`).
- **Fallback:** In the absence of specific rules, adhere strictly to the guidelines in this file and standard industry best practices for Next.js/React/TypeScript development.
