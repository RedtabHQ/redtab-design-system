---
wave: 1
depends_on: []
files_modified:
  - package.json
  - tsconfig.json
  - vite.config.ts
  - vitest.config.ts
  - postcss.config.cjs
autonomous: true
requirements:
  - FOUND-01
  - FOUND-02
  - FOUND-04
  - FOUND-05
---

# Phase 1, Plan 1: Foundation Setup & Configuration

## Objective

Establish the foundational infrastructure for the Redtab Design System: TypeScript configuration with strict mode and isolatedDeclarations, Vite 8 build setup with dual ESM/CJS outputs, and initial project structure. This creates the baseline upon which all subsequent components depend.

**Purpose:** Ensure build tooling, type safety, and distribution pipeline are correctly configured before design tokens and components are created.

**Output:**
- package.json with proper exports, dependencies, and scripts
- TypeScript 5.5 configuration with strict mode and isolatedDeclarations enabled
- Vite 8 library build configuration for ESM and CommonJS dual outputs
- Vitest test runner configuration with React Testing Library
- PostCSS configuration for Tailwind CSS pipeline
- Initial project directory structure ready for component development

## Execution Context

This is Wave 1 (foundation) work. All tasks in this plan are independent and must complete before Wave 2 (design tokens and Tailwind configuration).

## Context

This plan assumes:
- Working directory: `/Users/vuquangthinh/Documents/redtab-design-system/`
- Git repository initialized and ready for commits
- Node.js 20+ and npm 10+ available
- Research completed: all version numbers and architecture decisions are validated in 01-RESEARCH.md

## Tasks

<task id="1.1" name="Initialize package.json with dependencies and exports">
<read_first>
- 01-RESEARCH.md (section: Package.json Configuration, lines 545-634)
- Verify npm versions: npm view react version, npm view vite version
</read_first>

<action>
Create package.json in project root with:

1. **Metadata:**
   - name: "@redtabhq/design-system"
   - version: "0.1.0"
   - description: "Redtab Design System: React components, design tokens, and utilities"
   - type: "module" (ESM by default)
   - license: "MIT"

2. **Entry Points (package.json exports field):**
   - main: "./dist/cjs/index.cjs" (CommonJS consumers)
   - module: "./dist/esm/index.js" (ESM/bundlers)
   - types: "./dist/esm/index.d.ts" (TypeScript)
   - exports field with conditional imports for ESM and CommonJS
   - Ensure both ESM and CJS variants have types field pointing to correct .d.ts location

3. **Files for npm publish:**
   - files: ["dist"] (only distribute build output)
   - sideEffects: false (enable tree-shaking)

4. **Scripts:**
   - build: "vite build"
   - dev: "vite" (for development/testing)
   - test: "vitest"
   - type-check: "tsc --noEmit"

5. **Dependencies (exact versions from 01-RESEARCH.md):**
   - devDependencies: typescript@6.0.2, vite@8.0.3, @vitejs/plugin-react@4.0.0+, vitest@4.1.2+, react@19.2.4, react-dom@19.2.4, tailwindcss@3.4.1+, postcss@8.4.0+, autoprefixer@10.4.0+, jsdom@23.0.0+, @testing-library/react@14.0.0+, @testing-library/jest-dom@6.1.0+, @radix-ui/primitive@1.0.0+
   - peerDependencies: react@^18.0.0, react-dom@^18.0.0, tailwindcss@^3.4.0

6. **Do NOT include:** ESLint, Prettier, or other code quality tools (Phase 7)

Use the exact structure from 01-RESEARCH.md lines 549-619. If any version differs from npm latest, verify with `npm view [package] version` and use the latest stable version.
</action>

