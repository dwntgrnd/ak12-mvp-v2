# P2-CC09: Live Token Editor — Dockable Dev Tool with Detach Mode

**Session:** P2-S08
**Depends on:** globals.css (CSS custom properties), design-tokens.ts (reference only)
**Risk:** Low — dev-only component, tree-shakes out of production. No impact on app components or routing.
**Can run in parallel with:** CC07, CC08 — no file overlap except a one-line addition to root layout.

---

## Objective

Build a dev-only token editor that overlays the running application. The editor manipulates CSS custom properties on `:root` in real time, so every component on the current page updates instantly as tokens change. Four dock modes: left, right, bottom, and detached (pop-out to separate window for multi-monitor workflows). A "Copy Changes" button outputs a structured diff for pasting into Claude Code.

**This is a dev tool, not a production feature.** It renders only when `process.env.NODE_ENV === 'development'`. It must not appear in production builds.

---

## 1. Component Architecture

```
src/components/dev/
  token-editor/
    TokenEditorDrawer.tsx     ← Main drawer shell, dock management
    TokenEditorTrigger.tsx    ← Floating toggle button (always visible in dev)
    TokenEditorControls.tsx   ← Grouped token controls (color pickers, sliders, inputs)
    TokenEditorDiffOutput.tsx ← Copy Changes modal/panel
    token-registry.ts         ← Token definitions: name, CSS var, type, default value, group
    use-token-editor.ts       ← Hook: read/write CSS vars, track changes, reset
    use-dock-position.ts      ← Hook: dock state, localStorage persistence
    use-detached-window.ts    ← Hook: window.open() + BroadcastChannel sync
```

### Injection point — `src/app/layout.tsx`:

```tsx
import dynamic from 'next/dynamic';

const TokenEditorDrawer = dynamic(
  () => import('@/components/dev/token-editor/TokenEditorDrawer'),
  { ssr: false }
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'development' && <TokenEditorDrawer />}
      </body>
    </html>
  );
}
```

Dynamic import with `ssr: false` ensures:
- No server-side rendering (CSS vars are client-only)
- Code-split into its own chunk
- Tree-shaken from production builds via the environment check

---

## 2. Token Registry

Create a structured registry of all editable tokens. This is the single source of truth for what the editor controls.

### `token-registry.ts`:

```typescript
export type TokenType = 'hsl-color' | 'length' | 'shadow' | 'font-size';

export interface TokenDefinition {
  /** CSS custom property name without -- prefix */
  cssVar: string;
  /** Human-readable label */
  label: string;
  /** Grouping category for the editor UI */
  group: TokenGroup;
  /** What kind of control to render */
  type: TokenType;
  /** Default value (read from globals.css at build time) */
  defaultValue: string;
}

export type TokenGroup =
  | 'Brand Colors'
  | 'Semantic Colors'
  | 'Surfaces'
  | 'Borders'
  | 'Text Colors'
  | 'Sidebar & Navigation'
  | 'Typography Scale'
  | 'Spacing & Layout'
  | 'Shadows';
```

Populate from these globals.css variables (extract all `:root` custom properties):

**Brand Colors:**
- `brand-orange` (hsl-color) — 27 87% 57%
- `brand-blue` (hsl-color) — 184 97% 42%
- `brand-green` (hsl-color) — 163 100% 43%
- `district-link` (hsl-color) — 198 58% 43%

**Semantic Colors:**
- `primary` (hsl-color)
- `secondary` (hsl-color)
- `destructive` (hsl-color)
- `success` (hsl-color)
- `warning` (hsl-color)
- `muted` (hsl-color)
- `accent` (hsl-color)

**Surfaces:**
- `background` (hsl-color)
- `surface-page` (hsl-color)
- `surface-raised` (hsl-color)
- `surface-inset` (hsl-color)
- `surface-emphasis` (hsl-color)
- `surface-emphasis-neutral` (hsl-color)
- `emphasis-surface` (hsl-color)

**Text Colors:**
- `foreground` (hsl-color)
- `foreground-secondary` (hsl-color)
- `foreground-tertiary` (hsl-color)
- `muted-foreground` (hsl-color)

**Borders:**
- `border-default` (hsl-color)
- `border-subtle` (hsl-color)
- `ring` (hsl-color)

**Sidebar & Navigation:**
- `sidebar-bg` (hsl-color)
- `topbar-bg` (hsl-color)
- `sidebar-fg` (hsl-color)
- `sidebar-hover` (hsl-color)
- `sidebar-active` (hsl-color)

**Typography Scale:**
- `font-base` (font-size) — 16px
- All computed sizes are derived from `font-base` via `calc()`, so editing `font-base` alone scales the entire type system. Include individual overrides for fine-tuning:
- `font-size-body` (font-size)
- `font-size-caption` (font-size)
- `font-size-section-heading` (font-size)
- `font-size-page-title` (font-size)

**Spacing & Layout:**
- `radius` (length) — 0.5rem
- `topbar-height` (length) — 5.5rem
- `content-max-width` (length) — 90rem

