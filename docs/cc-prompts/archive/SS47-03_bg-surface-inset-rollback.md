# SS47-03: bg-surface-inset Rollback

**Source session:** SS-47, Decision #8
**File:** `src/app/(dashboard)/playbooks/[playbookId]/page.tsx`
**Scope:** Single find-and-replace

---

## Change

In the `TAB_CONFIG.map` render block (around line 290-300), remove the `bg-surface-inset` wrapper divs from content blocks. Replace with direct `InlineEditableBlock` rendering.

### Find:

```tsx
<div className="space-y-4">
  {contentBlocks.map((block, blockIdx) => (
    <div
      key={`${section.sectionId}-block-${blockIdx}`}
      className="bg-surface-inset rounded-md p-4"
    >
      <InlineEditableBlock
        value={block}
        onSave={(newValue) =>
          handleSaveBlock(section.sectionId, blockIdx, newValue)
        }
        aria-label={`Edit ${label} content block ${blockIdx + 1}`}
      />
    </div>
  ))}
</div>
```

### Replace with:

```tsx
<div className="space-y-4">
  {contentBlocks.map((block, blockIdx) => (
    <InlineEditableBlock
      key={`${section.sectionId}-block-${blockIdx}`}
      value={block}
      onSave={(newValue) =>
        handleSaveBlock(section.sectionId, blockIdx, newValue)
      }
      aria-label={`Edit ${label} content block ${blockIdx + 1}`}
    />
  ))}
</div>
```

## Rationale

The `bg-surface-inset` wrapper was a band-aid visual treatment that adds weight without solving the underlying content rendering gap (no markdown parser). Reverts to clean spacing per SS-47 decision #8. The proper fix is a designed content renderer component, deferred to the Figma design pass.

## Verification

- Playbook detail page renders content blocks with consistent `space-y-4` spacing
- No gray inset backgrounds on content blocks
- Inline editing still functions on each block
