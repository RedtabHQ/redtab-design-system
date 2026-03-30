# Technology Stack: React + TypeScript Design System

**Project:** redtab Design System
**Researched:** March 2026
**Overall confidence:** HIGH (current versions, official documentation)

## Recommended Stack

### Core Framework & Build
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React | 18.3+ | Component library foundation | Industry standard, excellent TypeScript support, largest ecosystem |
| TypeScript | 5.5+ | Type-safe development | isolatedDeclarations simplifies library development; recursive type generation for design tokens (5.3+) |
| Vite | 8.0+ | Development & production bundling | Instant HMR during dev via esbuild; Rolldown integration in v8 gives 10-30x faster production builds; native ESM support |
| Rollup (via Vite) | Bundled in Vite 8 | Library bundling | Tree-shaking for optimized bundle sizes; integrated in Vite's production pipeline |

### Component Documentation
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Storybook | 10.3+ | Interactive component development | Industry standard with Chromatic integration; hundreds of teams use it; built-in testing & documentation features |
| MDX | Latest | Interactive documentation | Seamlessly embed React components in Markdown; live code playgrounds; superior to static docs |
| Chromatic | Latest | Visual regression testing | Official Storybook team product; automated visual testing per commit; searchable component library; Q1 2026 features include component validation agents |

### Testing
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vitest | Latest | Unit & component testing | Built on Vite (10-20x faster than Jest); native ESM support; Jest-compatible API; minimal config |
| React Testing Library | Latest | Component behavioral testing | Encourages testing from user perspective; no complex setup needed with Vitest |
| @testing-library/jest-dom | Latest | Custom matchers | Enhanced RTL assertions (toBeInTheDocument, etc.) |

### Styling & Design Tokens
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | 3.4+ | Utility-first styling | Already in use at redtab; superior to runtime CSS-in-JS for design systems; CSS-first theming winning in 2026 |
| TypeScript (for tokens) | 5.5+ | Type-safe design tokens | Recursive type generation for token paths; compile-time validation; isolatedDeclarations for explicit API |

### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Radix UI | Latest | Unstyled accessible primitives | Build custom-styled components with Tailwind; excellent accessibility; no styling overhead |
| @radix-ui/primitive-* | Latest | Individual headless components | Decompose complex components into Radix primitives + Tailwind |

### Package Publishing
| Tool | Version | Purpose | Why |
|------|---------|---------|-----|
| tsup | 8.5+ | Zero-config TypeScript bundling | Simplest approach; esbuild-powered; handles ESM, CJS, types in one command; superior to Rollup for libraries |
| npm | Latest | Package distribution | Trusted Publishing with Node 24+; export conditional builds (ESM/CJS) |

