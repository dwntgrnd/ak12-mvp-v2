# CC Prompts — Claude Code Handoff Specifications

Handoff prompts written by the design partner (Claude Desktop) for execution by Claude Code.

## Naming Convention

`P2-CC{sequence#}-{descriptive-slug}.md`

Examples:
- `P2-CC01-search-simplification.md`
- `P2-CC02-district-playbook-merge.md`
- `P2-CC03-product-lens-toggle.md`

Rules:
- `P2-CC` prefix identifies Phase 2 prompts
- Sequence number is zero-padded two digits, ordered by creation
- Use lowercase kebab-case for the descriptive slug
- Suffix letters (e.g., `03a`, `03b`) are acceptable for closely related sub-tasks

## Lifecycle

1. Prompt written to this directory by design partner
2. Reviewed in chat session
3. Executed by Claude Code
4. After successful execution and commit, moved to `archive/`

## Archive

`/docs/cc-prompts/archive/` contains all previously executed prompts from Phase 1, preserved for reference in git history. Archive directory was cleared at P2 kickoff — P1 prompts are recoverable from git.
