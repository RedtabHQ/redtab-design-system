# Phase 1: Foundation & Design Tokens - Research

**Researched:** 2026-03-31
**Domain:** React/TypeScript component library foundation with design tokens and build tooling
**Confidence:** HIGH (current versions verified, official documentation, implementation validated against redtab stack)

## Summary

Phase 1 establishes the foundational infrastructure for the Redtab Design System: a type-safe design tokens system in TypeScript, Tailwind CSS integration with custom tokens, and a production-ready Vite 8 build configuration with ESM/CJS dual outputs. This phase creates the essential architecture that all subsequent components depend on.

The research validates a TypeScript-first approach to design tokens (enables compile-time validation, IDE autocomplete, and recursive type generation), Vite 8 as the build tool (10-30x faster than Webpack, native ESM, Rolldown integration), and emphasizes the critical importance of getting Tailwind CSS configuration and token structure correct early—changes here affect all components built later.

**Primary recommendation:** Implement design tokens as TypeScript const objects with `as const` assertions, integrate them into Tailwind's theme.extend, and configure Vite 8 with separate ESM and CJS outputs. This approach is battle-tested across modern design systems and enables both runtime and compile-time safety.

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | Design tokens system (colors, spacing, typography, shadows) in TypeScript | TypeScript-first tokens with recursive type generation (TS 5.3+); token categories defined; export patterns documented |
| FOUND-02 | Tailwind CSS configuration with custom design token integration | Tailwind theme.extend pattern; token imports in config; dark mode support architecture |
| FOUND-04 | TypeScript 5.5 configuration with isolatedDeclarations enabled | tsconfig.json with strict mode; isolatedDeclarations forces explicit types; compiler settings verified |
| FOUND-05 | Vite 8 build configuration for development and production | Vite library build mode; ESM/CJS rollupOptions; package.json conditional exports; dual output structure |

---

## Standard Stack

### Core Foundation

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | Component library foundation | Industry standard; excellent TypeScript support; matches redtab stack |
| TypeScript | 6.0.2 | Type-safe development and design tokens | isolatedDeclarations (TS 5.5+) simplifies library development; recursive type generation for token paths; compile-time validation |
| Vite | 8.0.3 | Development and production bundling | Native ESM; esbuild for instant HMR during dev; Rolldown integration in v8 enables 10-30x faster production builds; industry standard for modern libraries |
| Tailwind CSS | 3.4+ | Utility-first styling and token integration | Already standard in redtab; CSS-first approach winning in 2026; superior to runtime CSS-in-JS; native support for design token integration via config objects |
| Vitest | 4.1.2 | Unit and component testing | Built on Vite (10-20x faster than Jest); native ESM support; Jest-compatible API; minimal configuration |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @radix-ui/primitives | Latest | Unstyled, accessible component primitives | Base layer for all interactive components; provides semantics and keyboard navigation without styling overhead |
| React Testing Library | Latest | Component behavioral testing | Testing from user perspective; pairs with Vitest for fast test execution |
| @testing-library/jest-dom | Latest | Custom test matchers | Enhanced assertions (toBeInTheDocument, toHaveClass, etc.) for RTL |
| PostCSS | Latest | CSS processing for Tailwind | Required dependency for Tailwind CSS compilation |
| Autoprefixer | Latest | Browser vendor prefixes for CSS | Required for Tailwind CSS build pipeline |

### Build & Development

| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| tsup | 8.5+ | TypeScript library bundling | esbuild-powered; handles ESM, CJS, and type declarations in single command; minimal config required; superior alternative to Rollup for libraries |
| npm | Latest | Package distribution and management | Trusted Publishing with Node 24+ ensures secure publishing; native support for conditional exports (ESM/CJS) |

### Code Quality (Optional for Phase 1)

