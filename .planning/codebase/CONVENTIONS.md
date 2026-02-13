# Coding Conventions

**Analysis Date:** 2026-02-13

## Naming Patterns

**Files:**
- Components: lowercase with hyphens (`sidebar.tsx`, `sidebar-nav-item.tsx`)
- Pages: lowercase with hyphens following Next.js convention (`page.tsx`)
- Services/types: lowercase with hyphens (`district-service.ts`, `controlled-vocabulary.ts`)
- Utilities: lowercase with hyphens (`design-tokens.ts`, `auth-utils.ts`)
- Service interfaces: `I` prefix with `Service` suffix (`IDistrictService`, `IProductService`, `IUserService`)

**Functions & Hooks:**
- camelCase for all functions and hooks
- Example: `cn()`, `fetchUserRole()`, `getDistrict()`, `saveDistrict()`
- React component exports use PascalCase: `export function Sidebar()`, `export function SidebarNavItem()`

**Variables:**
- camelCase for all variables and constants
- Example: `userRole`, `districtId`, `isLoaded`, `pathname`, `mainNavItems`
- Component props interfaces: PascalCase suffixed with `Props` (`SidebarNavItemProps`)

**Types:**
- Interfaces: PascalCase, prefixed with `I` for service contracts (`IDistrictService`)
- Domain types: PascalCase without prefix (`DistrictSummary`, `ProductAsset`, `ExcludedDistrict`)
- Type aliases: PascalCase (`GradeRange`, `SubjectArea`, `ExclusionCategory`, `ContentSource`, `SectionStatus`, `UserRole`)
- Request/Response types: PascalCase with Request/Response suffix (`CreateProductRequest`, `PaginatedResponse<T>`)

## Code Style

**Formatting:**
- Formatter: Prettier
- Line width: 100 characters
- Tab width: 2 spaces
- Trailing comma: es5 (trailing commas where valid in ES5)
- Quotes: Single quotes (`'string'` not `"string"`)
- Semicolons: Always enabled

