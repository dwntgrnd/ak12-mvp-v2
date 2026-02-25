# P2-CC11: Token Editor — Auto-Detect Registry (Portable Mode)

**Session:** P2-S08
**Depends on:** CC09 (token editor), CC10 (modular scale — optional, can run independently)
**Risk:** Low — replaces one internal file (`token-registry.ts`) with a runtime parser. No external API changes.
**Touches:** `src/components/dev/token-editor/` only

---

## Objective

Replace the static `token-registry.ts` with a runtime auto-detection system that inventories all CSS custom properties on `:root`, infers their types, groups them intelligently, and generates editor controls dynamically. The result: the token editor works on **any project** that uses CSS custom properties without maintaining a manual registry.

The static registry remains as an optional override layer — if present, it provides human-friendly labels and explicit grouping. If absent, the auto-detector provides everything.

---

## 1. Architecture

### New files:

```
src/components/dev/token-editor/
  auto-detect.ts          ← Runtime CSS property parser and type inference
  token-registry.ts       ← MODIFIED: becomes optional override layer
  use-token-editor.ts     ← MODIFIED: uses auto-detect, merges with overrides
```

### Detection flow (runs once on mount):

```
1. Read ALL computed CSS custom properties from :root
2. Filter to meaningful tokens (exclude Tailwind internals, browser defaults)
3. Infer type for each property (hsl-color, hex-color, length, shadow, other)
4. Infer grouping from naming conventions
5. Merge with static overrides (labels, grouping corrections) if present
6. Return sorted, grouped TokenDefinition[]
```

---

## 2. Auto-Detection Logic

### 2a. Reading all custom properties:

```typescript
function getAllCustomProperties(): Map<string, string> {
  const props = new Map<string, string>();
  const computed = getComputedStyle(document.documentElement);

  // Method 1: Parse stylesheet rules for declared custom properties
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
          for (let i = 0; i < rule.style.length; i++) {
            const name = rule.style[i];
            if (name.startsWith('--')) {
              const value = computed.getPropertyValue(name).trim();
              if (value) props.set(name, value);
            }
          }
        }
      }
    } catch {
      // CORS-restricted stylesheets — skip silently
    }
  }

  return props;
}
```

### 2b. Filtering:

Exclude properties matching these patterns:
- Tailwind internal variables: `--tw-*`
- Browser/framework internals: `--next-*`, `--webkit-*`, `--moz-*`
- Computed/derived variables that reference other variables via `var()` in their resolved value (these are downstream consumers, not source tokens)
- Properties with empty or `initial` values

Keep properties matching:
- Any `--` prefixed property with a resolved value
- Properties declared in the project's own stylesheets (`:root` block in `globals.css`)

### 2c. Type inference:

```typescript
type InferredType = 'hsl-color' | 'hex-color' | 'length' | 'font-size' | 'shadow' | 'other';

function inferType(name: string, value: string): InferredType {
  // HSL pattern: "210 40% 98%" or "210, 40%, 98%"
  if (/^\d{1,3}[\s,]+\d{1,3}%[\s,]+\d{1,3}%$/.test(value)) return 'hsl-color';

  // Hex color: "#fff", "#ffffff"
  if (/^#[0-9a-fA-F]{3,8}$/.test(value)) return 'hex-color';

  // Length: "16px", "0.5rem", "1.5em", "90rem"
  if (/^-?[\d.]+\s*(px|rem|em|vh|vw|%)$/.test(value)) {
    // Font-size heuristic: name contains "font" or "size" or "text"
    if (/font|size|text|type/i.test(name)) return 'font-size';
    return 'length';
  }

  // Shadow: contains "rgb" or "rgba" with offset values
  if (/\d+px.*rgb/.test(value) || /rgb.*\d+px/.test(value)) return 'shadow';

  // Calc expressions that resolve to lengths
  if (/^calc\(/.test(value)) return 'length';

  return 'other';
}
```

### 2d. Group inference:

Infer groups from naming conventions in the CSS variable name:

