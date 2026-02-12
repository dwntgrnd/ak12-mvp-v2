# Phase 5 Plan 1: Product Service & API Summary

**One-liner:** Product service layer and API routes for CRUD operations with multi-tenant isolation, admin-only writes, and asset management

---

## Plan Metadata

- **Phase:** 05-solutions-library
- **Plan:** 01
- **Subsystem:** Product Management Backend
- **Tags:** #service-layer #api-routes #multi-tenant #admin-auth #asset-management
- **Completed:** 2026-02-12
- **Duration:** 1min 59s

---

## Dependency Graph

**Requires:**
- `prisma/schema.prisma` - Product and ProductAsset models
- `src/services/types/product.ts` - Product domain types
- `src/services/types/controlled-vocabulary.ts` - GRADE_RANGES and SUBJECT_AREAS
- `src/lib/auth-utils.ts` - getCurrentUser() for authentication
- `src/lib/prisma.ts` - Prisma client

**Provides:**
- `src/services/product-service.ts` - 6 product service functions
- `src/app/api/products/route.ts` - GET/POST endpoints
- `src/app/api/products/[productId]/route.ts` - GET/PATCH/DELETE endpoints
- `src/app/api/products/[productId]/assets/route.ts` - POST asset endpoint

**Affects:**
- Phase 5 Plans 2-3 - Product UI will consume these APIs
- Future phases - Product data available for playbook generation

---

## What Was Built

### Service Layer

**File:** `src/services/product-service.ts`

Implemented 6 product service functions following the district-service.ts pattern:

1. **getProducts(tenantId, filters?)** - Query products with optional filters (gradeRange, subjectArea, searchQuery). Returns ProductSummary[] with truncated descriptions and asset counts. Ordered by name ascending.

2. **getProduct(tenantId, productId)** - Fetch full product detail with assets. Verifies tenant ownership. Throws PRODUCT_NOT_FOUND if not found or soft-deleted.

3. **createProduct(tenantId, data)** - Create new product. Validates gradeRange and subjectArea against controlled vocabulary. Throws VALIDATION_ERROR if invalid.

4. **updateProduct(tenantId, productId, data)** - Update existing product. Only updates provided fields. Validates controlled vocabulary. Throws PRODUCT_NOT_FOUND or VALIDATION_ERROR.

5. **deleteProduct(tenantId, productId)** - Soft delete by setting isDeleted=true. Throws PRODUCT_NOT_FOUND if not found.

6. **uploadProductAsset(tenantId, productId, assetData)** - Store asset metadata. For MVP, url is stored directly (no cloud upload yet). Throws PRODUCT_NOT_FOUND if product doesn't exist.

**Key patterns:**
- All functions accept tenantId as first parameter for multi-tenant isolation
- All queries filter by tenantId
- Soft delete pattern using isDeleted flag
- Custom error codes (PRODUCT_NOT_FOUND, VALIDATION_ERROR) for API boundary mapping
- Prisma result mapping (id->productId, id->assetId) to domain types
- Date conversion to ISO 8601 strings

### API Routes

**File 1:** `src/app/api/products/route.ts`

- **GET** - List products with optional filters (gradeRange, subjectArea, q). Requires authentication. Returns { products: ProductSummary[] }
- **POST** - Create product (admin only). Validates role, returns 403 if not admin. Returns 201 with created Product.

**File 2:** `src/app/api/products/[productId]/route.ts`

- **GET** - Fetch product detail. Requires authentication. Returns Product with assets.
- **PATCH** - Update product (admin only). Validates role, returns 403 if not admin. Returns updated Product.
- **DELETE** - Soft delete product (admin only). Validates role, returns 204 no content.

**File 3:** `src/app/api/products/[productId]/assets/route.ts`

- **POST** - Upload asset metadata (admin only). Validates role, returns 403 if not admin. Returns 201 with ProductAsset.