<acceptance_criteria>
- `grep -q '"name": "@redtabhq/design-system"' package.json`
- `grep -q '"type": "module"' package.json`
- `grep -q '"main": "./dist/cjs/index.cjs"' package.json`
- `grep -q '"module": "./dist/esm/index.js"' package.json`
- `grep -q '"exports"' package.json`
- `jq '.scripts.build' package.json | grep "vite build"`
- `jq '.devDependencies.typescript' package.json | grep "6.0"`
- `jq '.devDependencies.vite' package.json | grep "8.0"`
- `jq '.peerDependencies.react' package.json | grep "^18.0.0"`
</acceptance_criteria>

<verify>
npm install --dry-run (verify package.json is syntactically valid JSON and all versions resolve)
</verify>

<done>
package.json exists with correct metadata, exports, dependencies, and build scripts. All dependencies can be resolved by npm.
</done>
</task>

<task id="1.2" name="Configure TypeScript 5.5 with strict mode and isolatedDeclarations">
<read_first>
- 01-RESEARCH.md (section: TypeScript 5.5 Configuration, lines 418-464)
- TypeScript documentation on isolatedDeclarations: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
</read_first>

<action>
Create tsconfig.json in project root with:

1. **compilerOptions:**
   - target: "ES2020"
   - lib: ["ES2020", "DOM", "DOM.Iterable"]
   - module: "ESNext"
   - moduleResolution: "bundler"
   - resolveJsonModule: true
   - allowJs: false
   - strict: true (enables all strict checks including noImplicitAny, strictNullChecks)
   - noUncheckedIndexedAccess: true
   - noImplicitAny: true
   - noImplicitThis: true
   - skipLibCheck: true
   - esModuleInterop: true
   - declaration: true (generate .d.ts files)
   - declarationMap: true (sourcemaps for .d.ts)
   - sourceMap: true (sourcemaps for .ts)
   - outDir: "./dist"
   - isolatedDeclarations: true (CRITICAL: TS 5.5 feature; forces explicit types on exports)
   - jsx: "react-jsx" (React 17+ transform)
   - forceConsistentCasingInFileNames: true

2. **include:** ["src"]

3. **exclude:** ["node_modules", "dist", "**/*.stories.tsx", "**/*.test.ts", "**/*.test.tsx"]

Key decision: isolatedDeclarations: true enforces explicit type annotations on all exported symbols. This prevents hidden API surface and makes the library contract explicit.
</action>

<acceptance_criteria>
- `jq '.compilerOptions.strict' tsconfig.json` returns true
- `jq '.compilerOptions.isolatedDeclarations' tsconfig.json` returns true
- `jq '.compilerOptions.target' tsconfig.json | grep "ES2020"`
- `jq '.compilerOptions.jsx' tsconfig.json | grep "react-jsx"`
- `jq '.compilerOptions.declaration' tsconfig.json` returns true
- `jq '.include[0]' tsconfig.json | grep "src"`
</acceptance_criteria>

<verify>
npx tsc --noEmit (should succeed with no errors if project structure exists; if not, check that tsconfig.json is valid by parsing with jq)
</verify>

<done>
tsconfig.json exists with strict mode and isolatedDeclarations enabled. All critical type-safety settings configured correctly.
</done>
</task>

<task id="1.3" name="Configure Vite 8 library build with ESM and CommonJS outputs">
<read_first>
- 01-RESEARCH.md (section: Vite 8 Build Configuration, lines 467-541)
- package.json exports field (from previous task)
</read_first>

<action>
Create vite.config.ts in project root with:

1. **Import statements:**
   - defineConfig from 'vite'
   - react from '@vitejs/plugin-react'
   - path from 'path'

2. **Configuration object:**
   - plugins: [react()] (React JSX support)
   - build.lib:
     - entry: path.resolve(__dirname, 'src/index.ts')
     - name: 'RedtabDS'
     - formats: ['es', 'cjs']

   - build.rollupOptions:
     - external: ['react', 'react-dom'] (do NOT bundle React; consumers install as peer dependencies)
     - output array with two objects:
       - ESM output: format 'es', dir 'dist/esm', entryFileNames '[name].js', preserveModules true
       - CJS output: format 'cjs', dir 'dist/cjs', entryFileNames '[name].cjs', preserveModules true

   - build settings:
     - reportCompressedSize: true
     - chunkSizeWarningLimit: 500

