# Phase 1: Foundation & Design Tokens - Quick Reference

**Phase:** 01-foundation-design-tokens
**Status:** Ready for execution
**Created:** 2026-03-31
**Plans:** 3 (waves 1, 2, 3)
**Tasks:** 23 total
**Estimated Duration:** ~105 minutes

---

## Documents in This Phase

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **01-PLAN.md** | Wave 1: Foundation setup & configuration (6 tasks) | 10 min |
| **02-PLAN.md** | Wave 2: Design tokens & Tailwind integration (8 tasks) | 15 min |
| **03-PLAN.md** | Wave 3: Build validation & verification (8 tasks) | 15 min |
| **PHASE-SUMMARY.md** | Complete phase overview, architecture, dependencies | 20 min |
| **01-RESEARCH.md** | Research backing all decisions (token architecture, Vite config, TS strict mode) | 30 min |
| **INDEX.md** | This document — quick reference |  |

---

## Quick Start for Executor

1. **Read PHASE-SUMMARY.md first** (~20 min) — understand phase goal, wave structure, what gets built
2. **Read 01-PLAN.md, 02-PLAN.md, 03-PLAN.md in order** (~40 min) — understand each task
3. **Execute Wave 1 tasks** (parallel, ~30 min) — create configuration files
4. **Execute Wave 2 tasks** (parallel, ~45 min) — create design tokens
5. **Execute Wave 3 tasks** (sequential, ~30 min) — validate build and commit

**Total time: ~105 minutes (1.75 hours)**

---

## Phase Requirements Addressed

| Requirement | Plan | Task(s) | Status |
|-------------|------|---------|--------|
| **FOUND-01**: Design tokens system in TypeScript | Plan 2 | 2.1-2.5 | To Execute |
| **FOUND-02**: Tailwind CSS with token integration | Plan 2 | 2.6 | To Execute |
| **FOUND-04**: TypeScript 5.5 with isolatedDeclarations | Plan 1 | 1.2 | To Execute |
| **FOUND-05**: Vite 8 build configuration | Plan 1 & 3 | 1.3, 3.3 | To Execute |

**Coverage:** 100% (all 4 Phase 1 requirements addressed)

---

## Key Deliverables by Wave

### Wave 1: Configuration Files (Plan 01)
```
package.json                 ← Dependencies, exports, scripts
tsconfig.json                ← TypeScript strict + isolatedDeclarations
vite.config.ts               ← Vite library build (ESM + CJS)
vitest.config.ts             ← Test environment (jsdom)
postcss.config.cjs           ← Tailwind CSS pipeline
src/, .storybook/, tests/    ← Directory structure
```

### Wave 2: Design Tokens & Integration (Plan 02)
```
src/tokens/colors.ts         ← Primary, neutral, semantic colors
src/tokens/spacing.ts        ← 4px-based spacing scale
src/tokens/typography.ts     ← Fonts, sizes, line heights
src/tokens/shadows.ts        ← 6-level elevation system
src/tokens/index.ts          ← Barrel export
tailwind.config.ts           ← Tailwind with token integration
src/index.ts                 ← Main entry point
tests/setup.ts               ← React Testing Library setup
```

### Wave 3: Build Validation (Plan 03)
```
node_modules/                ← Dependencies installed
dist/esm/                    ← ESM build output
dist/cjs/                    ← CommonJS build output
.gitignore                   ← Git ignore configuration
✓ npm install                ← Dependencies resolved
✓ TypeScript check           ← Type safety verified
✓ Vite build                 ← Build successful
✓ Vitest setup               ← Test environment ready
```

---

## Architecture at a Glance

### Design Tokens System

```typescript
// Developers import tokens from TypeScript
import { colors, spacing, typography, shadows } from '@redtabcode/design-system/tokens';

// Compile-time safe: TypeScript catches mistakes
const myColor = colors.primary[500];      // ✓ Valid
const myBadColor = colors.primary[999];   // ✗ TypeScript error

// IDE autocomplete works: colors.primary.{50|100|200|...|900}
```

### Build Pipeline

```
src/tokens/*.ts (source)
        ↓
TypeScript compiler (strict mode)
        ↓
Vite build (library mode)
        ↓
dist/esm/      (Modern bundlers, ESM)
dist/cjs/      (Node.js, CommonJS)

Both outputs have .d.ts files for TypeScript consumers
```

### Tailwind Integration

```typescript
// tailwind.config.ts
import { colors, spacing, ... } from './src/tokens';

export default {
  theme: {
    extend: {
      colors,       // All Tailwind color utilities use these
      spacing,      // All padding/margin/gap use these
      fontSize,     // All text size utilities use these
      // etc.
    },
  },
};

// Result: No arbitrary values in components
// bg-blue-500 = colors.primary[500] (from tokens)
```

---

## Execution Checklist

### Before Starting
- [ ] Node.js 20+ installed
- [ ] npm 10+ installed
- [ ] Git repository initialized
- [ ] Working directory: `/Users/vuquangthinh/Documents/redtab-design-system/`
- [ ] Read PHASE-SUMMARY.md

### Wave 1 Execution
- [ ] Task 1.1: package.json created with correct exports
- [ ] Task 1.2: tsconfig.json with strict mode + isolatedDeclarations
- [ ] Task 1.3: vite.config.ts with dual ESM/CJS outputs
- [ ] Task 1.4: vitest.config.ts with jsdom environment
- [ ] Task 1.5: postcss.config.cjs with Tailwind + Autoprefixer
- [ ] Task 1.6: src/, .storybook/, tests/ directories created

