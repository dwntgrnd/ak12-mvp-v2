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

The JSON should follow a format compatible with Figma's Variables REST API and common Figma variable import plugins (e.g., "Variables Import/Export" community plugin). Structure:

```json
{
  "metadata": {
    "source": "AK12-MVP-v2",
    "generated": "2026-02-23T...",
    "sourceFiles": ["src/app/globals.css", "src/lib/design-tokens.ts"]
  },
  "collections": [
    {
      "name": "AK12 Semantic Tokens",
      "modes": ["Light"],
      "variables": [
        {
          "name": "color/background",
          "type": "COLOR",
          "description": "Page background",
          "values": {
            "Light": { "hex": "#F5F7FA", "hsl": "210 40% 98%" }
          }
        },
        {
          "name": "color/foreground",
          "type": "COLOR",
          "description": "Primary text",
          "values": {
            "Light": { "hex": "#1B3154", "hsl": "213 47% 17%" }
          }
        }
      ]
    }
  ]
}
```

## Variable Naming Convention

Use `/`-separated hierarchical names that map cleanly to both CSS custom properties and Figma's variable panel:

### Color Variables
Map CSS `--token-name` → Figma `color/token-name`:

| CSS Variable | Figma Variable Name | Type |
|---|---|---|
| `--background` | `color/background` | COLOR |
| `--foreground` | `color/foreground` | COLOR |
| `--card` | `color/card` | COLOR |
| `--card-foreground` | `color/card-foreground` | COLOR |
| `--primary` | `color/primary` | COLOR |
| `--primary-foreground` | `color/primary-foreground` | COLOR |
| `--secondary` | `color/secondary` | COLOR |
| `--secondary-foreground` | `color/secondary-foreground` | COLOR |
| `--muted` | `color/muted` | COLOR |
| `--muted-foreground` | `color/muted-foreground` | COLOR |
| `--accent` | `color/accent` | COLOR |
| `--accent-foreground` | `color/accent-foreground` | COLOR |
| `--destructive` | `color/destructive` | COLOR |
| `--destructive-foreground` | `color/destructive-foreground` | COLOR |
| `--success` | `color/success` | COLOR |
| `--success-foreground` | `color/success-foreground` | COLOR |
| `--warning` | `color/warning` | COLOR |
| `--warning-foreground` | `color/warning-foreground` | COLOR |
| `--border` | `color/border` | COLOR |
| `--input` | `color/input` | COLOR |
| `--ring` | `color/ring` | COLOR |
| `--brand-orange` | `color/brand-orange` | COLOR |
| `--district-link` | `color/district-link` | COLOR |
| `--sidebar-bg` | `color/sidebar-bg` | COLOR |
| `--topbar-bg` | `color/topbar-bg` | COLOR |
| `--sidebar-fg` | `color/sidebar-fg` | COLOR |
| `--sidebar-hover` | `color/sidebar-hover` | COLOR |
| `--sidebar-active` | `color/sidebar-active` | COLOR |
| `--emphasis-surface` | `color/emphasis-surface` | COLOR |
| `--emphasis-surface-neutral` | `color/emphasis-surface-neutral` | COLOR |
| `--foreground-secondary` | `color/foreground-secondary` | COLOR |
| `--foreground-tertiary` | `color/foreground-tertiary` | COLOR |
| `--surface-page` | `color/surface-page` | COLOR |
| `--surface-raised` | `color/surface-raised` | COLOR |
| `--surface-inset` | `color/surface-inset` | COLOR |
| `--surface-emphasis` | `color/surface-emphasis` | COLOR |
| `--surface-emphasis-neutral` | `color/surface-emphasis-neutral` | COLOR |
| `--border-default` | `color/border-default` | COLOR |
| `--border-subtle` | `color/border-subtle` | COLOR |

### Spacing Variables
| CSS Variable | Figma Variable Name | Type |
|---|---|---|
| `--topbar-height` | `spacing/topbar-height` | FLOAT (px) |
| `--utility-bar-height` | `spacing/utility-bar-height` | FLOAT (px) |
| `--sidebar-width` | `spacing/sidebar-width` | FLOAT (px) |
| `--sidebar-width-collapsed` | `spacing/sidebar-width-collapsed` | FLOAT (px) |
| `--content-width` | `spacing/content-width` | FLOAT (px) |
| `--radius` | `spacing/radius` | FLOAT (px) |

### Typography Variables
| CSS Variable | Figma Variable Name | Type |
|---|---|---|
| `--font-base` | `typography/font-base` | FLOAT (px) |
| `--font-size-page-title` | `typography/size-page-title` | FLOAT (px) |
| `--font-size-section-heading` | `typography/size-section-heading` | FLOAT (px) |
| `--font-size-subsection-heading` | `typography/size-subsection-heading` | FLOAT (px) |
| `--font-size-body` | `typography/size-body` | FLOAT (px) |
| `--font-size-subsection-sm` | `typography/size-subsection-sm` | FLOAT (px) |
| `--font-size-caption` | `typography/size-caption` | FLOAT (px) |
| `--font-size-overline` | `typography/size-overline` | FLOAT (px) |

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
- Do NOT generate dark mode values — single mode ("Light") only for now

## Verification

- [ ] `npm run export-tokens` runs without errors
- [ ] `tokens-export.json` is valid JSON
- [ ] Color count matches the number of `--` color variables in `:root`
- [ ] Hex values visually match when spot-checked (e.g., `--brand-orange: 27 87% 57%` → approximately `#F08632`)
- [ ] File is accessible at `http://localhost:3000/dev/tokens-export.json` when dev server runs