**Shadows:**
- `shadow-sm`, `shadow-md`, `shadow-lg` (shadow) — these are complex values; provide a dropdown of presets rather than a free-form editor.

### Reading defaults:

On mount, read every registered token's current computed value from `getComputedStyle(document.documentElement).getPropertyValue('--' + cssVar)`. Store these as `defaultValue` for reset functionality.

---

## 3. Control Rendering by Type

### `hsl-color` controls:
- **Color preview swatch** (small square showing current color)
- **HSL sliders:** H (0-360), S (0-100%), L (0-100%) — three range inputs
- **Hex input** field for direct entry (convert hex ↔ HSL bidirectionally)
- **Copy HSL** button (copies `27 87% 57%` format for globals.css)
- On change: `document.documentElement.style.setProperty('--' + cssVar, \`${h} ${s}% ${l}%\`)`

### `length` controls:
- **Number input** with unit selector (px, rem)
- **Range slider** with reasonable bounds (e.g., border-radius: 0–2rem, font-base: 12–20px)
- On change: `document.documentElement.style.setProperty('--' + cssVar, value + unit)`

### `font-size` controls:
- Same as length, but with a **live preview text** next to the control showing "The quick brown fox" at the current size

### `shadow` controls:
- **Preset dropdown**: none, sm (subtle), md (moderate), lg (elevated), xl (dramatic)
- Each preset maps to a specific shadow value string
- On change: set the `--shadow-*` variable to the preset value

---

## 4. Dock Modes

### State:

```typescript
type DockPosition = 'left' | 'right' | 'bottom' | 'detached';
```

Persist in `localStorage` under key `ak12-token-editor-dock`. Default: `'right'`.

### Dock toggle strip:

Four icon buttons in the drawer header — use Lucide icons:
- `PanelLeft` → left
- `PanelRight` → right
- `PanelBottom` → bottom (use `PanelBottomOpen` or similar)
- `ExternalLink` → detached

Active position gets a highlight state (e.g., `bg-primary/10` ring).

### Layout behavior per mode:

**Left dock:**
```css
.token-editor-panel { position: fixed; left: 0; top: 0; bottom: 0; width: 340px; z-index: 9999; }
body { margin-left: 340px; } /* push content */
```

**Right dock:**
```css
.token-editor-panel { position: fixed; right: 0; top: 0; bottom: 0; width: 340px; z-index: 9999; }
body { margin-right: 340px; }
```

**Bottom dock:**
```css
.token-editor-panel { position: fixed; left: 0; right: 0; bottom: 0; height: 40vh; z-index: 9999; }
body { margin-bottom: 40vh; }
```
In bottom mode, token groups render in a **horizontal scrolling row** instead of vertical accordion — better use of the wide, short panel.

**Detached:**
- Call `window.open()` with a specific route: `/dev/token-editor-detached`
- The inline drawer hides entirely, body margins reset
- The pop-out window renders `TokenEditorControls` standalone (no drawer chrome)
- Communication via `BroadcastChannel('ak12-token-editor')`

### Body margin management:

Use a `useEffect` that sets `document.body.style.marginX` when dock position or open state changes. Clean up on unmount. This ensures the app content shifts without requiring layout changes to any existing components.

---

## 5. Detached Window

### Route: `src/app/dev/token-editor-detached/page.tsx`

A minimal page that renders only `TokenEditorControls` with its own copy of the hooks. Dev-only route — add a redirect to `/` if `NODE_ENV !== 'development'`.

```tsx
'use client';
import { TokenEditorControls } from '@/components/dev/token-editor/TokenEditorControls';

export default function DetachedTokenEditor() {
  // All CSS var changes go through BroadcastChannel to parent
  return (
    <div className="p-4 bg-background min-h-screen">
      <h1 className="text-lg font-semibold mb-4">Token Editor (Detached)</h1>
      <TokenEditorControls target="broadcast" />
    </div>
  );
}
```

### BroadcastChannel protocol:

```typescript
const channel = new BroadcastChannel('ak12-token-editor');

// Sender (detached window):
channel.postMessage({
  type: 'token-change',
  cssVar: 'brand-orange',
  value: '28 85% 48%',
});

// Sender (detached window):
channel.postMessage({ type: 'reset-all' });

// Receiver (parent window):
channel.onmessage = (event) => {
  if (event.data.type === 'token-change') {
    document.documentElement.style.setProperty(
      '--' + event.data.cssVar,
      event.data.value
    );
  }
  if (event.data.type === 'reset-all') {
    // Remove all overrides
  }
};
```

### `use-detached-window.ts` hook:

```typescript
function useDetachedWindow() {
  const [isDetached, setIsDetached] = useState(false);
  const windowRef = useRef<Window | null>(null);

  const detach = () => {
    windowRef.current = window.open(
      '/dev/token-editor-detached',
      'token-editor',
      'width=380,height=800,menubar=no,toolbar=no'
    );
    setIsDetached(true);
  };

  const reattach = () => {
    windowRef.current?.close();
    setIsDetached(false);
  };

  // Listen for pop-out window closing
  useEffect(() => {
    if (!isDetached) return;
    const interval = setInterval(() => {
      if (windowRef.current?.closed) {
        setIsDetached(false);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isDetached]);

  return { isDetached, detach, reattach };
}
```