### Wave 2 Execution
- [ ] Task 2.1: colors.ts (primary, neutral, semantic palettes)
- [ ] Task 2.2: spacing.ts (4px-based scale)
- [ ] Task 2.3: typography.ts (sizes, weights, line heights, predefined styles)
- [ ] Task 2.4: shadows.ts (6-level elevation system)
- [ ] Task 2.5: tokens/index.ts (barrel export)
- [ ] Task 2.6: tailwind.config.ts (token-powered)
- [ ] Task 2.7: src/index.ts (main entry point)
- [ ] Task 2.8: tests/setup.ts (React Testing Library)

### Wave 3 Execution
- [ ] Task 3.1: `npm install` succeeds, dependencies resolved
- [ ] Task 3.2: `npx tsc --noEmit` passes with zero errors
- [ ] Task 3.3: `npm run build` produces dist/esm/ and dist/cjs/
- [ ] Task 3.4: .d.ts files generated in both outputs
- [ ] Task 3.5: package.json exports point to correct files
- [ ] Task 3.6: .gitignore created (excludes dist/, node_modules/)
- [ ] Task 3.7: `npm test -- --run` works (finds zero tests, no errors)
- [ ] Task 3.8: `git status` shows no build artifacts

### After Phase 1 Complete
- [ ] All tasks from 1.1-3.8 completed successfully
- [ ] PHASE-SUMMARY.md verification checklist 100% passing
- [ ] Ready to proceed to Phase 2 (Build Infrastructure)

---

## Decision Summary

### What Was Chosen (And Why)

| Decision | Choice | Rationale | Backup |
|----------|--------|-----------|--------|
| Design token format | TypeScript const + as const | Compile-time safe, IDE autocomplete, recursive types | JSON-based (loses type safety) |
| Build tool | Vite 8 | 10-30x faster than Webpack, native ESM, Rolldown integration | tsup (simpler but less feature-rich) |
| Type safety | TypeScript strict + isolatedDeclarations | Forces explicit types, prevents hidden API surface | Loose TypeScript (riskier) |
| Styling integration | Tailwind CSS (token-powered) | Industry standard, CSS-first approach, superior to runtime CSS-in-JS | Styled-components (runtime overhead) |
| Distribution | Dual ESM/CJS with conditional exports | Modern bundlers get ESM, Node.js gets CJS, zero runtime conflicts | Single format (harder to consume) |
| Test runner | Vitest | Built on Vite, 10-20x faster than Jest, native ESM | Jest (slower, extra config) |

### What Was NOT Chosen (And Why)

| Feature | Why Not | When to Consider |
|---------|---------|------------------|
| ESLint + Prettier | Code quality enforced Phase 7, not Phase 1 | After Phase 1 foundation stable |
| Dark mode tokens (v1) | Architecture supports it; implementation Phase 3+ | Once components built |
| Animation library | Tailwind + CSS animations sufficient for v1 | Phase 2 (v2 roadmap) |
| Custom form library | Rely on HTML + hooks; integrate with existing libraries | If form complexity grows |

---

## Key File Reference

### Configuration Files (Wave 1)
- **package.json** — `@redtabcode/design-system` metadata, ESM/CJS exports, scripts, dependencies
- **tsconfig.json** — strict mode, isolatedDeclarations, ES2020 target
- **vite.config.ts** — library mode, dual outputs, React plugin, external: ['react', 'react-dom']
- **vitest.config.ts** — jsdom environment, globals enabled, setupFiles: ['./tests/setup.ts']
- **postcss.config.cjs** — tailwindcss + autoprefixer plugins

### Design Token Files (Wave 2)
- **src/tokens/colors.ts** — Primary (#0ea5e9), neutral (grayscale), semantic (success/warning/error/info)
- **src/tokens/spacing.ts** — 4px base scale (0, 1-4, 6, 8, 12, 16, 20, 24, 32)
- **src/tokens/typography.ts** — Font sizes (xs-6xl), weights (400-700), line heights (1.2-1.75), predefined styles
- **src/tokens/shadows.ts** — Elevation scale (none, sm, base, md, lg, xl, 2xl)
- **src/tokens/index.ts** — Barrel export re-exporting all tokens and types
- **tailwind.config.ts** — Extends theme with token values, darkMode: 'class'
- **src/index.ts** — Main entry point, exports tokens
- **tests/setup.ts** — React Testing Library matchers, cleanup hook

### Build Output (Wave 3)
- **dist/esm/** — ESM bundle (index.js, .d.ts files, tokens/ modules)
- **dist/cjs/** — CommonJS bundle (index.cjs, .d.ts files, tokens/ modules)
- **.gitignore** — Excludes node_modules/, dist/, .vscode/, .env

---

## Troubleshooting Guide

| Problem | Cause | Solution |
|---------|-------|----------|
| `npm install` fails | Invalid package.json syntax | Check JSON: `jq . package.json` |
| TypeScript errors | Missing type annotations | Check tsconfig.json: isolatedDeclarations must be true |
| Vite build fails | src/index.ts missing or broken | Verify src/index.ts exists and exports tokens |
| .d.ts files missing | declaration: false in tsconfig.json | Set declaration: true |
| Imports don't work | Wrong export paths in package.json | Verify exports match actual dist/ files |
| dist/ committed to git | .gitignore not created | Create .gitignore with "dist/" entry |
| Tailwind utilities not working | Tokens not imported in tailwind.config.ts | Add: `import { colors, spacing, ... } from './src/tokens'` |

---

## Next Phase: Phase 2 - Build Infrastructure

After Phase 1 completes, Phase 2 will:
- Set up Storybook 10.3+ for interactive documentation
- Configure Chromatic for visual regression testing
- Establish story patterns and MDX documentation
- Configure npm publishing workflow

Phase 2 depends on Phase 1 being complete.

---

*Last updated: 2026-03-31*
*Ready for execution. All 23 tasks documented with acceptance criteria and verification steps.*
