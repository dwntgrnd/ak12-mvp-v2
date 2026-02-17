---
phase: quick
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/playbook/generate-playbook-sheet.tsx
  - src/components/playbook/index.ts
  - src/app/(dashboard)/discovery/page.tsx
  - src/app/(dashboard)/districts/[districtId]/page.tsx
  - src/app/(dashboard)/demo/generate/page.tsx
autonomous: true
requirements: [QUICK-01]

must_haves:
  truths:
    - "Playbook generation opens as a centered modal with dimmed background, not a side drawer"
    - "All existing generation flow (product select, district search, generate button) works identically"
    - "Modal can be dismissed via X button, Cancel button, or clicking the dimmed backdrop"
    - "All three entry points (discovery page, district profile, demo page) open the modal correctly"
  artifacts:
    - path: "src/components/playbook/generate-playbook-sheet.tsx"
      provides: "Modal-based playbook generation component (renamed internally to use Dialog)"
      contains: "Dialog"
    - path: "src/components/playbook/index.ts"
      provides: "Barrel exports with updated names"
  key_links:
    - from: "src/app/(dashboard)/discovery/page.tsx"
      to: "src/components/playbook/generate-playbook-sheet.tsx"
      via: "import GeneratePlaybookSheet"
      pattern: "GeneratePlaybook"
    - from: "src/app/(dashboard)/districts/[districtId]/page.tsx"
      to: "src/components/playbook/generate-playbook-sheet.tsx"
      via: "import GeneratePlaybookSheet"
      pattern: "GeneratePlaybook"
---

<objective>
Convert the playbook generation UI from a side-sliding Sheet (drawer) to a centered Dialog (modal) with dimmed lightbox backdrop.

Purpose: Improve UX by presenting the playbook generation flow as a focused modal rather than a side panel.
Output: Same component, same props, same flow — just displayed as a centered modal instead of a right-side drawer.
</objective>

<execution_context>
@/Users/dorenberge/.claude/get-shit-done/workflows/execute-plan.md
@/Users/dorenberge/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/components/playbook/generate-playbook-sheet.tsx
@src/components/ui/dialog.tsx
@src/components/ui/sheet.tsx
@src/components/playbook/index.ts
@src/app/(dashboard)/discovery/page.tsx
@src/app/(dashboard)/districts/[districtId]/page.tsx
@src/app/(dashboard)/demo/generate/page.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Convert GeneratePlaybookSheet from Sheet to Dialog</name>
  <files>src/components/playbook/generate-playbook-sheet.tsx</files>
  <action>
    In `generate-playbook-sheet.tsx`, swap the Sheet primitives for Dialog primitives. The component name and props interface stay the same (GeneratePlaybookSheet, GeneratePlaybookSheetProps) to minimize consumer changes — this is purely an internal display change.

    Specific changes:

    1. Replace imports: Change `Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription` from `@/components/ui/sheet` to `Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription` from `@/components/ui/dialog`.

    2. In the JSX return, replace:
       - `<Sheet open={open} onOpenChange={onOpenChange}>` with `<Dialog open={open} onOpenChange={onOpenChange}>`
       - `<SheetContent side="right" className="w-full sm:max-w-[480px] flex flex-col p-0">` with `<DialogContent className="max-w-[520px] max-h-[85vh] flex flex-col p-0 gap-0">`. Note: DialogContent already has `bg-background`, border, shadow, rounded corners, and a close X button built in. Remove `side="right"` since Dialog has no side prop.
       - `<SheetHeader ...>` with `<DialogHeader ...>` (keep same className `px-6 pt-6 pb-4 shrink-0`)
       - `<SheetTitle ...>` with `<DialogTitle ...>` (keep same className and text)
       - `<SheetDescription ...>` with `<DialogDescription ...>` (keep same className `sr-only` and text)
       - Closing tags accordingly: `</SheetContent>` to `</DialogContent>`, `</Sheet>` to `</Dialog>`

    3. The scrollable content div (`ref={contentRef}`) keeps `flex-1 overflow-y-auto px-6 pb-4` — this ensures the product list + district section scroll within the modal body if content exceeds viewport.

    4. The footer div keeps `shrink-0 border-t px-6 py-4 space-y-3` — pinned to modal bottom.

    5. Do NOT change any state logic, handlers, fetch calls, effects, or props. This is strictly a UI container swap.
  </action>
  <verify>Run `npx tsc --noEmit` — no type errors. Visually confirm the component renders Dialog primitives by searching for "Dialog" in the file and confirming no "Sheet" references remain.</verify>
  <done>generate-playbook-sheet.tsx uses Dialog/DialogContent/DialogHeader/DialogTitle/DialogDescription instead of Sheet equivalents. No Sheet imports remain. All logic, props, and internal behavior unchanged.</done>
</task>

<task type="auto">
  <name>Task 2: Verify consumer imports and TypeScript compilation</name>
  <files>
    src/components/playbook/index.ts
    src/app/(dashboard)/discovery/page.tsx
    src/app/(dashboard)/districts/[districtId]/page.tsx
    src/app/(dashboard)/demo/generate/page.tsx
  </files>
  <action>
    Since the component name (GeneratePlaybookSheet) and props interface (GeneratePlaybookSheetProps) are unchanged, no consumer file modifications should be needed. However, verify this:

    1. Confirm `src/components/playbook/index.ts` still exports `GeneratePlaybookSheet` and `GeneratePlaybookSheetProps` from `./generate-playbook-sheet` — no changes needed here since the export name is stable.

    2. Confirm all three consumer pages still import and use the component with the same props:
       - `src/app/(dashboard)/discovery/page.tsx` — imports GeneratePlaybookSheet, passes open/onOpenChange/initialDistrict/initialProductIds
       - `src/app/(dashboard)/districts/[districtId]/page.tsx` — imports GeneratePlaybookSheet, passes open/onOpenChange/initialDistrict
       - `src/app/(dashboard)/demo/generate/page.tsx` — imports GeneratePlaybookSheet, passes open/onOpenChange/initialDistrict/initialProductIds

    3. Run `npx tsc --noEmit` across the whole project to confirm zero type errors.

    4. If any consumer still references "sheet" in variable names (e.g., `sheetOpen`, `setSheetOpen`), leave them as-is — these are internal state variable names in the consumer pages and renaming them is cosmetic/optional. The task description says NO functional changes.
  </action>
  <verify>Run `npx tsc --noEmit` — exits with code 0, no errors. Run `grep -r "from.*ui/sheet" src/components/playbook/` — returns no results (Sheet import fully removed from playbook component).</verify>
  <done>Full project compiles with zero TypeScript errors. No Sheet imports remain in the playbook component directory. All three consumer pages work with the unchanged component API.</done>
</task>

</tasks>

<verification>
- `npx tsc --noEmit` passes with zero errors
- `grep -r "Sheet" src/components/playbook/generate-playbook-sheet.tsx` returns no matches
- `grep -r "Dialog" src/components/playbook/generate-playbook-sheet.tsx` returns matches for Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
- Component props interface (GeneratePlaybookSheetProps) is unchanged
- No consumer files needed modification
</verification>

<success_criteria>
The playbook generation workflow renders as a centered modal with dimmed backdrop (lightbox) instead of a right-side sliding drawer. All generation flow (product selection, district search, duplicate detection, generate button, cancel) works identically. All three entry points (discovery, district profile, demo) open the modal correctly.
</success_criteria>

<output>
After completion, create `.planning/quick/1-convert-playbook-generation-drawer-to-mo/1-SUMMARY.md`
</output>
