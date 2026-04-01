# Phase 1: Foundation & Design Tokens - Complete Planning Package

**Phase:** 01-foundation-design-tokens  
**Status:** ✅ Planning Complete - Ready for Execution  
**Created:** 2026-03-31  
**Total Plans:** 3 (Wave 1, 2, 3)  
**Total Tasks:** 23  
**Estimated Execution Time:** ~105 minutes (1.75 hours)  

---

## Welcome to Phase 1 Planning

This folder contains comprehensive, executable plans for Phase 1 of the Redtab Design System project. Everything you need to build the foundational infrastructure is here.

### Files in This Folder

```
01-foundation-design-tokens/
├── README.md                    ← You are here
├── INDEX.md                     ← Quick reference (start here for overview)
├── PHASE-SUMMARY.md             ← Complete phase architecture & overview
├── 01-RESEARCH.md               ← Research backing all decisions
├── 01-PLAN.md                   ← Wave 1: Configuration (6 tasks)
├── 02-PLAN.md                   ← Wave 2: Design Tokens (8 tasks)
├── 03-PLAN.md                   ← Wave 3: Build Validation (8 tasks)
```

### Three Ways to Use This Package

#### Option A: Quick Start (15 minutes)
1. Read **INDEX.md** — Quick reference guide
2. Jump to task(s) you're executing
3. Execute task steps; refer to full PLAN.md for details

#### Option B: Full Understanding (90 minutes)
1. Read **PHASE-SUMMARY.md** — Understand phase goal, architecture, wave structure
2. Read **01-PLAN.md**, **02-PLAN.md**, **03-PLAN.md** — Understand all 23 tasks
3. Execute tasks in wave order (Wave 1 → Wave 2 → Wave 3)

#### Option C: Research-Backed (2+ hours)
1. Read **01-RESEARCH.md** — Understand why every decision was made
2. Read PHASE-SUMMARY.md
3. Read all three PLAN.md files
4. Execute tasks with full context

---

## Quick Navigation

### By Role

**Project Manager:**
- Read PHASE-SUMMARY.md → INDEX.md

**Developer Executing Tasks:**
- Read INDEX.md → Your assigned PLAN.md → Execute tasks

**Tech Lead Reviewing Plans:**
- Read PHASE-SUMMARY.md → 01-RESEARCH.md → All PLAN.md files

**Code Reviewer:**
- Reference 01-RESEARCH.md for architecture decisions
- Reference PLAN.md tasks for acceptance criteria

---

## Phase 1 at a Glance

### What This Phase Delivers

✅ **Design Tokens System** — TypeScript-based, compile-time safe  
✅ **Vite 8 Build Pipeline** — Dual ESM/CommonJS outputs  
✅ **Tailwind CSS Integration** — Token-powered utilities  
✅ **TypeScript Configuration** — Strict mode + isolatedDeclarations  
✅ **Test Infrastructure** — Vitest + React Testing Library ready  

### By the Numbers

- **4 Requirements** addressed (FOUND-01, 02, 04, 05)
- **3 Waves** of execution
- **23 Tasks** total
- **8 Key Files** created (package.json, tsconfig.json, vite.config.ts, vitest.config.ts, postcss.config.cjs, tailwind.config.ts, src/index.ts, tests/setup.ts)
- **4 Token Categories** (colors, spacing, typography, shadows)
- **100% Coverage** of Phase 1 requirements

### Key Decisions Made

| Decision | What | Why |
|----------|------|-----|
| **Tokens** | TypeScript const + `as const` | Compile-time safe, IDE autocomplete, recursive types |
| **Build Tool** | Vite 8 | 10-30x faster than Webpack, native ESM, modern |
| **Type Safety** | TypeScript strict + isolatedDeclarations | Forces explicit types, prevents hidden API surface |
| **Styling** | Tailwind CSS (token-powered) | Industry standard, CSS-first, superior to runtime CSS-in-JS |
| **Distribution** | Dual ESM/CJS | Modern bundlers get ESM, Node.js gets CJS, zero conflicts |

---

## Execution Checklist

### Before You Start

- [ ] Node.js 20+ installed (`node --version`)
- [ ] npm 10+ installed (`npm --version`)
- [ ] Git repository initialized (`git status` works)
- [ ] Working directory: `/Users/vuquangthinh/Documents/redtab-design-system/`

### Phase Completion