```typescript
function inferGroup(name: string, type: InferredType): string {
  const n = name.toLowerCase();

  // Explicit name-based grouping
  if (/brand/.test(n)) return 'Brand Colors';
  if (/sidebar|topbar|nav/.test(n)) return 'Navigation';
  if (/surface|background|card|popover/.test(n) && type.includes('color')) return 'Surfaces';
  if (/border|ring|input/.test(n) && type.includes('color')) return 'Borders';
  if (/foreground|muted-foreground/.test(n)) return 'Text Colors';
  if (/font|size|text|type/.test(n)) return 'Typography';
  if (/shadow/.test(n)) return 'Shadows';
  if (/radius|width|height|gap|spacing|padding|margin|max-width/.test(n)) return 'Spacing & Layout';

  // Fallback by type
  if (type.includes('color')) return 'Colors';
  if (type === 'length' || type === 'font-size') return 'Dimensions';
  if (type === 'shadow') return 'Shadows';

  return 'Other';
}
```

### 2e. Label generation:

Convert CSS variable names to human-readable labels:

```typescript
function generateLabel(cssVar: string): string {
  // Remove -- prefix, split on - and /, capitalize
  return cssVar
    .replace(/^--/, '')
    .split(/[-/]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// "--brand-orange" → "Brand Orange"
// "--surface-emphasis-neutral" → "Surface Emphasis Neutral"
// "--font-size-page-title" → "Font Size Page Title"
```

---

## 3. Override Layer

The existing static `token-registry.ts` becomes an optional override map:

```typescript
// token-registry.ts — MODIFIED

export interface TokenOverride {
  /** Override the auto-detected label */
  label?: string;
  /** Override the auto-detected group */
  group?: string;
  /** Override the auto-detected type */
  type?: TokenType;
  /** Hint text shown in the editor (tooltip or secondary label) */
  hint?: string;
  /** Component usage hints for discoverability */
  usedBy?: string[];
  /** If true, hide this token from the editor */
  hidden?: boolean;
  /** If true, this token is managed by the modular scale control */
  managedByScale?: boolean;
}

export const TOKEN_OVERRIDES: Record<string, TokenOverride> = {
  '--brand-orange': {
    label: 'Brand Orange',
    group: 'Brand Colors',
    usedBy: ['Lens bar accent', 'Active states', 'Inline edit focus'],
  },
  '--primary': {
    label: 'Primary',
    group: 'Semantic Colors',
    usedBy: ['Primary buttons', 'Links', 'Focus rings'],
  },
  '--sidebar-bg': {
    label: 'Sidebar Background',
    hint: 'Main navigation background',
    usedBy: ['Sidebar', 'Mobile nav'],
  },
  '--font-size-body': {
    managedByScale: true,
  },
  '--font-size-caption': {
    managedByScale: true,
  },
  // ... etc. Migrate existing registry entries to this format.
  // Properties NOT listed here still appear — they just use auto-detected values.

  // Hide Tailwind/framework internals that slip through detection
  '--tw-ring-offset-width': { hidden: true },
};
```

### Merge logic:

```typescript
function buildRegistry(): TokenDefinition[] {
  const detected = autoDetectTokens();         // Map<cssVar, { type, group, label, value }>
  const overrides = TOKEN_OVERRIDES;

  const result: TokenDefinition[] = [];

  for (const [cssVar, auto] of detected) {
    const override = overrides[cssVar];

    if (override?.hidden) continue;

    result.push({
      cssVar,
      label: override?.label ?? auto.label,
      group: override?.group ?? auto.group,
      type: override?.type ?? auto.type,
      defaultValue: auto.value,
      hint: override?.hint,
      usedBy: override?.usedBy,
      managedByScale: override?.managedByScale ?? false,
    });
  }

  // Sort: groups alphabetically, tokens within group alphabetically
  return result.sort((a, b) =>
    a.group === b.group
      ? a.label.localeCompare(b.label)
      : a.group.localeCompare(b.group)
  );
}
```