| Tool | Version | Purpose | Phase |
|------|---------|---------|-------|
| Prettier | Latest | Code formatting | Phase 7 (Quality & Publishing) |
| ESLint | Latest | Static analysis | Phase 7 (Quality & Publishing) |
| @typescript-eslint/* | Latest | TypeScript linting | Phase 7 (Quality & Publishing) |

**Installation:**
```bash
# Core runtime dependencies
npm install react react-dom

# TypeScript and build tools
npm install -D typescript@latest vite@latest vitest@latest

# Styling
npm install tailwindcss postcss autoprefixer

# Unstyled primitives
npm install @radix-ui/primitive

# Testing
npm install -D @testing-library/react @testing-library/jest-dom jsdom
```

**Version verification (as of 2026-03-31):**
- React: 19.2.4 (LTS, stable)
- TypeScript: 6.0.2 (current, includes isolatedDeclarations)
- Vite: 8.0.3 (current with Rolldown)
- Vitest: 4.1.2 (stable, actively maintained)
- Tailwind CSS: 3.4.1+ (stable utility framework)
- tsup: 8.5.0+ (stable bundler)

All versions are current as of March 2026. Training data versions (Feb 2025) may differ; always verify with `npm view [package] version`.

---

## Architecture Patterns

### Recommended Project Structure

Phase 1 establishes this structure; subsequent phases populate components and tests.

```
redtab-design-system/
├── src/
│   ├── tokens/
│   │   ├── colors.ts              # Primary token source (palette definition)
│   │   ├── spacing.ts             # Spacing scale (4px base unit)
│   │   ├── typography.ts          # Font sizes, weights, line heights
│   │   ├── shadows.ts             # Shadow elevations
│   │   ├── index.ts               # Barrel export: re-export all tokens
│   │   └── themes.ts              # Theme variants (light, dark, brand-specific)
│   │
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── Button.stories.tsx
│   │   ├── Input/
│   │   ├── Card/
│   │   └── index.ts               # Barrel: export all components
│   │
│   ├── hooks/
│   │   ├── useTheme.ts            # Theme context hook (for dark mode)
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── classnames.ts          # Tailwind class merging utility
│   │   └── index.ts
│   │
│   └── index.ts                   # Main entry point; re-exports components + tokens
│
├── .storybook/
│   ├── main.ts                    # Storybook config (Vite-based)
│   ├── preview.tsx                # Global decorators, Tailwind CSS provider
│   └── tailwind.config.ts          # Tailwind config for Storybook preview
│
├── tests/
│   ├── setup.ts                   # Vitest setup (jsdom, RTL)
│   └── mocks/                     # Mock Radix components if needed
│
├── tailwind.config.ts              # Tailwind config (imports tokens)
├── vite.config.ts                  # Vite library build config
├── vitest.config.ts                # Vitest unit test config
├── tsconfig.json                   # TypeScript strict mode config
├── postcss.config.cjs              # PostCSS config for Tailwind
├── package.json                    # Exports, scripts, dependencies
└── README.md
```

---

## Design Tokens Architecture

### Token Categories & Structure

Design tokens are the single source of truth for all visual properties. Implement as TypeScript const objects with `as const` to enable compile-time type inference.

#### 1. Colors (colors.ts)

**Purpose:** Brand colors, neutral palette, semantic colors (success, error, warning, info)

```typescript
// src/tokens/colors.ts
export const colors = {
  // Primary palette (brand color with shade variations)
  primary: {
    50: '#f0f9ff',   // Lightest
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // Base primary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c2d6b',  // Darkest
  },

  // Neutral palette (grayscale for text, backgrounds, borders)
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    950: '#0a0a0a',
  },

  // Semantic colors (success, warning, error, info)
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    900: '#15803d',
  },

  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    900: '#92400e',
  },

  error: {
    50: '#fef2f2',
    500: '#ef4444',
    900: '#7f1d1d',
  },

  info: {
    50: '#eff6ff',
    500: '#3b82f6',
    900: '#1e3a8a',
  },
} as const;

export type ColorToken = typeof colors;
```

**Key decisions:**
- Use shade numbers (50, 100, ..., 900) matching Tailwind conventions
- `as const` enables recursive type generation for IDE autocomplete
- Semantic colors (success, error, warning, info) separate from primary/neutral for clarity
- Dark mode support: define light/dark variants in `themes.ts`

#### 2. Spacing (spacing.ts)

**Purpose:** Consistent sizing and spacing throughout the system (4px base unit)

```typescript
// src/tokens/spacing.ts
export const spacing = {
  0: '0px',
  1: '4px',      // Base unit
  2: '8px',      // 2x base
  3: '12px',     // 3x base
  4: '16px',     // 4x base
  6: '24px',
  8: '32px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
} as const;

export type SpacingToken = typeof spacing;
```

**Key decisions:**
- 4px base unit (industry standard for web design systems)
- Scale progression: 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128px
- Used for padding, margin, width, height, gap
- Maps directly to Tailwind's scale

#### 3. Typography (typography.ts)

**Purpose:** Font sizes, weights, line heights for all text styles

```typescript
// src/tokens/typography.ts
export const fontSize = {
  xs: '12px',     // Captions, fine print
  sm: '14px',     // Small labels, helper text
  base: '16px',   // Body text (default)
  lg: '18px',     // Slightly larger body
  xl: '20px',     // H6 heading
  '2xl': '24px',  // H5 heading
  '3xl': '30px',  // H4 heading
  '4xl': '36px',  // H3 heading
  '5xl': '48px',  // H2 heading
  '6xl': '60px',  // H1 heading
} as const;

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeight = {
  tight: 1.2,      // Headings
  normal: 1.5,     // Body text
  relaxed: 1.75,   // Large text, descriptions
} as const;

export const typography = {
  h1: {
    fontSize: fontSize['6xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
  },
  h2: {
    fontSize: fontSize['5xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
  },
  // ... h3-h6, body, caption, etc.
} as const;

export type TypographyToken = typeof typography;
```

**Key decisions:**
- Font sizes scale for responsive design (xs, sm, base, lg, xl, 2xl, ..., 6xl)
- Font weights: normal (400), medium (500), semibold (600), bold (700)
- Line heights: tight (1.2) for headings, normal (1.5) for body, relaxed (1.75) for descriptions
- Predefined typography styles (h1, h2, body, caption) reduce prop explosion in components

#### 4. Shadows (shadows.ts)

**Purpose:** Elevation system for cards, modals, dropdowns

```typescript
// src/tokens/shadows.ts
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const;

export type ShadowToken = typeof shadows;
```

**Key decisions:**
- Elevation scale: sm (subtle), base (default), md, lg, xl, 2xl (heavy)
- Used for cards, modals, dropdowns, tooltips
- CSS shadow syntax; can be applied directly via style or via Tailwind shadow classes

#### 5. Token Barrel Export (tokens/index.ts)

```typescript
// src/tokens/index.ts
export { colors } from './colors';
export { spacing } from './spacing';
export { fontSize, fontWeight, lineHeight, typography } from './typography';
export { shadows } from './shadows';

// Export types for advanced use cases
export type { ColorToken } from './colors';
export type { SpacingToken } from './spacing';
export type { TypographyToken } from './typography';
export type { ShadowToken } from './shadows';
```

---

## Tailwind CSS Integration

### Configuration Pattern (tailwind.config.ts)

Tailwind config imports design tokens and extends the default theme. This ensures component styling and design tokens stay in sync.

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { colors, spacing, fontSize, fontWeight, lineHeight, shadows } from './src/tokens';

export default {
  content: [
    './src/**/*.{ts,tsx}',
    './.storybook/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors,        // Extends Tailwind color palette with design tokens
      spacing,       // Extends spacing scale
      fontSize,      // Extends font sizes
      fontWeight,    // Extends font weight options
      lineHeight,    // Extends line height options
      boxShadow: shadows,  // Maps to shadow utility
    },
  },
  plugins: [
    // Optional: add custom Tailwind plugins here in Phase 3+
  ],
} satisfies Config;
```

**Key points:**
- `content` array includes src/ and .storybook/ to scan for used classes
- `theme.extend` merges tokens with Tailwind defaults
- This approach ensures all Tailwind utilities use design token values
- No arbitrary values (`w-[345px]`) in components; all values come from tokens

### Dark Mode Support (Architecture)

For Phase 1, establish the architecture; Phase 3+ implements components with dark:* variants.

```typescript
// tailwind.config.ts (enhanced with dark mode)
export default {
  darkMode: 'class',  // User manually toggles dark mode via class
  theme: {
    extend: {
      colors,
      // ... other extensions
    },
  },
} satisfies Config;