**Prettier Config** (`/.prettierrc`):
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100
}
```

**Linting:**
- Linter: ESLint v9 with Next.js configuration
- Config file: `eslint.config.mjs` (flat config format)
- Extends: `eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`
- Integration: ESLint configured with Prettier via `eslint-config-prettier`
- Run command: `npm run lint`

**TypeScript:**
- Strict mode: Enabled
- Module resolution: bundler (Next.js default)
- Target: ES2017
- JSX: react-jsx (React 19 auto-import)
- Path aliases: `@/*` maps to `./src/*`

## Import Organization

**Order:**
1. External packages (`react`, `next`, `@clerk/nextjs`, etc.)
2. Type imports (prefixed with `import type`)
3. Absolute imports using `@/` alias (`@/components`, `@/lib`, `@/services`)
4. Relative imports (if any)

**Example:**
```typescript
import { useUser } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/layout/sidebar';
```

**Path Aliases:**
- `@/*` → `./src/*` - Primary alias for all application code
- Used for imports: components, lib, services, middleware

**Type Imports:**
- Use `import type` for importing types, interfaces, and type-only declarations
- Example: `import type { IDistrictService } from '@/services'`
- This reduces bundle size by ensuring type-only imports are stripped at build time

## Error Handling

**Patterns:**
- Try/catch blocks for async operations, especially API calls
- Safe defaults when errors occur (don't re-throw, fallback gracefully)
- Example from `sidebar.tsx`:
  ```typescript
  try {
    const response = await fetch('/api/users/me');
    const data = await response.json();
    setUserRole(data.role);
  } catch (error) {
    // If fetch fails, keep role as null (safe default)
    setUserRole(null);
  }
  ```

- Service interfaces document expected error codes in comments
- Example from `IDistrictService`:
  ```typescript
  // Errors: INVALID_FILTER, DISTRICT_NOT_FOUND, PRODUCT_NOT_FOUND
  getDistrictFitAssessment(districtId: string, productIds: string[]): Promise<FitAssessment>;
  ```

- ServiceError type defines error contract:
  ```typescript
  export interface ServiceError {
    code: string;           // machine-readable
    message: string;        // human-readable
    field?: string;         // for validation errors
    retryable: boolean;
  }
  ```

- HTTP responses: Follow standard status codes (200, 400, 404, 500, etc.)
- No uncaught promise rejections - always handle async errors

## Logging

**Framework:** `console` (browser/runtime native)

**Patterns:**
- No explicit logging statements found in current codebase (MVP stage)
- When adding logs, use `console.log()`, `console.error()`, `console.warn()` as needed
- Avoid logging in production unless critical
- Log errors in catch blocks when needed for debugging

## Comments

**When to Comment:**
- Explain non-obvious logic or business rules
- Document authorization requirements in service interfaces
- Explain error codes and their meanings
- Add inline comments sparingly - code should be self-explanatory

**JSDoc/TSDoc:**
- Service interface methods document:
  - Authorization requirements: `// Authorization: publisher-admin, publisher-rep`
  - Expected errors: `// Errors: INVALID_FILTER, DISTRICT_NOT_FOUND`
  - Special behaviors: `// Exclusions are org-wide (shared within tenant)`
- Types document field meanings and constraints:
  ```typescript
  export interface PaginatedRequest {
    page?: number;        // 1-indexed, defaults to 1
    pageSize?: number;    // defaults to 25
  }
  ```
- Mapping documentation: Comments explain non-obvious mappings
  ```typescript
  // Fit score: integer 0–10. Frontend maps to display labels:
  // 0–3 = low, 4–6 = moderate, 7–10 = strong
  ```

## Function Design

**Size:** Functions should be focused and reasonably sized (no prescribed limit, but prefer < 50 lines for complex logic)

**Parameters:**
- Use object parameters for multiple related arguments
- Prefer destructuring in function signatures: `{ districtId, productIds }`
- Type all parameters explicitly

**Return Values:**
- Async functions return Promise<T> where T is explicitly typed
- Void functions used only when truly no return value is needed
- Example: `async function saveDistrict(districtId: string): Promise<SavedDistrict>`

**Async/Await:**
- Prefer async/await over .then() chains
- Always await promises in async contexts

## Module Design

**Exports:**
- Use named exports for functions and types: `export function Sidebar()`, `export interface IDistrictService`
- Default exports for React components (Next.js pages and layouts)
- `export type` for type-only exports to enable tree-shaking

**Barrel Files:**
- `src/services/index.ts` re-exports all service types and interfaces from subdirectories
- Enables single-import access: `import type { IDistrictService } from '@/services'`
- Organizes exports by category (interfaces, types by category)

**Example barrel pattern** (`src/services/index.ts`):
```typescript
// Service interfaces
export type { IDistrictService } from './interfaces/district-service';
export type { IProductService } from './interfaces/product-service';

// Common types
export type { PaginatedResponse, ServiceError } from './types/common';

// Domain types
export type { DistrictSummary, DistrictProfile } from './types/district';
```

## React Conventions

**Component Structure:**
- 'use client' pragma at top of client components
- Function declaration: `export default function ComponentName()`
- Props destructured in parameters with explicit type annotation
- Example:
  ```typescript
  export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    );
  }
  ```

**Styling:**
- Tailwind CSS for all styling
- `cn()` utility from `@/lib/utils` for conditional class merging (clsx + tailwind-merge)
- Design tokens in `@/lib/design-tokens` for semantic colors
- Example: `className={cn('base-class', isActive && 'active-class')}`

**Hooks:**
- `usePathname()` from Next.js for route detection
- `useUser()`, `useClerk()` from Clerk for auth context
- `useState()`, `useEffect()` from React for local state
- No custom hooks defined yet (MVP stage)

---

*Convention analysis: 2026-02-13*