- [ ] All Wave 1 tasks (1.1-1.6) complete
- [ ] All Wave 2 tasks (2.1-2.8) complete
- [ ] All Wave 3 tasks (3.1-3.8) complete
- [ ] PHASE-SUMMARY.md verification checklist 100% passing
- [ ] Ready for Phase 2: Build Infrastructure

---

## The Blueprints

### Plan 01: Foundation Setup (Wave 1, ~30 min)

Creates configuration files that all subsequent phases depend on:

```
Task 1.1: package.json (dependencies, exports, scripts)
Task 1.2: tsconfig.json (TypeScript strict + isolatedDeclarations)
Task 1.3: vite.config.ts (Vite library build ESM + CJS)
Task 1.4: vitest.config.ts (Test environment jsdom)
Task 1.5: postcss.config.cjs (Tailwind CSS pipeline)
Task 1.6: Directory structure (src/, .storybook/, tests/)
```

**Output:** Configuration files ready for Wave 2 content

---

### Plan 02: Design Tokens & Tailwind (Wave 2, ~45 min)

Creates the design token system and integrates with Tailwind:

```
Task 2.1: colors.ts (primary, neutral, semantic)
Task 2.2: spacing.ts (4px-based scale)
Task 2.3: typography.ts (sizes, weights, styles)
Task 2.4: shadows.ts (elevation system)
Task 2.5: tokens/index.ts (barrel export)
Task 2.6: tailwind.config.ts (token integration)
Task 2.7: src/index.ts (main entry point)
Task 2.8: tests/setup.ts (test setup)
```

**Output:** Complete design token system, Tailwind configured

---

### Plan 03: Build Validation (Wave 3, ~30 min)

Validates the entire build pipeline works end-to-end:

```
Task 3.1: npm install (resolve dependencies)
Task 3.2: TypeScript check (type safety validation)
Task 3.3: Vite build (create dist/ ESM + CJS)
Task 3.4: Validate declarations (.d.ts files)
Task 3.5: Validate exports (package.json paths)
Task 3.6: .gitignore (exclude build artifacts)
Task 3.7: Vitest setup (test environment ready)
Task 3.8: Git verification (build artifacts not tracked)
```

**Output:** Production-ready build artifacts, validated distribution

---

## Key Architecture Decisions

### Design Tokens Architecture

```typescript
// All design tokens defined in TypeScript
export const colors = { primary: { 500: '#0ea5e9', ... } } as const;
export const spacing = { 1: '4px', 2: '8px', ... } as const;
export const typography = { h1: { fontSize: '60px', ... } } as const;
export const shadows = { sm: '0 1px 2px...', ... } as const;

// Vite builds to dual outputs:
// dist/esm/index.js  (modern bundlers)
// dist/cjs/index.cjs (Node.js CommonJS)

// Tailwind config imports tokens:
import { colors, spacing, ... } from './src/tokens';
theme: { extend: { colors, spacing, ... } }

// Result: No arbitrary values, all utilities token-powered
```

### Build Pipeline

```
Wave 1: Configuration
   ↓
Wave 2: Design Tokens + Tailwind Integration
   ↓
Wave 3: Build Validation
   ↓
dist/esm/  +  dist/cjs/  (Production-ready outputs)
```

---

## What Gets Built

### By the End of Phase 1

**Configuration Files (8 files):**
- package.json — Dependencies, exports, scripts
- tsconfig.json — Type safety configuration
- vite.config.ts — Build configuration
- vitest.config.ts — Test configuration
- postcss.config.cjs — CSS processing
- tailwind.config.ts — Tailwind theme with tokens
- src/index.ts — Main entry point
- tests/setup.ts — Test setup

**Design Tokens (5 files):**
- src/tokens/colors.ts — Color palette
- src/tokens/spacing.ts — Spacing scale
- src/tokens/typography.ts — Typography system
- src/tokens/shadows.ts — Shadow system
- src/tokens/index.ts — Barrel export

**Other Files:**
- .gitignore — Git configuration
- dist/esm/ — ESM build output (auto-generated)
- dist/cjs/ — CJS build output (auto-generated)
- node_modules/ — Dependencies (auto-generated)
- package-lock.json — Lock file (auto-generated)

**Total: 13 source files + 5 auto-generated directories**

---

## Decision Traceability

Every decision in this phase is backed by research. See 01-RESEARCH.md for:

