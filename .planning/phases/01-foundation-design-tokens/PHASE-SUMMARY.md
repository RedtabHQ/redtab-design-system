# Phase 1: Foundation & Design Tokens - Plan Summary

**Phase:** 01-foundation-design-tokens
**Created:** 2026-03-31
**Plans:** 3 plans in 3 waves
**Requirements Addressed:** FOUND-01, FOUND-02, FOUND-04, FOUND-05
**Total Tasks:** 23 tasks across all plans

---

## Phase Overview

Phase 1 establishes the foundational infrastructure for the Redtab Design System: a type-safe design tokens system in TypeScript, Vite 8 build configuration with dual ESM/CommonJS outputs, and complete integration with Tailwind CSS. This phase creates the essential architecture upon which all subsequent components (Phases 3-7) depend.

**Phase Goal:** Establish foundational infrastructure with design tokens, build configuration, and TypeScript setup so all subsequent components have a consistent, themeable foundation.

**Success Criteria (What Must Be TRUE):**
1. Developers can import and use design tokens (colors, spacing, typography, shadows) from TypeScript source in components
2. Tailwind CSS is configured with custom design tokens and builds components with correct spacing, colors, and typography
3. Vite 8 builds the library to a distributable bundle with separate ESM and CommonJS outputs
4. TypeScript 5.5 is configured with isolatedDeclarations enabled and strict mode active; all code passes type checking
5. Project structure is ready for component development (src/components, src/tokens, src/hooks, src/utils)

---

## Wave Structure & Execution Plan

### Wave 1: Foundation Setup & Configuration (6 tasks, parallel execution)
**Depends on:** Nothing (first phase)
**Duration:** ~30 minutes
**Autonomy:** Fully autonomous

All Wave 1 tasks are independent and can run in parallel:
- **Task 1.1:** Initialize package.json with dependencies and exports
- **Task 1.2:** Configure TypeScript 5.5 with strict mode and isolatedDeclarations
- **Task 1.3:** Configure Vite 8 library build with ESM and CommonJS outputs
- **Task 1.4:** Configure Vitest for unit testing with jsdom and React Testing Library
- **Task 1.5:** Configure PostCSS for Tailwind CSS compilation
- **Task 1.6:** Create initial project directory structure

**Output:** Foundation configuration files (package.json, tsconfig.json, vite.config.ts, vitest.config.ts, postcss.config.cjs) and directory structure ready for content.

---

### Wave 2: Design Tokens System & Tailwind Integration (8 tasks, parallel execution)
**Depends on:** Wave 1 complete
**Duration:** ~45 minutes
**Autonomy:** Fully autonomous

All Wave 2 tasks are independent token creations and can run in parallel:
- **Task 2.1:** Create design tokens: colors (primary, neutral, semantic palettes)
- **Task 2.2:** Create design tokens: spacing (4px-based scale)
- **Task 2.3:** Create design tokens: typography (font sizes, weights, line heights, predefined styles)
- **Task 2.4:** Create design tokens: shadows (6-level elevation system)
- **Task 2.5:** Create tokens barrel export (src/tokens/index.ts)
- **Task 2.6:** Configure Tailwind CSS with design token integration
- **Task 2.7:** Create main library entry point (src/index.ts)
- **Task 2.8:** Create test setup file for Vitest and React Testing Library

**Output:** Complete design tokens system, Tailwind configuration powered by tokens, main entry point, and test setup ready for Phase 3+ components.

---

### Wave 3: Build Validation & Entry Point Configuration (8 tasks, sequential execution)
**Depends on:** Waves 1 and 2 complete
**Duration:** ~30 minutes
**Autonomy:** Fully autonomous

Wave 3 tasks must run sequentially (each builds on previous):
- **Task 3.1:** Run npm install and verify all dependencies resolve
- **Task 3.2:** Run TypeScript type check on entire project
- **Task 3.3:** Build Vite library to dist/ with ESM and CommonJS outputs
- **Task 3.4:** Validate TypeScript declarations are generated correctly
- **Task 3.5:** Test that package.json exports resolve correctly
- **Task 3.6:** Create .gitignore to exclude build artifacts
- **Task 3.7:** Run Vitest to verify test environment is working
- **Task 3.8:** Verify build artifacts are not committed to git

**Output:** Production-ready build artifacts (dist/esm and dist/cjs), validated type declarations, and project ready for git commit.

---

## Plans vs Tasks Matrix