**Key patterns:**
- All routes call getCurrentUser() for authentication at API boundary
- Write operations check role: `user.role !== 'publisher-admin' && user.role !== 'super-admin'`
- Next.js 15 async params pattern: `{ params }: { params: Promise<{ productId: string }> }` and `await params`
- Error code mapping: UNAUTHENTICATED/USER_NOT_FOUND->401, PRODUCT_NOT_FOUND->404, VALIDATION_ERROR->400, default->500
- Consistent error response structure: `{ error: string }`

---

## Key Files

**Created:**
- `src/services/product-service.ts` (326 lines) - Product service with 6 CRUD functions
- `src/app/api/products/route.ts` (98 lines) - Product list and create endpoints
- `src/app/api/products/[productId]/route.ts` (151 lines) - Product detail, update, delete endpoints
- `src/app/api/products/[productId]/assets/route.ts` (63 lines) - Product asset upload endpoint

**Modified:**
None

---

## Decisions Made

1. **TenantId-first parameter pattern** - All service functions accept tenantId as first parameter, following the pattern established in district-service.ts. This ensures multi-tenant isolation at the service layer.

2. **Soft delete with isDeleted flag** - deleteProduct() sets isDeleted=true rather than hard deleting. All queries filter by isDeleted=false. This preserves data integrity and allows future restoration/auditing.

3. **Controlled vocabulary validation** - createProduct() and updateProduct() validate gradeRange and subjectArea against GRADE_RANGES and SUBJECT_AREAS const arrays. Throws VALIDATION_ERROR if invalid.

4. **Asset metadata storage** - uploadProductAsset() stores asset metadata (fileName, fileType, fileSize, url) directly in ProductAsset table. For MVP, url is provided by caller. Actual cloud storage upload will be added in a future phase.

5. **Admin-only write operations** - POST, PATCH, DELETE endpoints check `user.role !== 'publisher-admin' && user.role !== 'super-admin'` and return 403 if not admin. Read endpoints (GET) are available to all authenticated users.

6. **Description truncation in summaries** - getProducts() truncates description to 150 characters for list display. Full description is available in getProduct().

7. **Asset count in summaries** - ProductSummary includes assetCount from Prisma _count aggregation. Provides quick visibility of asset availability without fetching full asset records.

---

## Tasks Completed

| Task | Name                           | Commit  | Files                                                                                              |
| ---- | ------------------------------ | ------- | -------------------------------------------------------------------------------------------------- |
| 1    | Create product service functions | f45ac2c | src/services/product-service.ts                                                                  |
| 2    | Create product API routes      | 275a119 | src/app/api/products/route.ts, src/app/api/products/[productId]/route.ts, src/app/api/products/[productId]/assets/route.ts |

---

## Verification

- [x] `npx tsc --noEmit` passes with zero errors
- [x] Product service exports 6 functions: getProducts, getProduct, createProduct, updateProduct, deleteProduct, uploadProductAsset
- [x] API routes exist at 3 paths with correct HTTP method exports
- [x] All API routes call getCurrentUser() for authentication
- [x] Write endpoints (POST, PATCH, DELETE) check admin role
- [x] All queries filter by tenantId for multi-tenant isolation

---

## Deviations from Plan

None - plan executed exactly as written.

---

## Tech Stack

**Added:**
- Product service layer with Prisma queries

**Patterns:**
- Multi-tenant isolation via tenantId filtering
- Soft delete pattern with isDeleted flag
- Custom error codes for API boundary mapping
- Admin role authorization on write operations
- Next.js 15 async params pattern

---

## Self-Check: PASSED

**Created files verified:**
- [x] src/services/product-service.ts exists
- [x] src/app/api/products/route.ts exists
- [x] src/app/api/products/[productId]/route.ts exists
- [x] src/app/api/products/[productId]/assets/route.ts exists

**Commits verified:**
- [x] f45ac2c exists (Task 1)
- [x] 275a119 exists (Task 2)
