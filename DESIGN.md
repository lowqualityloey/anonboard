# DESIGN.md

Design tokens for AnonBoard. Single source of truth for all visual decisions.

> Rule: use semantic tokens (`bg-surface`) in code, never raw palette values (`bg-gray-900`).
> If you reach for the same raw value twice, add a semantic token.

Related: [README.md](./README.md) · [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Color

### Primitives

| Token | Value |
|---|---|
| `--gray-950` | `#0a0a0a` |
| `--gray-900` | `#171717` |
| `--gray-800` | `#262626` |
| `--gray-700` | `#404040` |
| `--gray-400` | `#a3a3a3` |
| `--gray-100` | `#f5f5f5` |
| `--green-500` | `#22c55e` |
| `--green-400` | `#4ade80` |
| `--red-500` | `#ef4444` |
| `--amber-500` | `#f59e0b` |

### Semantic

| Token | Maps to | Usage |
|---|---|---|
| `--color-bg` | `--gray-950` | App background |
| `--color-surface` | `--gray-900` | Cards, panels |
| `--color-border` | `--gray-800` | Default border |
| `--color-border-hover` | `--gray-700` | Hover border |
| `--color-text` | `--gray-100` | Body text |
| `--color-text-muted` | `--gray-400` | Metadata, timestamps |
| `--color-accent` | `--green-500` | Links, primary buttons |
| `--color-accent-hover` | `--green-400` | Accent hover |
| `--color-danger` | `--red-500` | Delete, destructive |
| `--color-warning` | `--amber-500` | Locked, warnings |

---

## Typography

### Font families

| Token | Value |
|---|---|
| `--font-sans` | `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` |
| `--font-mono` | `ui-monospace, "SFMono-Regular", "Menlo", monospace` |

### Size

| Token | Value | Line height |
|---|---|---|
| `--text-xs` | `0.75rem` | `1rem` |
| `--text-sm` | `0.875rem` | `1.25rem` |
| `--text-base` | `1rem` | `1.5rem` |
| `--text-lg` | `1.125rem` | `1.75rem` |
| `--text-xl` | `1.25rem` | `1.75rem` |
| `--text-2xl` | `1.5rem` | `2rem` |

### Weight

| Token | Value |
|---|---|
| `--font-normal` | `400` |
| `--font-medium` | `500` |
| `--font-semibold` | `600` |

---

## Spacing

Base scale: Tailwind default (4px step).

Layout rhythm tokens:

| Token | Value | Usage |
|---|---|---|
| `--space-page-x` | `1rem` | Page padding, horizontal |
| `--space-page-y` | `1.5rem` | Page padding, vertical |
| `--space-section` | `2rem` | Between major sections |
| `--space-stack` | `0.75rem` | Between list items |
| `--space-inline` | `0.5rem` | Between inline elements |

---

## Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `0.25rem` | Badges, chips |
| `--radius-md` | `0.5rem` | Inputs, buttons |
| `--radius-lg` | `0.75rem` | Cards, panels |
| `--radius-full` | `9999px` | Pills, avatars |

---

## Shadow

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgb(0 0 0 / 0.3)` | Subtle lift |
| `--shadow-md` | `0 4px 12px rgb(0 0 0 / 0.35)` | Dropdowns, modals |
| `--shadow-focus` | `0 0 0 3px rgb(34 197 94 / 0.4)` | Focus ring |

---

## Motion

| Token | Value | Usage |
|---|---|---|
| `--duration-fast` | `120ms` | Hover, focus |
| `--duration-base` | `200ms` | Most transitions |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Enter animations |

Respect `prefers-reduced-motion`.

---

## Z-index

| Token | Value | Usage |
|---|---|---|
| `--z-base` | `0` | Default |
| `--z-sticky` | `10` | Sticky reply form |
| `--z-nav` | `20` | Navbar |
| `--z-modal` | `50` | Modals, dialogs |
| `--z-toast` | `60` | Toasts |

---

## Breakpoints

Tailwind defaults.

| Token | Min width |
|---|---|
| `sm` | `640px` |
| `md` | `768px` |
| `lg` | `1024px` |
| `xl` | `1280px` |

---

## Tailwind v4 mapping

```css
/* src/styles/app.css */
@import "tailwindcss";

@theme {
  /* Primitives */
  --color-gray-950: #0a0a0a;
  --color-gray-900: #171717;
  --color-gray-800: #262626;
  --color-gray-700: #404040;
  --color-gray-400: #a3a3a3;
  --color-gray-100: #f5f5f5;
  --color-green-500: #22c55e;
  --color-green-400: #4ade80;
  --color-red-500: #ef4444;
  --color-amber-500: #f59e0b;

  /* Semantic */
  --color-bg: var(--color-gray-950);
  --color-surface: var(--color-gray-900);
  --color-border: var(--color-gray-800);
  --color-border-hover: var(--color-gray-700);
  --color-text: var(--color-gray-100);
  --color-text-muted: var(--color-gray-400);
  --color-accent: var(--color-green-500);
  --color-accent-hover: var(--color-green-400);
  --color-danger: var(--color-red-500);
  --color-warning: var(--color-amber-500);

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.3);
  --shadow-md: 0 4px 12px rgb(0 0 0 / 0.35);

  /* Motion */
  --duration-fast: 120ms;
  --duration-base: 200ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## Component contracts

Classes each component must use. Derived from the tokens above.

| Component | Classes |
|---|---|
| Button / primary | `bg-accent text-bg hover:bg-accent-hover rounded-md px-3 py-1.5` |
| Button / secondary | `bg-surface text-text border border-border hover:border-border-hover rounded-md px-3 py-1.5` |
| Button / danger | `bg-danger text-white rounded-md px-3 py-1.5` |
| Card | `bg-surface border border-border rounded-lg p-4` |
| Input | `bg-bg border border-border rounded-md px-3 py-2 text-text placeholder:text-text-muted focus:border-accent focus:outline-none` |

Focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`
Disabled: `disabled:opacity-50 disabled:pointer-events-none`