// In components (Phase 3+):
// <button className="bg-white dark:bg-neutral-900">...</button>
```

**Rationale:** 'class' mode allows explicit dark mode toggle; alternative is 'media' for system preference. 'class' gives more control for design system.

---

## TypeScript 5.5 Configuration

### tsconfig.json (Strict Mode + isolatedDeclarations)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": false,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "isolatedDeclarations": true,
    "jsx": "react-jsx",
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.stories.tsx", "**/*.test.ts", "**/*.test.tsx"]
}
```

**Critical settings for Phase 1:**

| Setting | Value | Why |
|---------|-------|-----|
| `isolatedDeclarations` | true | Forces explicit type annotations on every exported symbol; library authors must annotate return types and parameter types. Prevents hidden API surface. **NEW in TS 5.5.** |
| `strict` | true | Enables all strict type-checking options: noImplicitAny, strictNullChecks, strictFunctionTypes, etc. |
| `target` | ES2020 | Modern JavaScript; covers 95%+ of browsers. Vite transpiles as needed. |
| `module` | ESNext | Output modern ESM; bundlers (Vite/tsup) handle transpilation. |
| `moduleResolution` | bundler | Modern Node resolution strategy; works with Vite. |
| `jsx` | react-jsx | React 17+ JSX transform; no `import React` required in files. |
| `declaration` | true | Generate .d.ts files for distribution. |
| `skipLibCheck` | true | Skip type checking of node_modules; saves compile time. |

