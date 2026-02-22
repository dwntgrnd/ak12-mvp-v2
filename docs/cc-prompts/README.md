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
