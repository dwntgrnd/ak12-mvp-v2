# SS48-01: Delete Deprecated /palette-ref Route

**Source:** SS-45 Decision #4, SS-48 housekeeping
**Scope:** Delete one directory

---

## Change

Delete the entire `src/app/palette-ref/` directory (contains only `page.tsx`).

This route was superseded by `/dev/design-system` (SS45-01). The file already has a deprecation comment at line 1. No other files in the codebase reference or link to `/palette-ref`.

## Verification

- `npm run build` passes
- Navigating to `/palette-ref` returns 404
- `/dev/design-system` still renders correctly