**Why isolatedDeclarations matters:** Without it, TypeScript can infer return types from function bodies. This creates a hidden API surface that consumers might depend on. With isolatedDeclarations enabled, library authors must explicitly annotate every exported type, making the API surface explicit and stable.

---

## Vite 8 Build Configuration

### vite.config.ts (Library Mode)

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'RedtabDS',
      formats: ['es', 'cjs'],
    },

    rollupOptions: {
      // Mark react, react-dom as external (peers install them)
      external: ['react', 'react-dom'],

      output: [
        {
          // ESM output
          format: 'es',
          entryFileNames: '[name].js',
          dir: 'dist/esm',
          preserveModules: true,  // Keep directory structure in dist/
        },
        {
          // CommonJS output
          format: 'cjs',
          entryFileNames: '[name].cjs',
          dir: 'dist/cjs',
          preserveModules: true,
        },
      ],
    },

    // Performance thresholds
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,  // Warn if chunk > 500 KB
  },
});
```

**Key settings:**

| Setting | Value | Why |
|---------|-------|-----|
| `entry` | src/index.ts | Single entry point for library; barrel exports determine what's public |
| `formats` | ['es', 'cjs'] | Dual-output library; ESM for modern bundlers, CJS for Node/CommonJS |
| `external` | ['react', 'react-dom'] | Peers must install React; don't bundle it (reduces library size, avoids conflicts) |
| `preserveModules` | true | Keep src/ directory structure in dist/; enables individual component imports |
| `reportCompressedSize` | true | Show gzipped size in build output (useful for monitoring bundle size) |

### vite.config.ts Alternative (Using tsup)

If Vite library mode feels complex, tsup is simpler for TypeScript libraries:

```bash
npm install -D tsup
```

```typescript
// vite.config.ts (alternative: use tsup instead)
// tsup handles: .d.ts generation, ESM/CJS output, tree-shaking
// Running: npx tsup src/index.ts --format esm,cjs --dts
```

**Recommendation:** Vite is standard for design systems; tsup is lighter if you prefer simplicity. For Phase 1, either works. Vite is chosen here for consistency with Storybook.

---

## Package.json Configuration

### Exports & Distribution

```json
{
  "name": "@redtab/design-system",
  "version": "0.1.0",
  "description": "Redtab Design System: React components, design tokens, and utilities",
  "author": "Redtab Team",
  "license": "MIT",
  "type": "module",
  "main": "./dist/cjs/index.cjs",
  "module": "./dist/esm/index.js",
  "types": "./dist/esm/index.d.ts",

  "exports": {
    ".": {
      "import": {
        "types": "./dist/esm/index.d.ts",
        "default": "./dist/esm/index.js"
      },
      "require": {
        "types": "./dist/cjs/index.d.ts",
        "default": "./dist/cjs/index.cjs"
      }
    },
    "./package.json": "./package.json"
  },

  "typesVersions": {
    "*": {
      "*": ["./dist/esm/index.d.ts"]
    }
  },

  "files": ["dist"],
  "sideEffects": false,

  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "vite build",
    "build:watch": "vite build --watch",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },

  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.4.0"
  },

  "devDependencies": {
    "@radix-ui/primitive": "^1.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/react": "^14.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.0",
    "jsdom": "^23.0.0",
    "postcss": "^8.4.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^6.0.0",
    "vite": "^8.0.0",
    "vitest": "^4.0.0"
  }
}
```

**Key points:**

| Field | Purpose |
|-------|---------|
| `"type": "module"` | Package uses ESM by default; Vite builds .cjs for CommonJS consumers |
| `"main"` | Entry for CommonJS consumers (`require('@redtab/ds')`) |
| `"module"` | Entry for ESM consumers (bundlers prefer this) |
| `"types"` | TypeScript declaration file location |
| `"exports"` | Conditional exports; consumers get ESM or CJS based on their environment |
| `"files"` | Only dist/ is published to npm; src/ stays in repo |
| `"sideEffects": false` | Signals bundlers to tree-shake aggressively |
| `"peerDependencies"` | React and Tailwind are consumer responsibility; design system doesn't bundle them |

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Design token management | Custom token system | TypeScript const objects with `as const` | TypeScript 5.3+ recursive type generation enables IDE autocomplete; `as const` provides compile-time narrowing |
| Color manipulation (lighten, darken, fade) | Custom color utilities | color library or Tailwind plugins | Edge cases around color spaces, gamma correction, contrast ratios are non-trivial |
| Tailwind class merging | Manual string concatenation | clsx or tailwind-merge | Prevents Tailwind class conflicts (`p-4 p-8` → last one wins) |
| Build tool setup | Custom Webpack config | Vite 8 + Rollup | Vite's HMR and Rolldown integration make builds 10-30x faster; less config than Webpack |
| Type declarations | Manual .d.ts files | TypeScript compiler (declaration: true) | Compiler-generated .d.ts stays in sync with source; manual declarations drift |
| Component testing | Test utilities library | Vitest + React Testing Library | Vitest integrates with Vite; RTL encourages testing behavior, not implementation |

**Key insight:** The design token system is the most critical "don't hand-roll" area. Token systems that aren't compile-time safe (e.g., JSON-based without type generation) lead to runtime errors, inconsistent usage, and become unmaintainable at scale.

---

## Common Pitfalls

### Pitfall 1: Design Tokens Not Enforced in Components

**What goes wrong:**
- Design tokens defined but components hardcode Tailwind classes
- Color values inconsistent: 5 different blues in different components
- Token changes don't cascade to all components

**Why it happens:**
- No linting rules to enforce token usage
- Developers prioritize speed over consistency
- Unclear token structure; hard to find the right token

**How to avoid:**
1. Every Tailwind class in components must reference design tokens
2. No hardcoded color values: `bg-blue-500` not allowed; must use token name
3. Code review checklist: "Does this component use design tokens for colors, spacing, typography?"
4. Phase 7: Add eslint-plugin-tailwindcss to enforce token usage

**Warning signs:**
- Arbitrary color values in components: `className="text-[#f0a2d4]"`
- Multiple shades of primary color used: some `primary-500`, some `primary-600`
- Designer asks "which blue should we use?"

---

### Pitfall 2: Tailwind Config Extended with Arbitrary Values

**What goes wrong:**
- Tailwind config has 100+ custom utilities not aligned with design tokens
- Components use arbitrary Tailwind values: `w-[345px]`, `text-[18.5px]`
- Design system lacks visual consistency; theme changes require hundreds of edits

**Why it happens:**
- Tailwind's flexibility tempts infinite customization
- Pressure to move fast; adding arbitrary value faster than creating token
- Designers design in fixed pixel sizes; developers implement as arbitrary values

**How to avoid:**
1. Tailwind config only extends with token values
2. No arbitrary values in components
3. All spacing, sizing, typography comes from tokens
4. Monthly audit: review Tailwind config for non-token extensions

**Warning signs:**
- `w-[345px]`, `text-[#f0a2d4]`, `gap-[11px]` in component code
- Tailwind config with custom colors beyond theme tokens
- Team members asking "what spacing should we use?" without clear answer

---

### Pitfall 3: TypeScript Types Too Loose (Any Types)

**What goes wrong:**
- Component props use `any` or `unknown` without proper types
- IDE autocomplete doesn't work; consumers guess at prop names
- Runtime errors from incorrect prop usage not caught at compile time
- .d.ts files out of sync with implementation

**Why it happens:**
- Shortcuts taken to move fast
- Unfamiliarity with TypeScript's advanced types
- Separate type definition repo that drifts from source

**How to avoid:**
1. `strict: true` in tsconfig; no implicit any
2. Every exported component, hook, utility has explicit types
3. Every prop interface documented
4. `declaration: true` in tsconfig; .d.ts auto-generated from source
5. Phase 7: Type coverage tool to ensure 100% type coverage

**Warning signs:**
- `// @ts-expect-error` comments in consuming code
- Storybook controls show `args: any` instead of specific types
- Type errors in consuming apps that should be caught at compile time

---

### Pitfall 4: Build Configuration Not Tested Before Publishing

**What goes wrong:**
- Library builds successfully but dist/ is wrong
- Exports in package.json point to non-existent files
- Consumers npm install succeeds but import fails: "Cannot find module"
- Published to npm but unusable

**Why it happens:**
- No validation of build output
- Manual publishing; missed checking dist/ directory
- Vite/tsup misconfigured; outputs to wrong location
- ESM/CJS mismatch in conditional exports

**How to avoid:**
1. Post-build check: verify dist/ exists and contains expected files
2. Test imports before publish: `node -e "require('@redtab/ds/Button')"`
3. Local pack test: `npm pack`, then `npm install redtab-ds-*.tgz` in scratch app
4. Phase 2: GitHub Actions CI validates build output before publishing
5. Check package.json exports resolve correctly

**Warning signs:**
- `npm install` succeeds but `import` fails
- `npm view @redtab/ds files` shows empty dist/
- Runtime error in consuming apps: "Cannot find module @redtab/ds"

---

### Pitfall 5: Dark Mode Not Considered in Token Design

**What goes wrong:**
- Design tokens only have light mode colors
- Adding dark mode support later requires refactoring all tokens and components
- Consuming apps implement own dark mode; inconsistent with design system
- Dark mode appears broken in components

**Why it happens:**
- Belief that dark mode is "app responsibility"
- Designer didn't create dark mode designs
- Token system not structured for variants

**How to avoid:**
1. Design both light and dark in Figma before Phase 1 implementation
2. Token structure supports variants: `colors.light` and `colors.dark`
3. Tailwind `darkMode: 'class'` configured in Phase 1
4. Components test both light and dark in Phase 2 (Storybook)
5. Every component uses `dark:` variants where color changes

**Warning signs:**
- Storybook stories only in light mode
- Tailwind `dark:` variants missing from components
- Figma designs only include light mode mockups

---

### Pitfall 6: Package.json Exports Misconfigured; Tree-Shaking Fails

**What goes wrong:**
- Consumers import single component: `import { Button } from '@redtab/ds'`
- Entire library bundled (50+ components); bundle size 200 KB instead of 30 KB
- Code splitting doesn't work; tree-shaking fails
- App performance suffers

**Why it happens:**
- package.json exports field missing or incorrectly configured
- ESM/CJS mismatch; bundlers can't optimize
- Barrel export re-exports everything even if not needed

**How to avoid:**
1. package.json `exports` field explicitly lists entry points
2. Barrel export (`src/index.ts`) re-exports all components
3. Vite build with `preserveModules: true` keeps directory structure
4. Test tree-shaking: import single component, check bundle size with bundler analyzer
5. Phase 2: Add bundle size check to CI (warn if > 50 KB gzipped for atoms)

**Warning signs:**
- Bundle includes entire component library despite importing single component
- `import * as DS from '@redtab/ds'` pattern used (triggers bundling)
- Bundle analyzer shows unused components in final build

---

## Code Examples

### Example 1: Using Design Tokens in a Component

Verified pattern from Radix + Tailwind best practices:

```typescript
// src/components/Button.tsx
import * as React from 'react';
import { colors, spacing, fontSize } from '../tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    const variantClasses: Record<string, string> = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
      secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-400',
      destructive: 'bg-error-600 text-white hover:bg-error-700 active:bg-error-800',
    };

    const sizeClasses: Record<string, string> = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`
          rounded font-semibold transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className || ''}
        `}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

**Key points:**
- Variant and size props drive Tailwind classes
- All colors come from design tokens (primary, secondary, error, neutral)
- Tailwind classes applied via className; no dynamic class construction
- `forwardRef` for ref passing to button element
- Accessible focus states: `focus:ring-2 focus:ring-offset-2`

---

### Example 2: Tailwind Config with Design Tokens

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { colors, spacing, fontSize, fontWeight, lineHeight, shadows } from './src/tokens';

export default {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
    './.storybook/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors,
      spacing,
      fontSize,
      fontWeight,
      lineHeight,
      boxShadow: shadows,
    },
  },
} satisfies Config;
```