| Plan | Wave | Title | Tasks | Duration | Autonomous | Key Files |
|------|------|-------|-------|----------|-----------|-----------|
| 01 | 1 | Foundation Setup & Configuration | 1.1-1.6 | ~30m | Yes | package.json, tsconfig.json, vite.config.ts, vitest.config.ts, postcss.config.cjs |
| 02 | 2 | Design Tokens & Tailwind Integration | 2.1-2.8 | ~45m | Yes | src/tokens/*.ts, tailwind.config.ts, src/index.ts, tests/setup.ts |
| 03 | 3 | Build Validation & Entry Points | 3.1-3.8 | ~30m | Yes | dist/, .gitignore |

**Total Phase 1 Duration:** ~105 minutes (1.75 hours)
**All phases autonomous:** Yes (no checkpoints, all fully automated)

---

## Design Tokens Architecture

### Token Categories

**1. Colors (src/tokens/colors.ts)**
- Primary palette: 10 shades (50-900), base color #0ea5e9 (sky blue)
- Neutral palette: 11 shades (0-950), grayscale from white to black
- Semantic colors: success (green), warning (amber), error (red), info (blue)
- Type: `ColorToken = typeof colors` for IDE autocomplete

**2. Spacing (src/tokens/spacing.ts)**
- 4px base unit scale: 0, 1 (4px), 2 (8px), 3 (12px), 4 (16px), 6, 8, 12, 16, 20, 24, 32 (128px)
- Used for padding, margin, width, height, gap
- Type: `SpacingToken = typeof spacing`

**3. Typography (src/tokens/typography.ts)**
- Font sizes: xs (12px) to 6xl (60px), 10 levels
- Font weights: normal (400), medium (500), semibold (600), bold (700)
- Line heights: tight (1.2), normal (1.5), relaxed (1.75)
- Predefined styles: h1-h6, body, caption (combines font properties)
- Type: `TypographyToken = typeof typography`

**4. Shadows (src/tokens/shadows.ts)**
- Elevation scale: none, sm (subtle), base (default), md, lg, xl, 2xl (heavy)
- CSS shadow syntax; applies directly via style or Tailwind shadow utilities
- Type: `ShadowToken = typeof shadows`

### Implementation Approach

**TypeScript-first with `as const`:**
```typescript
export const colors = { /* ... */ } as const;
export type ColorToken = typeof colors;
```

Benefits:
- Compile-time safety: TypeScript validates token usage
- IDE autocomplete: Intellisense shows available tokens
- Recursive type generation: IDE shows nested properties (colors.primary.500)
- No runtime overhead: `as const` is compile-time only

---

## Build Configuration Details

### Vite 8 Library Configuration

**Entry Point:** src/index.ts
**Formats:** ESM (dist/esm/index.js) and CommonJS (dist/cjs/index.cjs)
**Outputs:** Separate directories with preserved module structure for tree-shaking
**External Dependencies:** react, react-dom (marked as external; consumers install as peers)

**Build Command:** `npm run build`
**Dev Command:** `npm run dev` (or `vite` for development)

### TypeScript Configuration

**Strict Mode:** Enabled
**isolatedDeclarations:** Enabled (TS 5.5 feature; forces explicit type exports)
**Target:** ES2020
**Module:** ESNext
**Declaration:** true (generates .d.ts files)
**Declaration Maps:** true (sourcemaps for declarations)

### Tailwind CSS Configuration

**Integration:** Design tokens imported directly into tailwind.config.ts
**Theme Extension:** All tokens extended into Tailwind theme (colors, spacing, fontSize, fontWeight, lineHeight, boxShadow)
**Dark Mode:** 'class' strategy (explicit dark mode toggle via class)
**Content Paths:** src/**/*.{ts,tsx}, .storybook/**/*.{ts,tsx}

### PostCSS Configuration

**Plugins:** tailwindcss, autoprefixer
**Purpose:** Processes Tailwind directives and adds vendor prefixes
**Trigger:** Runs during Vite build and Storybook dev

---

## Package Distribution Structure

### package.json Exports

```json
{
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
    }
  }
}
```

**Conditional Exports:**
- Modern bundlers (Webpack 5+, Vite, etc.) prefer ESM entry
- Node.js CommonJS consumers get CJS entry
- TypeScript consumers get appropriate .d.ts files

**Files Published to npm:** Only dist/ directory (src/ not included)

---

## Phase Dependencies & Blockers

### No External Blockers
Phase 1 is the foundation phase with no upstream dependencies. Can begin immediately.

### Downstream Dependencies
- **Phase 2** (Build Infrastructure) depends on Phase 1 being complete
- **Phase 3** (Core Components) depends on Phases 1 and 2
- **All subsequent phases** depend transitively on Phase 1

### Critical Path
Phase 1 → Phase 2 (Storybook) → Phase 3 (Atoms) → Phase 4 (Forms) → Phase 5 (Complex) → Phase 6 (Hooks/Utils) → Phase 7 (Publishing)

---

## Verification Checklist

After Phase 1 completion, verify:

- [ ] **Wave 1:** Configuration files exist (package.json, tsconfig.json, vite.config.ts, vitest.config.ts, postcss.config.cjs)
- [ ] **Wave 2:** Design token files exist (src/tokens/colors.ts, spacing.ts, typography.ts, shadows.ts, index.ts)
- [ ] **Wave 2:** tailwind.config.ts imports tokens and extends theme
- [ ] **Wave 2:** src/index.ts exports design tokens
- [ ] **Wave 3:** npm install succeeds with all dependencies resolved
- [ ] **Wave 3:** TypeScript type check passes (`npx tsc --noEmit`)
- [ ] **Wave 3:** Vite build succeeds, producing dist/esm/ and dist/cjs/
- [ ] **Wave 3:** Type declarations exist (.d.ts files in both outputs)
- [ ] **Wave 3:** .gitignore excludes build artifacts
- [ ] **Wave 3:** Vitest test environment working

---

## Known Constraints & Decisions

### Design Token Constraints

1. **No Arbitrary Values:** All Tailwind utilities must use design token values; no arbitrary values like `bg-[#ff0000]`
2. **Token Enforcement:** Phase 7 will add ESLint rules to enforce token usage in components
3. **Dark Mode Support:** Token architecture supports dark mode variants (Phase 3+ implements dark: variants in components)

### Build Constraints

1. **React as Peer Dependency:** React not bundled; consumers install React 18+
2. **Tailwind as Peer Dependency:** Tailwind CSS not bundled; consumers install Tailwind 3.4+
3. **Tree-Shaking:** preserveModules enabled in Vite config to enable component-level tree-shaking

### TypeScript Constraints

1. **Strict Mode Enforced:** All code must pass strict type checking
2. **isolatedDeclarations Enforced:** All exported symbols must have explicit type annotations
3. **No Implicit Any:** TypeScript configured to reject implicit any

---

## Risk Mitigation

| Risk | Probability | Mitigation |
|------|-------------|-----------|
| Vite build config produces wrong output structure | Low | Task 3.3 validates ESM/CJS outputs; Task 3.4 validates declarations; Task 3.5 validates exports |
| Design tokens misaligned with Tailwind config | Low | Design tokens are imported directly into Tailwind config; single source of truth |
| TypeScript strict mode catches late | Low | Task 3.2 runs type check early; isolated declarations enforced from start |
| Build artifacts accidentally committed | Low | Task 3.6 creates .gitignore early; Task 3.8 verifies git ignoring works |

---

## What Comes Next

### Phase 2: Build Infrastructure
- Storybook 10.3+ setup with React preset
- Chromatic visual regression testing integration
- Package.json publishing workflow configuration
- Story patterns and MDX documentation structure

### Phase 3: Core Atomic Components
- Button component (primary, secondary, danger variants)
- Input component (text, email, password, search variants)
- Card component with shadows and spacing
- Typography system (Heading H1-H6, Body, Caption)
- Badge and Avatar components

### Long-term (Phases 4-7)
- Form components (FormField, Select, Checkbox, Radio, Textarea, Toggle)
- Layout system (Container, Grid, Stack, Flexbox, Divider)
- Complex interactive components (Dialog, Dropdown, Tooltip, Tabs, Alert, Pagination)
- Custom hooks and utilities
- Testing and quality enforcement
- npm publishing

---

## Task Execution Guide

### Prerequisites Before Starting

1. Node.js 20+ installed (`node --version`)
2. npm 10+ installed (`npm --version`)
3. Git repository initialized (`git status` should work)
4. Working directory: `/Users/vuquangthinh/Documents/redtab-design-system/`

### Execution Order

**Wave 1 (Can run in parallel):**
All 6 tasks are independent. Recommended order for clarity:
1. Task 1.1 (package.json)
2. Task 1.2 (tsconfig.json)
3. Task 1.3 (vite.config.ts)
4. Task 1.4 (vitest.config.ts)
5. Task 1.5 (postcss.config.cjs)
6. Task 1.6 (directories)

**Wave 2 (Can run in parallel):**
All 8 tasks are independent. Recommended order by category:
1. Task 2.1-2.4 (token files, any order)
2. Task 2.5 (tokens barrel export)
3. Task 2.6 (tailwind.config.ts)
4. Task 2.7 (src/index.ts)
5. Task 2.8 (tests/setup.ts)

**Wave 3 (MUST run sequentially):**
Tasks depend on previous task completion:
1. Task 3.1 (npm install)
2. Task 3.2 (TypeScript check)
3. Task 3.3 (Vite build)
4. Task 3.4 (Validate declarations)
5. Task 3.5 (Validate exports)
6. Task 3.6 (.gitignore)
7. Task 3.7 (Vitest)
8. Task 3.8 (Git status)

### Time Estimates

- Wave 1: ~30 minutes
- Wave 2: ~45 minutes
- Wave 3: ~30 minutes
- **Total Phase 1: ~105 minutes (~1.75 hours)**

### Quality Gates

Each plan includes acceptance criteria and verification steps. Plans should not proceed to next wave until:
- [ ] All acceptance criteria met
- [ ] Verification commands pass
- [ ] No errors in logs

---

## Commitment Summary

Phase 1 commits these architecture decisions for the project lifetime:

1. **Design tokens:** TypeScript const objects with `as const` (compile-time safe)
2. **Build tool:** Vite 8 (fast, modern, ESM-first)
3. **Type safety:** TypeScript 5.5 strict mode with isolatedDeclarations
4. **Styling:** Tailwind CSS utilities powered by design tokens
5. **Peer dependencies:** React 18+, Tailwind 3.4+
6. **Distribution:** Dual ESM/CJS outputs with tree-shaking support
7. **Testing:** Vitest + React Testing Library

These decisions cascade through all subsequent phases (2-7) and should not be reconsidered unless architectural review explicitly overrules them.

---

*Phase 1 planning complete. Ready for execution.*
