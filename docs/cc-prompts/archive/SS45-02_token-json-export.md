# SS45-02: Design Token JSON Export for Figma Variable Import

**Priority:** Execute after SS45-01  
**Dependencies:** SS43-01 complete (token definitions exist in globals.css)  
**Estimated scope:** Single script file + generated JSON output

---

## Objective

Create a Node.js script that parses `globals.css` and `design-tokens.ts` and generates a structured JSON file suitable for importing into Figma as variables. This JSON becomes the contract that aligns codebase tokens with Figma variables, enabling the bidirectional Code-to-Canvas workflow.

## Output Files

The script writes to three locations:

1. **Obsidian vault (primary Figma export):** `/Users/dorenberge/WorkInProgress/UI-Projects-Vault/Projects/AK12-MVP-v2/Design-System/Figma-Exports/ak12-design-tokens.json`
2. **Public dev directory (browser access):** `public/dev/tokens-export.json` — accessible at `http://localhost:3000/dev/tokens-export.json`
3. **Project root (script workflows):** `tokens-export.json`

All three are identical files. The Obsidian vault copy is the one used for Figma import.

## Script Location

`/scripts/export-tokens.ts` — run via `npx tsx scripts/export-tokens.ts`

Add to `package.json` scripts:
```json
"export-tokens": "tsx scripts/export-tokens.ts"
```

## JSON Structure

Use the **Design Tokens Community Group (DTCG)** format — this is the proven format that Figma's variable import plugins accept. See the working reference file at: `Obsidian: Design-System/Figma-Exports/ak12-figma-variables-v2.tokens.json`

**CRITICAL:** Do NOT use a `collections/variables` array format — that format was tried previously and rejected (see `_DEPRECATED-ak12-figma-variables-v2-wrong-format.json`). Use nested objects with `$type` and `$value` keys.

Structure:

```json
{
  "semantic": {
    "background": { "$type": "color", "$value": "#F5F7FA" },
    "foreground": { "$type": "color", "$value": "#1B3154" },
    "primary": { "$type": "color", "$value": "#236DA2" },
    "brandOrange": { "$type": "color", "$value": "#F08632" }
  },
  "surface": {
    "page": { "$type": "color", "$value": "#F5F7FA" },
    "raised": { "$type": "color", "$value": "#FFFFFF" }
  },
  "text": {
    "primary": { "$type": "color", "$value": "#1B3154" },
    "secondary": { "$type": "color", "$value": "#64748B" },
    "tertiary": { "$type": "color", "$value": "#8CA0B8" }
  },
  "spacing": {
    "topbarHeight": { "$type": "number", "$value": 56 },
    "sidebarWidth": { "$type": "number", "$value": 256 }
  },
  "typography": {
    "fontBase": { "$type": "number", "$value": 16 },
    "sizePageTitle": { "$type": "number", "$value": 24 }
  }
}
```

**Key rules:**
- Color values use `"$type": "color"` with hex `$value` (not HSL)
- Number values use `"$type": "number"` with numeric `$value` (not strings like "56px")
- Nesting creates Figma variable groups (e.g., `semantic/background`, `surface/page`)
- No `metadata`, `collections`, `modes`, or `variables` wrapper — just the flat DTCG structure
- camelCase for multi-word keys (e.g., `brandOrange`, `topbarHeight`) — Figma renders these as group/name in the Variables panel

## Variable Grouping

Organize into top-level groups that mirror the codebase token categories. Nesting in the JSON creates Figma variable groups automatically.

### Group: `semantic` (core shadcn tokens)
All tokens from the main `:root` block that map to shadcn's semantic system:
`background`, `foreground`, `card`, `cardForeground`, `popover`, `popoverForeground`, `primary`, `primaryForeground`, `secondary`, `secondaryForeground`, `muted`, `mutedForeground`, `accent`, `accentForeground`, `destructive`, `destructiveForeground`, `success`, `successForeground`, `warning`, `warningForeground`, `border`, `input`, `ring`

### Group: `brand`
Brand-specific tokens: `orange`, `districtLink`

### Group: `sidebar`
Navigation tokens: `bg`, `topbarBg`, `fg`, `hover`, `active`

### Group: `surface`
Surface tier tokens: `page`, `raised`, `inset`, `emphasis`, `emphasisNeutral`

### Group: `text`
Text color tier tokens: `primary` (= foreground), `secondary`, `tertiary`

### Group: `borderTier`
Border tier tokens: `default`, `subtle`

### Group: `emphasis`
Emphasis surface tokens: `surface`, `surfaceNeutral`

### Group: `spacing`
Layout tokens: `topbarHeight` (56), `utilityBarHeight` (40), `sidebarWidth` (256), `sidebarWidthCollapsed` (64), `contentWidth` (900), `radius` (8)

### Group: `typography`
Font size tokens (computed px at base 16): `fontBase` (16), `sizePageTitle` (24), `sizeSectionHeading` (18), `sizeSubsectionHeading` (15), `sizeBody` (14), `sizeSubsectionSm` (13), `sizeCaption` (12), `sizeOverline` (11)

### CSS Variable → Figma Name Mapping Reference

The script should include a comment-level mapping table so the relationship is traceable:

| CSS Variable | Figma Group/Name |
|---|---|
| `--background` | `semantic/background` |
| `--foreground` | `semantic/foreground` |
| `--brand-orange` | `brand/orange` |
| `--surface-page` | `surface/page` |
| `--foreground-secondary` | `text/secondary` |
| `--border-default` | `borderTier/default` |
| `--sidebar-bg` | `sidebar/bg` |
| `--topbar-height` | `spacing/topbarHeight` |
| `--font-size-page-title` | `typography/sizePageTitle` |
| (etc.) | |

## Script Implementation

The script should:

1. Read `src/app/globals.css` as text
2. Parse the `:root { }` block using regex to extract `--variable-name: value;` pairs
3. For HSL color values (`H S% L%`): compute hex equivalent
4. For rem/px values: convert to numeric pixels (1rem = 16px)
5. For `calc()` values (typography): evaluate against `--font-base: 16px` to get computed px
6. Generate the JSON structure above
7. Write to all three output locations (Obsidian vault Figma-Exports, public/dev, project root)
8. Log summary: count of color variables, spacing variables, typography variables

## HSL to Hex Conversion

Include an inline utility:
```typescript
function hslToHex(h: number, s: number, l: number): string {
  // standard HSL to hex conversion
}
```

Parse HSL strings like `"210 40% 98%"` → `{ h: 210, s: 40, l: 98 }` → `#F5F7FA`

## What NOT to Do

- Do NOT use any external dependencies beyond Node built-ins and `tsx` (already a dev dependency)
- Do NOT modify `globals.css` or `design-tokens.ts`
- Do NOT include the primitive `brandColors` or `slate` scale from `design-tokens.ts` — only semantic tokens matter for Figma variables
- Do NOT use `collections`, `modes`, `variables` array format — this was tried and failed (see `_DEPRECATED` file)
- Do NOT use `FLOAT` or `COLOR` as type strings — use DTCG `$type` values: `"color"` and `"number"`
- Do NOT include HSL values in the output — Figma expects hex for colors and numeric for numbers
- Do NOT generate dark mode values — single mode ("Light") only for now

## Verification

- [ ] `npm run export-tokens` runs without errors
- [ ] `tokens-export.json` is valid JSON
- [ ] Color count matches the number of `--` color variables in `:root`
- [ ] Hex values visually match when spot-checked (e.g., `--brand-orange: 27 87% 57%` → approximately `#F08632`)
- [ ] File is accessible at `http://localhost:3000/dev/tokens-export.json` when dev server runs