### Bidirectional sync:

Both the inline drawer and the detached window send changes via `BroadcastChannel`. Both also listen. This means:
- Detached window changes → parent page updates
- If someone also has the inline drawer open (edge case), it stays in sync
- Parent page refresh → detached window still works (BroadcastChannel persists across page loads as long as both windows are open)

---

## 6. Change Tracking and Diff Output

### `use-token-editor.ts` hook:

Track which tokens have been modified from their default values.

```typescript
interface TokenChange {
  cssVar: string;
  label: string;
  group: TokenGroup;
  originalValue: string;
  currentValue: string;
}

function useTokenEditor() {
  const [changes, setChanges] = useState<Map<string, TokenChange>>(new Map());

  const updateToken = (cssVar: string, newValue: string) => {
    document.documentElement.style.setProperty('--' + cssVar, newValue);
    // Track change (or remove from tracking if reverted to default)
  };

  const resetAll = () => {
    changes.forEach((_, cssVar) => {
      document.documentElement.style.removeProperty('--' + cssVar);
    });
    setChanges(new Map());
  };

  const resetToken = (cssVar: string) => {
    document.documentElement.style.removeProperty('--' + cssVar);
    // Remove from changes map
  };

  const getChangeCount = () => changes.size;

  const generateDiff = (): string => {
    // Format for CC paste
  };

  return { changes, updateToken, resetAll, resetToken, getChangeCount, generateDiff };
}
```

### Diff output format:

When "Copy Changes" is clicked, copy this to clipboard:

```
## Token Changes ({count} modified)

Update globals.css with the following token value changes:

| Token | Original | New Value |
|---|---|---|
| --brand-orange | 27 87% 57% | 28 85% 48% |
| --surface-muted | 210 40% 98% | 210 35% 96% |
| --font-base | 16px | 15px |

### Raw CSS (paste into :root block):
--brand-orange: 28 85% 48%;
--surface-muted: 210 35% 96%;
--font-base: 15px;
```

This format is directly pasteable into a Claude Code prompt. The table provides context; the raw CSS block is what CC needs to do the find-and-replace.

### UI for diff output:

A badge on the "Copy Changes" button shows the count of modified tokens (e.g., "Copy Changes (3)"). Clicking opens a small overlay or modal showing the formatted diff with a "Copy to Clipboard" button. Include a "Reset All" button in the same view.

---

## 7. Drawer UI Design

### Visual treatment:
- Background: `bg-background` (white) with `border` on the docked edge
- Shadow: `shadow-lg` for visual separation from page content
- Font: System default (do NOT use the app's Manrope — this is a dev tool, it should feel distinct)
- Header: Token group name, dock toggle strip, close button, change count badge
- z-index: 9999 (above everything in the app)

### Token groups as collapsible sections:
- Accordion pattern (shadcn Accordion) — one group open at a time
- Group header shows count of modified tokens in that group: "Brand Colors (2 changed)"
- Each token control shows its label, a mini reset button (↩ icon) if modified, and the appropriate control for its type

### Trigger button (when drawer is closed):
- Small floating button, bottom-right corner: 48×48px, `z-index: 9998`
- Icon: `Palette` from Lucide (or `Paintbrush`)
- Tooltip: "Token Editor"
- Shows a dot badge if any tokens are currently modified
- Positioned to not overlap with common UI elements

### Responsive behavior:
- This is a dev tool for desktop. Do not implement mobile responsiveness.
- Minimum drawer width: 320px. Minimum bottom height: 280px.

---

## 8. Drawer open/closed state

- Persist in `localStorage` under `ak12-token-editor-open` (boolean)
- When closed, only the trigger button is visible
- When open, the drawer panel renders in the current dock position
- Closing the drawer does NOT reset token changes — they persist until explicitly reset
- Token modifications persist only in memory (CSS property overrides). A page refresh restores all defaults.

---

## 9. Verification Checklist

- [ ] `process.env.NODE_ENV === 'development'` gate works — no editor in production build
- [ ] Dynamic import prevents the editor chunk from loading in production
- [ ] All four dock positions render correctly (left, right, bottom, detached)
- [ ] Body margins adjust to prevent content overlap in docked modes
- [ ] Color picker changes update the page in real time
- [ ] Typography scale slider changes update all text on the page
- [ ] Detached window communicates changes to parent via BroadcastChannel
- [ ] Closing detached window re-docks the editor
- [ ] Parent page refresh — detached window still functions (BroadcastChannel reconnects)
- [ ] "Copy Changes" produces correctly formatted diff
- [ ] "Reset All" removes all CSS property overrides
- [ ] Per-token reset (↩ button) removes individual overrides
- [ ] Dock position persists across page refreshes (localStorage)
- [ ] Open/closed state persists across page refreshes (localStorage)
- [ ] No console errors on mount, unmount, dock switch, or detach/reattach
- [ ] Existing app components render and function normally with the editor open
- [ ] `npx tsc --noEmit` passes
- [ ] No modifications to any existing components or styles
