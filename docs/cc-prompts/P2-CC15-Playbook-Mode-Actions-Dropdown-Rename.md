# P2-CC15: Playbook Mode Actions — Dropdown Menu + Inline Rename

**Created:** 2026-02-25  
**Spec:** P2-Spec-02 (replaces Section 2.4 Workflow Drawer)  
**Session:** P2-S10  
**Depends on:** CC14a (committed), CC14b (committed)  
**Risk:** Low. Additive — new dropdown, inline rename. No structural changes.

---

## Objective

Convert the no-op "Manage Playbook" button in ModeBar's Playbook mode into a functional dropdown menu with Delete action (AlertDialog confirmation) and Regenerate All action. Make the playbook name in the Mode Bar's mode indicator editable inline. Clean up orphaned component files.

---

## Tasks

### 1. Replace "Manage Playbook" button with dropdown menu

**File:** `src/components/district-profile/mode-bar.tsx`

In the Playbook mode right region, replace:
```tsx
<Button variant="outline" size="sm" onClick={onManagePlaybook}>
  Manage Playbook
</Button>
```

With a `DropdownMenu` (shadcn) containing:
- **Regenerate All Sections** — calls `onRegenerateAll` prop (optional, can be undefined/no-op for now)
- Separator
- **Delete Playbook** — opens an `AlertDialog` for confirmation. On confirm, calls `onDeletePlaybook` prop.

Use `MoreHorizontal` (lucide-react) or `Settings` icon as the dropdown trigger. `Button` variant="ghost" size="icon".

**New props to add to ModeBarProps:**

```tsx
onDeletePlaybook?: () => void;
onRegenerateAll?: () => void;
```

**Remove:** `onManagePlaybook` prop (no longer needed).

### 2. Add AlertDialog for delete confirmation

Inside the ModeBar component (or co-located), add a controlled AlertDialog:
- Title: "Delete this playbook?"
- Description: "This can't be undone. The playbook and all its sections will be permanently removed."
- Cancel button
- Destructive confirm button → calls `onDeletePlaybook`

This replicates the same AlertDialog pattern that was previously in the playbook page header (removed in CC13). Same copy, same behavior.

### 3. Make playbook name editable inline

In the Playbook mode left region, replace the static text:
```tsx
<span>Playbook: {activePlaybookName}</span>
```

With an inline editable pattern: display as text, click to edit (input field), Enter or blur to save, Escape to cancel.

**New props:**
```tsx
onRenamePlaybook?: (newName: string) => void;
```

Implementation: Use a local `useState` for edit mode (`isEditing`). When not editing, render the name as a clickable span with a subtle edit affordance (pencil icon on hover, or underline-on-hover). When editing, render an `Input` (shadcn) pre-filled with current name. On blur or Enter, call `onRenamePlaybook` with the new value and exit edit mode. On Escape, revert and exit edit mode.

Keep it simple. Do not use `InlineEditableBlock` (that component is for multi-line content blocks). A plain inline text-to-input toggle is sufficient.

**Note:** In MVP, `onRenamePlaybook` can be a no-op or update local state only — there's no rename API endpoint yet. Wire the callback so it's ready for backend integration. The playbook page should pass a handler that at minimum updates the local display name.

### 4. Wire props on playbook detail page

**File:** `src/app/(dashboard)/districts/[districtId]/playbooks/[playbookId]/page.tsx`

Add the delete handler (reuse the existing `handleDelete` logic that was in the old page header — re-implement it since CC13 removed it):

```tsx
const handleDelete = useCallback(async () => {
  try {
    await fetch(`/api/playbooks/${playbookId}`, { method: 'DELETE' });
    router.push(`/districts/${districtId}`);
  } catch {
    // Stay on page if delete fails
  }
}, [playbookId, districtId, router]);
```

Update ModeBar props:
```tsx
<ModeBar
  districtId={districtId}
  districtName={district?.name ?? playbook.districtName}
  activePlaybookId={playbookId}
  activePlaybookName={playbook.productNames.join(' · ')}
  activePlaybookStatus={overallStatus}
  onDeletePlaybook={handleDelete}
/>
```

`onRegenerateAll` and `onRenamePlaybook` can be omitted or passed as no-ops for now. They're optional props.

### 5. Clean up orphaned files

**Delete:** `src/components/shared/playbook-context-card.tsx` — removed from usage in CC13, file still exists.

**Verify** no other files import `PlaybookContextCard` before deleting:
```bash
grep -r "PlaybookContextCard\|playbook-context-card" src/
```
If clean, delete.

### 6. Remove `onManagePlaybook` prop

Remove `onManagePlaybook` from `ModeBarProps` interface and from all call sites (playbook page passes it — remove that prop).

---

## Files Modified

| File | Action |
|------|--------|
| `src/components/district-profile/mode-bar.tsx` | Add dropdown menu, AlertDialog, inline rename, new props |
| `src/app/(dashboard)/districts/[districtId]/playbooks/[playbookId]/page.tsx` | Add delete handler, update ModeBar props |
| `src/components/shared/playbook-context-card.tsx` | **DELETE** (orphaned since CC13) |

## Files NOT Modified

| File | Reason |
|------|--------|
| District profile page | No changes — Preview mode already complete |
| Design tokens | No new tokens needed |
| Tab content components | No change |
| Barrel exports | PlaybookContextCard was in `shared/`, not in district-profile barrel |

---

## Verification Checklist

**Playbook mode — Dropdown menu:**
- [ ] ⋮ or settings icon button visible in Mode Bar right region
- [ ] Dropdown opens with "Regenerate All Sections" and "Delete Playbook" items
- [ ] "Delete Playbook" opens AlertDialog with confirmation
- [ ] Confirming delete navigates to district page
- [ ] Canceling delete closes dialog, stays on playbook page

**Playbook mode — Inline rename:**
- [ ] Playbook name displays as text with subtle edit affordance
- [ ] Clicking name switches to input field
- [ ] Enter/blur commits the edit (updates display)
- [ ] Escape cancels the edit (reverts to original)
- [ ] Empty name is rejected (revert to original)

**Regression checks:**
- [ ] Neutral, Lens, and Preview modes unaffected
- [ ] No TypeScript compilation errors
- [ ] No console errors
- [ ] `PlaybookContextCard` file is gone, no broken imports

---

## Service Contract Impact

None. Delete uses existing `DELETE /api/playbooks/[playbookId]` endpoint. Rename has no backend endpoint yet (local-only in MVP). No Appendix D entry required.