### Development Utilities
| Tool | Version | Purpose | Why |
|------|---------|---------|-----|
| prettier | Latest | Code formatting | Consistent style across library; non-negotiable in teams |
| eslint | Latest | Static analysis | Catch errors before runtime; integrate with Vite |
| @typescript-eslint/* | Latest | TypeScript linting | Type-aware lint rules |

---

## Architecture Overview

```
redtab-design-system/
├── packages/
│   ├── core/                    # Core component library
│   │   ├── src/
│   │   │   ├── components/      # Individual Radix + Tailwind components
│   │   │   ├── tokens/          # TypeScript design tokens (colors, spacing, etc.)
│   │   │   └── index.ts         # Barrel export with tree-shaking
│   │   ├── vite.config.ts       # Vite library build config
│   │   └── package.json         # ESM + CJS exports, types field
│   └── storybook/               # Storybook 10.3+
│       ├── stories/             # Component stories (.stories.tsx)
│       ├── .storybook/
│       │   ├── main.ts          # Storybook config
│       │   └── preview.tsx      # Global decorators (theme, Tailwind)
│       └── storybook-static/    # Chromatic builds
├── vitest.config.ts            # Shared test config
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Development server config
└── package.json                # Monorepo root
```

---

## Installation & Setup

### 1. Core Dependencies
```bash
# Runtime
npm install react react-dom

# Unstyled primitives
npm install @radix-ui/primitives

# CSS framework
npm install tailwindcss postcss autoprefixer

# TypeScript
npm install -D typescript@5.5 typescript-eslint
```

### 2. Development Dependencies
```bash
# Build & bundling
npm install -D vite@8 tsup vitest

# Component development
npm install -D storybook@10.3 @storybook/react @storybook/addon-essentials @storybook/addon-a11y

# Testing
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Code quality
npm install -D prettier eslint @typescript-eslint/eslint-plugin

# Chromatic (optional but recommended)
npm install -D chromatic
```

### 3. Example vite.config.ts (Library Build)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'RedtabDS',
      fileName: (format) => `redtab-ds.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          dir: 'dist/esm',
        },
        {
          format: 'cjs',
          entryFileNames: '[name].cjs',
          dir: 'dist/cjs',
        },
      ],
    },
  },
});
```

### 4. Example package.json (Export Configuration)
```json
{
  "name": "@redtab/design-system",
  "version": "1.0.0",
  "type": "module",
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
  "scripts": {
    "build": "vite build",
    "dev": "storybook dev -p 6006",
    "test": "vitest",
    "test:ui": "vitest --ui"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "vite": "^8.0.0",
    "tsup": "^8.5.0",
    "storybook": "^10.3.0",
    "vitest": "latest",
    "typescript": "^5.5.0"
  }
}
```

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Build Tool | Vite 8 + Rollup | Webpack | Complex config; Vite's HMR faster; Rolldown in v8 superior |
| Library Bundler | tsup | Rollup directly | tsup wraps Rollup with better defaults; requires less config |
| Component Framework | React 18 + Radix | Vue 3, Svelte | React dominates component library ecosystem; redtab already React |
| Styling | Tailwind CSS | CSS-in-JS (Emotion, Styled) | CSS-first winning in 2026; better performance; design tokens type-safe |
| Testing | Vitest | Jest | Vite integration; 10x+ faster; native ESM; better React support |
| Documentation | Storybook 10.3 | Docz | Storybook has Chromatic ecosystem; more mature; larger community |
| Visual Testing | Chromatic | Percy | Built by Storybook team; seamless integration; Q1 2026 agent features |
| Unstyled Primitives | Radix UI | Headless UI | More comprehensive; better accessibility; Tailwind teams now recommend Radix or Base UI |

---

## Design Tokens Implementation

### Recommended Approach: TypeScript-First Tokens

```typescript
// src/tokens/colors.ts
export const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',
    900: '#0c2d6b',
  },
  neutral: {
    50: '#fafafa',
    900: '#0a0a0a',
  },
} as const;

export type ColorToken = typeof colors;

// Generates union: 'primary.50' | 'primary.100' | ... via recursive type
// TypeScript 5.5+ isolatedDeclarations ensures explicit API
```

**Why TypeScript for tokens:**
- Compile-time validation (no runtime typos)
- IDE autocomplete for token access
- Recursive type generation (TS 5.3+) creates exhaustive unions
- Pairs perfectly with Tailwind's config objects
- Design system can expose tokens as both JS and CSS variables

---

## Publishing Strategy

### Phase 1: Internal Alpha (npm private)
1. Publish under @redtab scope with private registry
2. Test with real apps (redtab frontends)
3. Validate component API stability

### Phase 2: Public Beta (npm public)
1. Change to public scope: `@redtab/design-system`
2. Semantic versioning from 1.0.0
3. Chromatic pipeline for visual regression

### Phase 3: Stable Release (1.0.0+)
1. Full ESM + CJS support via conditional exports
2. Type definitions shipped in dist/
3. Automated publishing via GitHub Actions + Trusted Publishing
4. Changelog management (changesets recommended)

**Publishing tooling:**
```bash
# Simplest: npm CLI with Trusted Publishing (Node 24+)
npm publish --provenance

# Enterprise: Changesets monorepo management
npm install -D @changesets/cli
```

---

## TypeScript Configuration

### tsconfig.json (Recommended)
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
    "skipLibCheck": true,
    "esModuleInterop": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "isolatedDeclarations": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.stories.tsx", "**/*.test.ts"]
}
```

**Key settings:**
- `isolatedDeclarations`: Forces explicit types (TS 5.5+); library authors must annotate, prevents hidden API surface
- `moduleResolution: "bundler"`: Modern Node resolution strategy
- `strict: true`: Catches the most errors
- `jsx: "react-jsx"`: React 17+ JSX transform (no React import needed in files)

---

## Version Recommendations (as of March 2026)

| Package | Recommended | Notes |
|---------|-------------|-------|
| React | 18.3+ | Stable, excellent TypeScript |
| Vite | 8.0+ | Latest with Rolldown (fastest) |
| Storybook | 10.3+ | Current major version |
| TypeScript | 5.5+ | isolatedDeclarations + recursive types |
| Vitest | Latest | Rapidly improving; release monthly |
| Tailwind CSS | 3.4+ | Stable utility framework |
| tsup | 8.5+ | Stable bundler |
| Node.js | 20+, preferably 24 | LTS + Trusted Publishing support |

---

## Sources

- [Webpack vs Vite vs esbuild: The 2026 Build Tool Comparison](https://dev.to/_d7eb1c1703182e3ce1782/webpack-vs-vite-vs-esbuild-the-2026-build-tool-comparison-3gj8)
- [Build a React component library with TypeScript and Vite](https://victorlillo.dev/blog/react-typescript-vite-component-library)
- [Vite 6.0 Release](https://vite.dev/blog/announcing-vite6)
- [Vite releases](https://github.com/vitejs/vite/releases)
- [Complete Guide to Setting Up React with TypeScript and Vite (2026)](https://medium.com/@robinviktorsson/complete-guide-to-setting-up-react-with-typescript-and-vite-2025-468f6556aaf2)
- [Guide to React Testing Library using Vitest](https://makersden.io/blog/guide-to-react-testing-library-vitest)
- [Storybook official documentation](https://storybook.js.org/)
- [Chromatic visual testing documentation](https://www.chromatic.com/)
- [Radix UI documentation](https://www.radix-ui.com/)
- [tsup documentation and GitHub](https://github.com/egoist/tsup)
- [TypeScript 5.4 Release Notes - Conditional Exports](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-4.html)
- [TypeScript 5.5 Release Notes - isolatedDeclarations](https://devblogs.microsoft.com/typescript/announcing-typescript-5-5/)
- [MDX documentation](https://mdx-js.com/)
- [15 Best React UI Libraries for 2026](https://www.builder.io/blog/react-component-libraries-2026)
- [From Component to npm: Publishing React Native Components as Reusable Packages](https://www.agilesoftlabs.com/blog/2026/02/from-component-to-npm-publishing-react)
- [Best Practices for Creating a Modern npm Package](https://snyk.io/blog/best-practices-create-modern-npm-package/)
- [Design tokens format module specification](https://github.com/nclsndr/design-tokens-format-module)
- [Tailwind CSS design system](https://tailwindcss.com/)