3. **Why these settings:**
   - entry src/index.ts: barrel export defines public API
   - formats ['es', 'cjs']: dual outputs for modern and legacy consumers
   - external ['react', 'react-dom']: prevent bundling React (reduces size, avoids conflicts)
   - preserveModules true: keep directory structure in dist/ (enables tree-shaking)

Note: Do NOT create src/index.ts file in this task; that's Wave 2.
</action>

<acceptance_criteria>
- `grep -q "defineConfig" vite.config.ts`
- `grep -q "lib.*entry.*src/index.ts" vite.config.ts`
- `grep -q "formats.*es.*cjs" vite.config.ts`
- `grep -q "external.*react" vite.config.ts`
- `grep -q "preserveModules.*true" vite.config.ts`
- `grep -q "dir.*dist/esm" vite.config.ts`
- `grep -q "dir.*dist/cjs" vite.config.ts`
</acceptance_criteria>

<verify>
npx vite build --help (verify Vite CLI is installed and recognizes build command; actual build will fail because src/index.ts doesn't exist yet, which is expected)
</verify>

<done>
vite.config.ts exists with library mode configuration for ESM and CommonJS dual outputs. Rollup options correctly mark react/react-dom as external and configure preserveModules for tree-shaking.
</done>
</task>

<task id="1.4" name="Configure Vitest for unit testing with jsdom and React Testing Library">
<read_first>
- 01-RESEARCH.md (section: Standard Stack, lines 38-56 for test setup)
- Research file mentions Vitest 4.1.2 as standard
</read_first>

<action>
Create vitest.config.ts in project root with:

1. **Import statements:**
   - defineConfig from 'vitest/config'
   - react from '@vitejs/plugin-react'

2. **Configuration object:**
   - Extend Vite config: include plugins: [react()]
   - test settings:
     - environment: 'jsdom' (simulate DOM in Node.js for component testing)
     - globals: true (use Vitest globals; no need to import describe, it, expect)
     - setupFiles: ['./tests/setup.ts'] (point to test setup file)
     - coverage (optional for Phase 1, but good to declare):
       - provider: 'v8'
       - reporter: ['text', 'json', 'html']

3. **Why these settings:**
   - jsdom: needed for React components that need DOM (useEffect, event handlers, etc.)
   - globals: true: cleaner test syntax
   - setupFiles: allows importing React Testing Library matchers (toBeInTheDocument, etc.)

Note: tests/setup.ts will be created in Wave 2.
</action>

<acceptance_criteria>
- `grep -q "defineConfig" vitest.config.ts`
- `grep -q "environment.*jsdom" vitest.config.ts`
- `grep -q "globals.*true" vitest.config.ts`
- `grep -q "setupFiles" vitest.config.ts`
</acceptance_criteria>

<verify>
npx vitest --help (verify Vitest CLI is installed and recognizes test command)
</verify>

<done>
vitest.config.ts exists with jsdom environment, globals enabled, and setupFiles configured. Ready for unit tests in subsequent waves.
</done>
</task>

<task id="1.5" name="Configure PostCSS for Tailwind CSS compilation">
<read_first>
- 01-RESEARCH.md (section: Supporting Libraries, lines 42-48)
- Tailwind CSS documentation on PostCSS setup
</read_first>

<action>
Create postcss.config.cjs in project root (must be .cjs since package.json is ESM):

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**Why CommonJS (.cjs)?**
- package.json declares type: "module" (ESM)
- PostCSS expects CommonJS config by default
- Using .cjs explicitly signals this file uses CommonJS

**Why these plugins?**
- tailwindcss: processes Tailwind CSS directives (@tailwind, @layer, @apply)
- autoprefixer: adds vendor prefixes for browser compatibility (e.g., -webkit-*, -moz-*)

This allows Tailwind to be processed during Vite build and Storybook development.
</action>

<acceptance_criteria>
- `grep -q "tailwindcss" postcss.config.cjs`
- `grep -q "autoprefixer" postcss.config.cjs`
- `file postcss.config.cjs | grep -q "ASCII text"`
</acceptance_criteria>

<verify>
ls -la postcss.config.cjs && file postcss.config.cjs (verify file exists and is text)
</verify>

<done>
postcss.config.cjs exists with tailwindcss and autoprefixer plugins configured. Tailwind CSS compilation pipeline is ready.
</done>
</task>

<task id="1.6" name="Create initial project directory structure">
<read_first>
- 01-RESEARCH.md (section: Recommended Project Structure, lines 97-146)
</read_first>

<action>
Create the following directories in project root (use `mkdir -p` to create parents):

1. **src/tokens** - Design token definitions (Phase 2)
2. **src/components** - React components (Phase 3+)
3. **src/hooks** - Custom React hooks (Phase 6)
4. **src/utils** - Utility functions (Phase 6)
5. **.storybook** - Storybook configuration (Phase 2)
6. **tests** - Unit test setup and mocks (Phase 2)

These directories are all necessary prerequisites. We will NOT create files in them yet (placeholder files will be added in Wave 2), but the structure must exist so that developers understand the intended organization.

Command sequence:
```bash
mkdir -p src/tokens src/components src/hooks src/utils
mkdir -p .storybook
mkdir -p tests
```

Verify each directory exists after creation.
</action>

<acceptance_criteria>
- `[ -d src/tokens ] && echo "exists"`
- `[ -d src/components ] && echo "exists"`
- `[ -d src/hooks ] && echo "exists"`
- `[ -d src/utils ] && echo "exists"`
- `[ -d .storybook ] && echo "exists"`
- `[ -d tests ] && echo "exists"`
</acceptance_criteria>

<verify>
find . -type d -name "tokens" -o -type d -name "components" -o -type d -name "hooks" -o -type d -name "utils" (verify all required directories exist)
</verify>

<done>
All project directories created and ready for component development. Directory structure follows research recommendations.
</done>
</task>

</tasks>

## Verification

After all tasks complete, verify the foundation is correctly set up:

1. **Configuration files exist:**
   - `[ -f package.json ] && [ -f tsconfig.json ] && [ -f vite.config.ts ] && [ -f vitest.config.ts ] && [ -f postcss.config.cjs ]`

2. **package.json is valid and exports are correct:**
   - `jq '.exports' package.json | grep -q "import"`
   - `jq '.exports' package.json | grep -q "require"`

3. **TypeScript strict mode enabled:**
   - `jq '.compilerOptions.strict' tsconfig.json | grep -q "true"`

4. **Vite exports are dual-output:**
   - `grep -q "dist/esm" vite.config.ts && grep -q "dist/cjs" vite.config.ts`

5. **All directories created:**
   - `ls -d src/tokens src/components src/hooks src/utils .storybook tests` (all should list without error)

## Success Criteria

Phase 1, Plan 1 is complete when:

1. **package.json** is properly configured with ESM/CJS exports, correct versions, and build scripts
2. **tsconfig.json** enforces strict mode and isolatedDeclarations
3. **vite.config.ts** configures library build with dual ESM/CJS outputs and preserveModules
4. **vitest.config.ts** configures testing environment with jsdom
5. **postcss.config.cjs** sets up Tailwind CSS compilation pipeline
6. **Project directory structure** is in place (src/tokens, src/components, src/hooks, src/utils, .storybook, tests)
7. **npm install** can be run without errors (once package.json is committed)

## Output

Create `.planning/phases/01-foundation-design-tokens/01-PLAN-SUMMARY.md` after execution with:
- List of created files
- npm install output (or error if any)
- Verification of each config file's key settings
- Next steps (proceed to Wave 2: Design tokens and Tailwind configuration)
