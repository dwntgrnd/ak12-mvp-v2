# Testing Patterns

**Analysis Date:** 2026-02-13

## Test Framework

**Runner:**
- Not detected - No test runner configured (Jest, Vitest, etc.)
- Project is in MVP v0.1 stage without automated tests

**Assertion Library:**
- Not detected

**Coverage:**
- Not detected - No coverage reporting configured

## Current Testing Status

**Test Files:**
- No `.test.ts`, `.test.tsx`, `.spec.ts`, or `.spec.tsx` files found in `src/` directory
- Testing infrastructure not yet established

**Why Tests Are Not Present:**
- MVP v0.1 phase prioritizes feature delivery over comprehensive test coverage
- System is actively evolving with major UI changes, service restructuring, and API migrations
- Test framework selection and establishment deferred to stability phase

## Test Setup When Adding Tests

When testing infrastructure is added, follow these guidelines:

### Recommended Framework Choice

**For this codebase, recommend:**
- **Vitest** for unit/integration tests (React 19 + TypeScript compatible, fast)
- Alternative: **Jest** with ts-jest configuration (established, widely supported)

### Test File Organization

**Location Pattern:**
- Co-located with source: `src/components/__tests__/sidebar.test.tsx` or `src/components/sidebar.test.tsx`
- OR separate directory: `tests/unit/`, `tests/integration/`
- Recommendation: Co-located for easier maintenance and refactoring

**Naming Convention:**
- `[FileName].test.ts[x]` for unit tests
- `[FileName].integration.test.ts[x]` for integration tests
- `[FileName].e2e.test.ts[x]` for end-to-end tests

**Test File Structure:**
```
describe('ComponentName | FunctionName', () => {
  describe('specific behavior', () => {
    it('should do something when condition', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Testing Layers

**Unit Tests Should Cover:**
- Utility functions: `@/lib/utils.ts` (e.g., `cn()` function)
- Type validation and transformations
- Service layer contracts and responses
- Component rendering and prop handling
- Client-side state management

**Files to Prioritize for Testing:**
- `src/services/interfaces/*` - Service contracts (mock implementations)
- `src/lib/utils.ts` - Utility functions like `cn()`
- `src/lib/design-tokens.ts` - Design token exports
- `src/services/types/*` - Type definitions and type guards

**Integration Tests Should Cover:**
- API route handlers (when implemented in `src/app/api/`)
- Service layer interactions with database
- Authentication flows (Clerk integration)
- Component interactions and state flow

**E2E Tests Should Cover:**
- Critical user journeys (discovery → save → playbook generation)
- Authentication flows (login, sign-up)
- Admin workflows

## Data Types for Testing

### Key Types to Mock

**Service Context:**
```typescript
// From IDistrictService, IProductService, etc.
export interface ServiceContext {
  userId: string;
  tenantId: string;
  userRole: UserRole;
  organizationName: string;
}
```

**Paginated Response (Template):**
```typescript
// Mock pattern for list operations
const mockResponse: PaginatedResponse<T> = {
  items: [/* test data */],
  totalCount: 100,
  page: 1,
  pageSize: 25,
  totalPages: 4,
};
```

**District Summary (Fixture):**
```typescript
// Minimal valid DistrictSummary for testing
const mockDistrict: DistrictSummary = {
  districtId: 'test-district-1',
  name: 'Test District',
  state: 'CA',
  location: 'Test City',
  enrollment: 5000,
};
```

**Product Summary (Fixture):**
```typescript
const mockProduct: ProductSummary = {
  productId: 'test-product-1',
  name: 'Test Product',
  description: 'Test description',
  gradeRange: { gradeFrom: 1, gradeTo: 12 },
  subjectArea: 'Math',
  assetCount: 2,
};
```

### Test Data Patterns

**Grade Range:**
```typescript
// Valid ranges: gradeFrom <= gradeTo, both 0-13
const validGradeRange = { gradeFrom: 0, gradeTo: 13 }; // Pre-K through Grade 12
const invalidGradeRange = { gradeFrom: 13, gradeTo: 0 }; // Should fail validation
```

**Exclusion Categories (Known Valid Values):**
```typescript
const validCategories = [
  'already_customer',
  'not_a_fit',
  'budget_timing',
  'other'
];
```

**User Roles (Enum-like):**
```typescript
type UserRole = 'super-admin' | 'publisher-admin' | 'publisher-rep';
```

**Content Source (Type Union):**
```typescript
type ContentSource = 'verbatim' | 'constrained' | 'synthesis' | 'hybrid';
```

**Section Status (Type Union):**
```typescript
type SectionStatus = 'pending' | 'generating' | 'complete' | 'error';
```

## Mocking Patterns

### When Implemented, Recommended Approach

**External Dependencies to Mock:**
- Clerk (`@clerk/nextjs`) - useUser, UserButton
- Prisma client operations
- Fetch API calls for service endpoints
- Next.js utilities (usePathname, useRouter)

**What NOT to Mock:**
- Utility functions like `cn()` - test real implementation
- Type definitions and interfaces - test implementations
- Tailwind CSS class names - test actual rendering
- Design tokens - use actual values
- Small, focused components that don't depend on external data

### Service Mock Pattern (Future)

When adding tests, create mock implementations:

```typescript
// Example: MockDistrictService implementing IDistrictService
export class MockDistrictService implements IDistrictService {
  async searchDistricts(
    request: DistrictSearchRequest
  ): Promise<PaginatedResponse<DistrictSummary>> {
    return {
      items: [mockDistrict],
      totalCount: 1,
      page: 1,
      pageSize: 25,
      totalPages: 1,
    };
  }
  // ... other methods
}
```

### Component Mock Pattern (Future)

For testing components that use fetch:

```typescript
// Mock fetch for testing
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ role: 'publisher-admin' }),
  })
);