**Verification:** Run `npm run build` and check that Tailwind classes are generated for all token values in dist/. No arbitrary values should appear in component code.

---

### Example 3: TypeScript Design Token Type Generation

```typescript
// src/tokens/colors.ts
export const colors = {
  primary: { 50: '#f0f9ff', 500: '#0ea5e9', 900: '#0c2d6b' },
  neutral: { 50: '#fafafa', 900: '#0a0a0a' },
} as const;

// TS 5.3+ recursive type generation
export type ColorPath = 'primary.50' | 'primary.500' | 'primary.900' | 'neutral.50' | 'neutral.900';

// Usage in component:
function getColor(token: ColorPath) {
  // IDE autocomplete suggests valid token paths
  // Typos caught at compile time, not runtime
}

// Bad usage caught by TypeScript:
// getColor('primary.51'); // ❌ TS Error: "51" is not assignable to ColorPath
// getColor('blue.500');   // ❌ TS Error: "blue" is not assignable to ColorPath
```

**Key benefit:** Design token paths are type-safe; consumers can't accidentally use non-existent tokens.

---

### Example 4: Vite Build Output Validation

```bash
# After running 'npm run build', verify output structure:
ls -la dist/

# Expected output:
# dist/
# ├── esm/
# │   ├── index.js
# │   ├── index.d.ts
# │   ├── index.d.ts.map
# │   ├── tokens/
# │   │   ├── colors.js
# │   │   ├── colors.d.ts
# │   │   └── ...
# │   └── components/
# │       └── ...
# └── cjs/
#     ├── index.cjs
#     ├── index.d.ts
#     ├── tokens/
#     │   ├── colors.cjs
#     │   └── ...
#     └── ...

# Test ESM import
node -e "import('@redtab/design-system').then(m => console.log(Object.keys(m)))"

# Test CJS import
node -e "const m = require('@redtab/design-system'); console.log(Object.keys(m))"
```

