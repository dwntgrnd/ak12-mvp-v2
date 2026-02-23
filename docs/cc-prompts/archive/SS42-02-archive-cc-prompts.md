# SS42-02: Archive Executed CC Prompts and Establish Naming Convention

**Priority:** Low — housekeeping  
**Scope:** File moves only — no code changes  

---

## Task 1: Archive Old Prompts

Create directory `/docs/cc-prompts/archive/` and move all executed prompts into it. Keep only active/current prompts in the root.

**Move to `/docs/cc-prompts/archive/`:**
- `Phase-10-1_Shared-District-Result-Card.md`
- `Phase-10-2_Renderer-Integration.md`
- `Phase-10-3_Single-Entity-Link-Affordances.md`
- `Phase-10-4_Product-Lens-Selector.md`
- `Phase-11-0_Code-Audit.md`
- `Phase-11-1_Service-Contract-Updates.md`
- `Phase-11-2_Mock-Provider-Updates.md`
- `Phase-11-3_Card-Refactor.md`
- `Phase-11-4_Column-Sort-and-Filters.md`
- `Phase-11-5_Library-Readiness.md`
- `R1_Fix-ProductLensSelector.md`
- `R2_Create-FilterPopoverBar.md`
- `R3_Rewire-DistrictListingsContainer.md`
- `R3b_Remove-Local-Filter-From-Discovery-Configs.md`
- `R4_Fix-ColumnHeaderBar.md`
- `R4b_Align-Column-Headers-With-Card-Metrics.md`
- `R4c_Fix-Column-Alignment-Structural.md`
- `R4d_Column-Alignment-Complete-Code.md`
- `R4e_Revert-Cards-Sort-Dropdown.md`
- `R5_Fix-Stub-Snapshot-Data.md`
- `relocate-product-lens-selector.md`
- `SS41-01-data-quality-validation.md`
- `SS41-02-add-scenario-districts.md`
- `SS41-03a-decouple-trends-tab.md`
- `SS41-03b-twin-rivers-intelligence.md`

**Keep in `/docs/cc-prompts/` (active):**
- `SS42-01-playbook-seed-uuid-alignment.md` (this session)
- This file (`SS42-02-archive-cc-prompts.md`)

## Task 2: Add README with Naming Convention

Create `/docs/cc-prompts/README.md` with this content:

```markdown
# CC Prompts — Claude Code Handoff Specifications

Handoff prompts written by the design partner (Claude Desktop) for execution by Claude Code.

## Naming Convention

`SS{session#}-{sequence#}-{descriptive-slug}.md`

Examples:
- `SS42-01-playbook-seed-uuid-alignment.md`
- `SS42-02-archive-cc-prompts.md`
- `SS43-01-design-token-audit.md`

Rules:
- Session number matches the session handoff document (SS-41, SS-42, etc.)
- Sequence number is zero-padded two digits, ordered by execution priority
- Use lowercase kebab-case for the descriptive slug
- Suffix letters (e.g., `03a`, `03b`) are acceptable for closely related sub-tasks

## Lifecycle

1. Prompt written to this directory by design partner
2. Reviewed in chat session
3. Executed by Claude Code
4. After successful execution and commit, moved to `archive/`

## Archive

`/docs/cc-prompts/archive/` contains all previously executed prompts, preserved for reference.
```

## Verification

- `/docs/cc-prompts/` should contain only the README and any active (unexecuted) prompts
- `/docs/cc-prompts/archive/` should contain all 25 previously executed prompts
- No prompts should be deleted — only moved