- Why TypeScript `as const` for design tokens
- Why Vite 8 over Webpack/Rollup
- Why TypeScript strict mode + isolatedDeclarations
- Why Tailwind CSS integration (not CSS-in-JS)
- Why dual ESM/CJS distribution
- Common pitfalls and how we avoid them

---

## Verification & Quality Gates

### Wave 1 Verification
- [ ] All config files created with correct structure
- [ ] package.json valid JSON with correct exports
- [ ] tsconfig.json enforces strict mode
- [ ] vite.config.ts configures dual outputs
- [ ] Directories created

### Wave 2 Verification
- [ ] All token files created with correct values
- [ ] Token exports are typed (`as const`)
- [ ] tailwind.config.ts imports tokens
- [ ] src/index.ts exports tokens
- [ ] TypeScript type check passes

### Wave 3 Verification
- [ ] npm install succeeds
- [ ] TypeScript check passes (`npx tsc --noEmit`)
- [ ] Vite build succeeds (`npm run build`)
- [ ] dist/esm/ and dist/cjs/ exist with correct structure
- [ ] .d.ts files generated in both outputs
- [ ] package.json exports resolve
- [ ] Vitest environment ready
- [ ] Build artifacts ignored by git

---

## Transition to Phase 2

When Phase 1 is complete, proceed to Phase 2: Build Infrastructure

Phase 2 will:
- ✅ Set up Storybook 10.3+ with React preset
- ✅ Configure Chromatic visual regression testing
- ✅ Establish story patterns and documentation structure
- ✅ Configure npm publishing workflow

Phase 2 depends on Phase 1 being 100% complete.

---

## Support

### If Something Goes Wrong

1. **Read the task acceptance criteria** — They define what "done" looks like
2. **Check the verification step** — Run it to see what's wrong
3. **Consult 01-RESEARCH.md** — It explains the "why" behind every decision
4. **Review PHASE-SUMMARY.md** — It has a troubleshooting section

### Common Issues

- **npm install fails** → Check package.json JSON syntax
- **TypeScript errors** → isolatedDeclarations enabled? All exports have types?
- **Vite build fails** → Does src/index.ts exist? Is it exporting tokens?
- **Build artifacts committed** → Create .gitignore with "dist/" entry

---

## Document Map

```
README.md (this file)
  ├─ Start here for overview
  └─ Navigation guide
  
INDEX.md
  ├─ Quick reference
  ├─ Document glossary
  ├─ Execution checklist
  ├─ Key file reference
  └─ Troubleshooting
  
PHASE-SUMMARY.md
  ├─ Complete architecture
  ├─ Wave structure & dependencies
  ├─ Design token architecture details
  ├─ Build config details
  ├─ Risk analysis
  └─ Commitment summary
  
01-RESEARCH.md
  ├─ Technology decisions backed by research
  ├─ Version numbers verified
  ├─ Architecture patterns
  ├─ Don't hand-roll guide
  ├─ Common pitfalls & mitigation
  └─ Reference documentation
  
01-PLAN.md, 02-PLAN.md, 03-PLAN.md
  ├─ Executable task specifications
  ├─ Acceptance criteria for each task
  ├─ Verification commands
  ├─ What files get created
  └─ Dependencies between tasks
```

---

## Final Checklist Before Starting

- [ ] Read INDEX.md (quick reference)
- [ ] Read PHASE-SUMMARY.md (understand architecture)
- [ ] Node.js 20+ verified
- [ ] npm 10+ verified
- [ ] Git initialized
- [ ] Working directory correct
- [ ] Ready to start Wave 1 (Task 1.1)

---

## Credits

**Phase 1 Planning Package**
- Research: 01-RESEARCH.md (comprehensive domain research, verified against current docs)
- Architecture: PHASE-SUMMARY.md (phase overview, wave structure, key decisions)
- Execution: 01-PLAN.md, 02-PLAN.md, 03-PLAN.md (granular task breakdown with acceptance criteria)

All decisions traced to research. All tasks have acceptance criteria. All acceptance criteria are grep-verifiable or command-verifiable.

---

**Status:** ✅ Ready for Execution  
**Last Updated:** 2026-03-31  
**Next Phase:** 02-build-infrastructure (depends on Phase 1 complete)

Start with INDEX.md or PHASE-SUMMARY.md. Then execute 01-PLAN.md, 02-PLAN.md, 03-PLAN.md in wave order.