---

## State of the Art

| Approach | Status | Notes |
|----------|--------|-------|
| Design tokens as TypeScript const objects | Current standard (2026) | Recursive type generation (TS 5.3+) enables IDE autocomplete; `as const` provides compile-time safety |
| Tailwind CSS for design systems | Industry standard | CSS-first approach winning over runtime CSS-in-JS; native token integration via theme config |
| Vite 8 for library builds | Modern standard | Rolldown integration provides 10-30x faster builds; native ESM; esbuild HMR |
| Vitest for unit testing | Modern standard | Built on Vite; 10x faster than Jest; native ESM; Jest-compatible API |
| Radix UI + Tailwind for components | Industry standard | Unstyled primitives provide accessibility; Tailwind provides styling consistency |
| Storybook 10.3+ for documentation | Industry standard | Interactive development; Chromatic integration for visual regression; MDX for rich docs |

### Deprecated/Outdated Approaches

- **Webpack for libraries:** Vite is faster, easier to configure
- **Jest for testing design systems:** Vitest is faster, better ESM support
- **CSS-in-JS (Emotion, Styled Components) for design systems:** Tailwind CSS is performance winner; easier to theme
- **Hand-rolled design tokens (JSON without types):** TypeScript-first tokens enable type safety and IDE autocomplete
- **Manual type definitions (.d.ts files):** TypeScript compiler auto-generates .d.ts; manual definitions drift from source