---

## 4. Updated TokenDefinition Type

```typescript
export interface TokenDefinition {
  cssVar: string;
  label: string;
  group: string;
  type: TokenType;
  defaultValue: string;
  /** Optional tooltip hint */
  hint?: string;
  /** Component areas that use this token */
  usedBy?: string[];
  /** Managed by modular scale — suppress individual control */
  managedByScale?: boolean;
  /** Whether this was auto-detected (true) or manually defined (false) */
  autoDetected?: boolean;
}
```

---

## 5. usedBy Tooltips

When a token has `usedBy` defined (from the override layer), show a small info icon next to the label. On hover, display a tooltip listing the usage areas.

### Implementation:
- Use the editor's own scoped styles (`.te-*` classes), NOT shadcn Tooltip
- Simple CSS hover tooltip — a positioned `<span>` that appears on hover:

```tsx
{token.usedBy && token.usedBy.length > 0 && (
  <span className="te-usage-hint" title={`Used by: ${token.usedBy.join(', ')}`}>
    ℹ
  </span>
)}
```

Or, for richer display, a hover-triggered absolutely positioned box:

```css
.te-usage-hint {
  cursor: help;
  color: #6c7086;
  font-size: 11px;
  position: relative;
}

.te-usage-hint:hover::after {
  content: attr(data-usage);
  position: absolute;
  bottom: 100%;
  left: 0;
  background: #313244;
  color: #cdd6f4;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  white-space: nowrap;
  z-index: 10;
  pointer-events: none;
}
```

Place the tooltip ABOVE the control label so it doesn't interfere with sliders or color pickers below.

---

## 6. Rendering Tokens Managed by Scale

Tokens with `managedByScale: true` should NOT render individual controls in the standard token group. Instead, they are controlled exclusively by the modular scale UI (CC10). In their group section, show them as read-only values:

```
Typography
├── Modular Scale controls (CC10)
│   Base: [slider] 16px
│   Ratio: [dropdown] 1.25
│   Preview: [specimen]
├── Font Size Body — 16px (managed by scale) [read-only display]
├── Font Size Caption — 12.8px (managed by scale) [read-only display]
└── Font Family Manrope — [regular control, not managed]
```

This prevents the user from fighting the scale by manually overriding individual sizes while also adjusting the ratio.

---

## 7. Portability Summary

After CC11, the token editor requires **zero project-specific configuration** to function:

| File | Required? | Purpose |
|---|---|---|
| `auto-detect.ts` | Yes | Runtime token discovery — works anywhere |
| `token-registry.ts` | Optional | Override labels, add usage hints, hide tokens |
| All other editor files | Yes | Dock, controls, diff output — fully generic |

To use in a new project:
1. Copy `src/components/dev/token-editor/` directory
2. Copy `src/app/dev/token-editor-detached/` route
3. Add one line to root layout
4. Optionally create `token-registry.ts` overrides for better labels and usage hints

---

## 8. Verification

- [ ] Auto-detection finds all `:root` custom properties from globals.css
- [ ] HSL colors correctly identified (3-part pattern without `hsl()` wrapper)
- [ ] Lengths correctly identified and distinguished from font-sizes
- [ ] Shadows correctly identified
- [ ] Tailwind internals (`--tw-*`) filtered out
- [ ] Groups inferred logically from naming conventions
- [ ] Labels generated are human-readable
- [ ] Override layer merges cleanly (override wins where specified)
- [ ] `hidden: true` tokens don't appear in editor
- [ ] `managedByScale: true` tokens appear read-only, not as editable controls
- [ ] `usedBy` tooltips display on hover without obstructing controls
- [ ] Tooltip position: above the label, not below
- [ ] Detached window uses the same auto-detected registry
- [ ] Full editor works with token-registry.ts deleted (overrides are optional)
- [ ] No type errors: `npx tsc --noEmit`
- [ ] Existing editor behavior unchanged for manually-registered tokens
