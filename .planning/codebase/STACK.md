# Technology Stack

**Analysis Date:** 2026-02-13

## Languages

**Primary:**
- TypeScript 5.x - Used for all source code, strict mode enabled
- JavaScript (ES2017+) - Runtime target

**Secondary:**
- SQL - PostgreSQL queries via Prisma ORM

## Runtime

**Environment:**
- Node.js 18.6.0+ (development verified with v18.6.0)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.1.6 - Full-stack React framework with App Router
  - App Router (React Server Components enabled)
  - API Routes for backend endpoints
  - Middleware for authentication

**Frontend:**
- React 19.2.3 - UI library with latest hooks
- React DOM 19.2.3 - DOM rendering

**UI Components:**
- shadcn/ui - Headless component library (configured in `components.json`)
- Tailwind CSS 4.x - Utility-first CSS framework with PostCSS v4
- Lucide React 0.563.0 - Icon library
- class-variance-authority 0.7.1 - Component variant composition
- clsx 2.1.1 - Utility for className management
- tailwind-merge 3.4.0 - Merge Tailwind CSS classes intelligently

**Database:**
- Prisma 5.20.0 - ORM with schema migration
  - Client: `@prisma/client` 5.20.0
  - Provider: PostgreSQL
  - Seed support via `tsx`

**Authentication:**
- Clerk 6.37.3 (`@clerk/nextjs`) - Authentication and user management
  - Next.js integration with middleware
  - Server and client components support

## Key Dependencies

**Critical:**
- `@clerk/nextjs` 6.37.3 - Handles user authentication, session management, and authorization
- `@prisma/client` 5.20.0 - Database ORM and client for PostgreSQL operations
- `next` 16.1.6 - Framework that ties frontend and backend together
- `react` 19.2.3 - Core UI framework

**Infrastructure:**
- `typescript` 5.x - Type safety across codebase
- `tsx` 4.21.0 - TypeScript execution for Prisma seed scripts
- `@tailwindcss/postcss` 4 - PostCSS plugin for Tailwind CSS

## Development Dependencies

**Code Quality:**
- ESLint 9.x - Linting with Next.js config
  - `eslint-config-next` 16.1.6
  - `eslint-config-prettier` 10.1.8 - Disables conflicting rules
- Prettier 3.8.1 - Code formatting

**Type Checking:**
- `@types/react` 19.x - React type definitions
- `@types/react-dom` 19.x - React DOM types
- `@types/node` 20.x - Node.js types

## Configuration

**Environment:**
- `.env` file present (contains secrets - DATABASE_URL, Clerk keys)
- `.env.example` file for reference:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
  - `CLERK_SECRET_KEY` - Clerk secret key
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - Login route
  - `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - Sign-up route
  - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` - Post-login redirect
  - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` - Post-signup redirect
  - `DATABASE_URL` - PostgreSQL connection string

**TypeScript:**
- Config: `tsconfig.json`
  - Target: ES2017
  - Module resolution: bundler
  - Strict mode: enabled
  - Path aliases: `@/*` → `./src/*`
  - JSX: react-jsx

**Formatting:**
- Config: `.prettierrc`
  - Semi-colons: enabled
  - Single quotes: enabled
  - Tab width: 2
  - Print width: 100
  - Trailing commas: ES5 style

**Build:**
- `next.config.ts` - Next.js configuration (minimal defaults)
- `tailwind.config.ts` - Tailwind theming with CSS variables
- `components.json` - shadcn/ui component configuration

**Styling:**
- `src/app/globals.css` - Global styles and Tailwind imports
- CSS Variables for theming (colors, fonts, border radius)
- Font families: Manrope (headings via `next/font/google`), Inter (body)

## Platform Requirements

**Development:**
- Node.js 18.6.0+
- npm for package management
- PostgreSQL database (local, Neon, or Supabase)

**Production:**
- Node.js 18.6.0+ runtime
- PostgreSQL database
- Deployment target: Vercel (recommended for Next.js) or self-hosted Node.js server

---

*Stack analysis: 2026-02-13*