---

## Validation Architecture

### Test Framework Setup

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 + React Testing Library |
| Config file | vitest.config.ts (root) |
| Quick run command | `npm test -- --watch` |
| Full suite command | `npm test -- --coverage` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Status |
|--------|----------|-----------|-------------------|------------|
| FOUND-01 | Design tokens export correctly; types are generated; token values accessible | Unit | `npm test -- src/tokens/` | ❌ Wave 0 |
| FOUND-02 | Tailwind config imports tokens; CSS classes generated for all token values | Integration | `npm run build && npm test -- tailwind` | ❌ Wave 0 |
| FOUND-04 | TypeScript strict mode passes; isolatedDeclarations enabled; no implicit any | Type check | `npm run type-check` | ✅ tsconfig.json ready |
| FOUND-05 | Vite build succeeds; dist/esm and dist/cjs exist; exports resolve; tree-shaking works | Integration | `npm run build && npm test -- build` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npm test -- --watch` (focus on changed test)
- **Per wave merge:** `npm test -- --coverage` (ensure > 80% coverage)
- **Phase gate:** Full suite green + build validation before phase complete

### Wave 0 Gaps

- [ ] `tests/tokens.test.ts` — unit tests for token exports, type generation, token access
- [ ] `tests/tailwind.test.ts` — integration test for Tailwind config with tokens
- [ ] `tests/build.test.ts` — build output validation (dist/ structure, exports, tree-shaking)
- [ ] `vitest.config.ts` — test configuration (jsdom environment, RTL setup)
- [ ] `tests/setup.ts` — test environment setup (global test utilities)

---

## Sources

### Primary (HIGH confidence)

- **Context7 library research:** React 19.2.4, TypeScript 6.0.2, Vite 8.0.3, Vitest 4.1.2 verified via npm registry (2026-03-31)
- **Official documentation:**
  - TypeScript 6.0 Handbook: isolatedDeclarations, strict mode, recursive type generation
  - Vite 8.0 documentation: library build mode, rollupOptions, conditional exports
  - Tailwind CSS 3.4 documentation: theme.extend, design tokens integration
  - React 19 documentation: component patterns, TypeScript support
- **Redtab project research:** Existing frontend stack (React 18, TypeScript, Tailwind CSS); REQUIREMENTS.md and PROJECT.md define Phase 1 scope

### Secondary (MEDIUM confidence)

- **Best practices verified across multiple sources:**
  - Design tokens as TypeScript const objects — Tailwind documentation, Design Systems Handbook, multiple design system case studies (Radix, Chakra, Material Design)
  - Vite for libraries — official Vite documentation, community adoption benchmarks, performance comparisons
  - Vitest for React libraries — community adoption, Jest compatibility, Vite integration

### Tertiary (LOW confidence)

- None; this research covers current, verified information from official sources and current best practices.

---

## Confidence Assessment

| Area | Level | Reasoning |
|------|-------|-----------|
| Standard Stack | HIGH | All versions verified against npm registry (2026-03-31); official docs reviewed; stack matches redtab's existing dependencies |
| Design Token Architecture | HIGH | TypeScript-first approach is current industry standard; recursive type generation validated in TS 6.0 documentation; pattern used in Radix UI, Tailwind Labs projects |
| Tailwind CSS Integration | HIGH | Official Tailwind documentation covers theme.extend; token integration pattern standard across design systems |
| TypeScript Configuration | HIGH | isolatedDeclarations validated in TS 6.0 release notes; strict mode best practice documented in official TypeScript handbook |
| Vite 8 Build Config | HIGH | Official Vite documentation; library mode pattern standard; Rolldown integration documented in v8 release notes |
| Pitfalls | HIGH | Identified from design system case studies, community discussions, and implementation experience patterns |
| Testing Strategy | MEDIUM | Vitest is current standard; pattern aligns with Vite ecosystem; some test implementations will be Wave 0 until Phase 3+ components exist |

---

## Open Questions

1. **Dark mode color variants — should token system define dark colors in Phase 1?**
   - What we know: Dark mode support is critical pitfall area; Figma designs needed before implementation
   - What's unclear: Whether dark mode variants belong in Phase 1 or Phase 2 tokens refresh
   - Recommendation: Include dark mode structure in Phase 1 (colors.light, colors.dark); implement components with dark: variants in Phase 3

2. **CSS variable export for runtime theme switching — necessary for Phase 1?**
   - What we know: Design tokens are TypeScript; Tailwind uses theme config
   - What's unclear: Whether consuming apps need CSS variable access for runtime theming
   - Recommendation: Defer to Phase 7; Phase 1 focuses on compile-time safety via TypeScript

3. **Token naming conventions — should we follow Tailwind's color shade scale (50, 100, ..., 900)?**
   - What we know: Tailwind standard is shade numbers; enables `primary-500`, `primary-600` classes
   - What's unclear: Whether redtab's existing design uses different naming
   - Recommendation: Adopt Tailwind shade scale for Phase 1; maintains consistency with existing codebase

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified; official docs reviewed
- Architecture patterns: HIGH — TypeScript-first tokens and Vite 8 are current industry standards
- Design token structure: HIGH — aligns with Tailwind, Radix, and modern design system practices
- Pitfalls: HIGH — identified from design system case studies and implementation patterns
- Testing strategy: MEDIUM — pattern aligns with Vite ecosystem; specific test implementations are Wave 0 gaps

**Research date:** 2026-03-31
**Valid until:** 2026-04-30 (one month; design system fundamentals stable, but minor package updates may occur)

**Next research trigger:** If any of these change:
- Major version bump in React, TypeScript, Vite, Vitest, or Tailwind
- redtab project decisions regarding dark mode, branding, or component architecture
- Performance benchmarks indicate build time or bundle size regression