// Or with Vitest:
vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({...})));
```

## Test Coverage Goals (When Implemented)

**Critical Areas (High Priority):**
- Service layer interfaces and contracts
- Type validation and transformations
- Authorization/role checking in service methods
- Error handling paths (ServiceError codes)
- API route handlers (when built)

**Important Areas (Medium Priority):**
- Component rendering with different props
- React hooks (useState, useEffect behavior)
- Conditional rendering (admin nav, role-based UI)
- User interactions (clicks, form submissions)

**Nice-to-Have (Lower Priority):**
- CSS class application (harder to test, lower value)
- Next.js navigation (test in E2E)
- Clerk auth flows (primarily E2E)

## Async Testing Pattern

When tests are added, handle async operations:

```typescript
// For async functions that return Promises
it('should fetch user role', async () => {
  const result = await serviceInstance.getUser('user-1');
  expect(result).toBeDefined();
});

// For React components with useEffect
it('should load role on mount', async () => {
  render(<Sidebar />);
  await waitFor(() => {
    expect(userRole).not.toBeNull();
  });
});
```

## Error Testing Pattern

Test error conditions using expected error codes:

```typescript
it('should throw DISTRICT_NOT_FOUND', async () => {
  expect(() => serviceInstance.getDistrict('invalid-id')).rejects.toThrow({
    code: 'DISTRICT_NOT_FOUND',
  });
});
```

## Configuration Files (When Added)

**Vitest Config Example:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});
```

**Jest Config Example:**
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts[x]', '**/*.test.ts[x]'],
};
```

## Run Commands (When Framework Installed)

```bash
npm test              # Run all tests
npm test -- --watch  # Watch mode
npm test -- --coverage  # Generate coverage report
npm run lint          # Lint code (already configured)
```

## Current Development Approach

**MVP v0.1 Testing Strategy:**
- Manual testing during development
- Browser testing of UI features
- API endpoint validation through browser/curl
- Focus: Feature correctness over test automation
- Next phase (after v0.1 stabilization): Introduce automated testing framework

**How to Test Features Now:**
- Start dev server: `npm run dev`
- Navigate to `http://localhost:3000`
- Login with Clerk credentials
- Test workflows manually
- Check browser console for errors
- Verify API responses in Network tab

---

*Testing analysis: 2026-02-13*
