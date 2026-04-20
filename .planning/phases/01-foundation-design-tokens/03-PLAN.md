---
wave: 3
depends_on: ["01-foundation-design-tokens-01", "01-foundation-design-tokens-02"]
files_modified:
  - package.json
  - src/index.ts
  - .gitignore
autonomous: true
requirements:
  - FOUND-01
  - FOUND-02
  - FOUND-04
  - FOUND-05
---

# Phase 1, Plan 3: Build Validation & Entry Point Configuration

## Objective

Verify the Vite 8 build configuration produces correct ESM and CommonJS outputs, validate that package.json exports resolve correctly, ensure TypeScript compilation succeeds, and prepare the library for distribution. This plan validates that Phase 1 infrastructure is production-ready.

**Purpose:** Ensure the build pipeline works end-to-end; validate design tokens are correctly typed and exported; confirm dual ESM/CJS outputs are generated.

**Output:**
- Successful `npm run build` producing dist/esm/ and dist/cjs/ with correct structure
- dist/package.json with exports configuration (conditional exports)
- Validated TypeScript declarations (.d.ts files) in both dist/esm and dist/cjs
- .gitignore configured to exclude build artifacts and node_modules
- Build validation: manual checks that imports resolve correctly

## Execution Context

This is Wave 3 work. Depends on Waves 1 and 2 (all configuration and design tokens complete).

## Context

Prerequisites:
- Wave 1 complete: package.json, tsconfig.json, vite.config.ts, vitest.config.ts, postcss.config.cjs
- Wave 2 complete: all design tokens created, tailwind.config.ts, src/index.ts
- npm dependencies installed: `npm install`

## Tasks

<task id="3.1" name="Run npm install and verify all dependencies resolve">
<read_first>
- package.json from Wave 1
- 01-RESEARCH.md (section: Standard Stack, lines 28-91)
</read_first>

<action>
Execute npm install to install all project dependencies:

```bash
npm install
```

This command will:
1. Download all dependencies listed in package.json (react, typescript, vite, tailwindcss, etc.)
2. Create node_modules/ directory
3. Create package-lock.json with pinned versions
4. Verify all versions resolve correctly

Verify installation succeeded:
- node_modules/ directory exists and contains >1000 packages
- package-lock.json created
- No installation errors or warnings about missing peer dependencies

If npm install fails:
1. Check package.json for syntax errors: `jq . package.json`
2. Verify versions are resolvable: `npm view [package] version`
3. Check npm cache: `npm cache clean --force` and retry

Note: This task takes 2-5 minutes depending on internet connection.
</action>

<acceptance_criteria>
- `[ -d node_modules ] && [ $(find node_modules -type d | wc -l) -gt 100 ]` (node_modules has >100 directories)
- `[ -f package-lock.json ]` (lock file created)
- `npm ls --depth=0` should list all top-level dependencies without errors
</acceptance_criteria>

<verify>
npm ls --depth=0 (list top-level dependencies; should show react, typescript, vite, tailwindcss, etc.)
</verify>

<done>
npm install succeeded. All dependencies resolved. node_modules created with lock file.
</done>
</task>

<task id="3.2" name="Run TypeScript type check on entire project">
<read_first>
- tsconfig.json from Wave 1
- All source files created in Waves 1-2
- 01-RESEARCH.md (section: TypeScript 5.5 Configuration, lines 418-464)
</read_first>

<action>
Execute TypeScript compiler in check-only mode:

```bash
npx tsc --noEmit
```

This command will:
1. Check all TypeScript files in src/ (based on tsconfig.json include)
2. Verify types match; catch any implicit any or type mismatches
3. NOT produce any output files (--noEmit flag)
4. Report errors if any exist

Expected result: No errors. Zero output (silent success).

If errors occur:
1. Read error messages carefully; they identify the file and line number
2. Check that isolatedDeclarations is enabled in tsconfig.json
3. Verify all exported functions/variables have explicit type annotations
4. Check that token imports in tailwind.config.ts and src/index.ts are correct

Common errors:
- "Cannot find module": Check import paths are relative and correct (e.g., './colors' not './colors.ts')
- "Type 'any' implicitly": Check that all exports have explicit return types
- "Object is of type 'unknown'": Check that destructured values from imports are properly typed
</action>

<acceptance_criteria>
- `npx tsc --noEmit 2>&1 | grep -v "^Found 0"` (no errors; should only output "Found 0 errors")
- Exit code should be 0 (success)
</acceptance_criteria>

<verify>
npx tsc --noEmit && echo "TypeScript check passed" (should print "TypeScript check passed")
</verify>

<done>
TypeScript type checking passed. No type errors. All files have correct types.
</done>
</task>

<task id="3.3" name="Build Vite library to dist/ with ESM and CommonJS outputs">
<read_first>
- vite.config.ts from Wave 1 (build configuration)
- package.json from Wave 1 (build script)
- src/index.ts from Wave 2 (entry point)
- 01-RESEARCH.md (section: Vite 8 Build Configuration, lines 467-541)
</read_first>

<action>
Execute Vite build command:

```bash
npm run build
```

This command will:
1. Read vite.config.ts library configuration
2. Bundle src/index.ts and all imports (tokens, types)
3. Generate TypeScript declarations (.d.ts files)
4. Output ESM bundle to dist/esm/
5. Output CommonJS bundle to dist/cjs/
6. Generate source maps for debugging
7. Report bundle size

Expected outputs:
- dist/esm/index.js (ESM entry point)
- dist/esm/index.d.ts (TypeScript declarations for ESM)
- dist/esm/index.d.ts.map (declaration source map)
- dist/esm/tokens/ (token modules in ESM format)
- dist/cjs/index.cjs (CommonJS entry point)
- dist/cjs/index.d.ts (TypeScript declarations for CJS)
- dist/cjs/tokens/ (token modules in CommonJS format)

Verify build succeeded:
- dist/ directory exists
- Both dist/esm/ and dist/cjs/ directories exist
- No build errors reported
- Bundle size is reasonable (for tokens only, <50 KB gzipped)

If build fails:
1. Check Vite config: vite.config.ts must have entry: src/index.ts
2. Verify src/index.ts exists and exports tokens
3. Check TypeScript errors: run `npx tsc --noEmit` first
4. Verify token imports in src/index.ts are correct

Expected build output example:
```
vite v8.0.3 building for production...
✓ 24 modules transformed.
dist/esm/index.js    18.45 kB / gzip: 4.32 kB
dist/cjs/index.cjs   19.02 kB / gzip: 4.41 kB
```
</action>

<acceptance_criteria>
- `[ -d dist/esm ] && [ -f dist/esm/index.js ] && [ -f dist/esm/index.d.ts ]` (ESM output exists)
- `[ -d dist/cjs ] && [ -f dist/cjs/index.cjs ] && [ -f dist/cjs/index.d.ts ]` (CJS output exists)
- `[ -d dist/esm/tokens ] && [ -f dist/esm/tokens/index.js ]` (token modules in ESM)
- `[ -d dist/cjs/tokens ] && [ -f dist/cjs/tokens/index.cjs ]` (token modules in CJS)
- Build completes with no errors (check exit code: $? should be 0)
</acceptance_criteria>

<verify>
ls -lh dist/esm/index.js dist/cjs/index.cjs (verify both ESM and CJS entry points exist and have reasonable size >1 KB)
</verify>

<done>
Vite build completed successfully. ESM and CommonJS outputs generated. dist/ directory structure matches vite.config.ts configuration.
</done>
</task>

<task id="3.4" name="Validate TypeScript declarations are generated correctly">
<read_first>
- dist/esm/index.d.ts and dist/cjs/index.d.ts (generated in task 3.3)
- src/tokens/colors.ts, spacing.ts, typography.ts, shadows.ts (source of truth)
- 01-RESEARCH.md (section: TypeScript 5.5 Configuration, lines 418-464)
</read_first>

<action>
Validate that .d.ts files were generated and contain correct type exports:

1. **Verify ESM declarations:**
   ```bash
   head -50 dist/esm/index.d.ts
   ```
   Should show re-exports like:
   ```typescript
   export { colors } from './tokens';
   export { spacing } from './tokens';
   export type { ColorToken } from './tokens';
   export type { SpacingToken } from './tokens';
   ```

2. **Verify token type definitions:**
   ```bash
   head -100 dist/esm/tokens/colors.d.ts
   ```
   Should show ColorToken type with recursive properties:
   ```typescript
   export declare const colors: { ... };
   export type ColorToken = typeof colors;
   ```

3. **Verify CommonJS declarations exist:**
   ```bash
   ls -la dist/cjs/*.d.ts dist/cjs/tokens/*.d.ts
   ```
   Should list .d.ts files in both locations

4. **Spot-check that colors type is accessible:**
   The type should include primary.500, neutral.900, etc. properties for IDE autocomplete.

If .d.ts files are missing or empty:
- Check tsconfig.json: declaration: true must be set
- Check vite.config.ts: build rollupOptions should not exclude .d.ts
- Run TypeScript compiler directly: `npx tsc` (without --noEmit) to debug
</action>

<acceptance_criteria>
- `grep -q "export.*colors.*from" dist/esm/index.d.ts` (re-export colors)
- `grep -q "export type.*ColorToken" dist/esm/index.d.ts` (re-export ColorToken type)
- `[ -f dist/esm/tokens/colors.d.ts ]` (token type declarations exist)
- `grep -q "readonly.*primary.*500" dist/esm/tokens/colors.d.ts` (color properties are typed)
- `[ -f dist/cjs/index.d.ts ] && [ -f dist/cjs/tokens/colors.d.ts ]` (CJS declarations exist)
</acceptance_criteria>

<verify>
grep "export" dist/esm/index.d.ts (should list all re-exports)
</verify>

<done>
TypeScript declarations generated correctly in both ESM and CommonJS outputs. Color types and other tokens have proper type definitions for IDE autocomplete.
</done>
</task>

<task id="3.5" name="Test that package.json exports resolve correctly">
<read_first>
- package.json (exports field from Wave 1)
- dist/ directory (from task 3.3)
- 01-RESEARCH.md (section: Package.json Configuration, lines 545-634)
</read_first>

<action>
Validate that package.json conditional exports point to correct files:

1. **Check exports field:**
   ```bash
   jq '.exports' package.json
   ```
   Should show:
   ```json
   {
     ".": {
       "import": { "types": "./dist/esm/index.d.ts", "default": "./dist/esm/index.js" },
       "require": { "types": "./dist/cjs/index.d.ts", "default": "./dist/cjs/index.cjs" }
     },
     "./package.json": "./package.json"
   }
   ```

2. **Verify all export paths exist:**
   ```bash
   [ -f dist/esm/index.js ] && echo "ESM entry exists"
   [ -f dist/esm/index.d.ts ] && echo "ESM types exist"
   [ -f dist/cjs/index.cjs ] && echo "CJS entry exists"
   [ -f dist/cjs/index.d.ts ] && echo "CJS types exist"
   ```

3. **Test import resolution (optional, requires test app):**
   - In a separate directory, create test.mjs: `import * as DS from '@redtabhq/design-system/dist/esm/index.js'`
   - Run: `node test.mjs` (should not error)
   - This verifies the ESM export works

If exports are incorrect:
- Check package.json for typos in paths
- Verify dist/ files exist where exports point
- Use `npm view @redtabhq/design-system files` (when published) to verify file list

Note: Full npm package resolution testing happens in Phase 2 when publishing.
</action>

<acceptance_criteria>
- `jq '.exports["."].import.default' package.json | grep "dist/esm/index.js"`
- `jq '.exports["."].require.default' package.json | grep "dist/cjs/index.cjs"`
- `[ -f dist/esm/index.js ] && [ -f dist/esm/index.d.ts ]` (ESM files exist)
- `[ -f dist/cjs/index.cjs ] && [ -f dist/cjs/index.d.ts ]` (CJS files exist)
</acceptance_criteria>

<verify>
jq '.exports' package.json (show exports configuration)
</verify>

<done>
package.json exports field points to correct files in dist/. ESM and CommonJS entry points are correctly configured.
</done>
</task>

<task id="3.6" name="Create .gitignore to exclude build artifacts and node_modules">
<read_first>
- Standard Node.js .gitignore patterns
- Vite build output (dist/, .vite)
- Node package manager files (node_modules/, package-lock.json)
</read_first>

<action>
Create .gitignore in project root with:

```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build outputs
dist/
.vite/
coverage/

# IDE and editor files
.vscode/
.idea/
*.swp
*.swo
*~

# OS files
.DS_Store
Thumbs.db

# Storybook
storybook-static/

# Environment
.env
.env.local
```

**Why these entries:**
- node_modules/: Dependencies should not be versioned (package.json + package-lock.json sufficient)
- dist/: Build output regenerated from source; not versioned
- .vscode/, .idea/: IDE config is personal; not shared
- .DS_Store, Thumbs.db: OS artifacts
- storybook-static/: Storybook build output (Phase 2)
- .env: Environment secrets should never be versioned

**Do NOT gitignore:**
- src/: Source code must be versioned
- package.json, package-lock.json: These define the project state
- tsconfig.json, vite.config.ts, etc.: Configuration must be versioned
</action>

<acceptance_criteria>
- `[ -f .gitignore ]` (file exists)
- `grep -q "node_modules" .gitignore`
- `grep -q "dist/" .gitignore`
- `grep -q ".vscode" .gitignore`
- `grep -q ".env" .gitignore`
</acceptance_criteria>

<verify>
cat .gitignore (show contents; should include node_modules/, dist/, .vscode/, .env)
</verify>

<done>
.gitignore created with standard Node.js/Vite entries. Build artifacts, node_modules, and IDE files excluded from git.
</done>
</task>

<task id="3.7" name="Run Vitest to verify test environment is working">
<read_first>
- vitest.config.ts from Wave 1
- tests/setup.ts from Wave 2
- vitest documentation: https://vitest.dev/
</read_first>

<action>
Execute Vitest to verify test environment is configured correctly:

```bash
npm test -- --run --reporter=verbose
```

This command will:
1. Load vitest.config.ts
2. Configure jsdom environment
3. Load tests/setup.ts (React Testing Library setup)
4. Scan for test files (*.test.ts, *.test.tsx)
5. Report any tests found (should be 0 in Phase 1)

Expected output:
```
No test files found
```

This is expected and correct; Phase 1 is infrastructure only. Actual component tests come in Phase 3+.

Verify vitest is working:
- No errors in configuration
- jsdom environment loads correctly
- React Testing Library matchers available (from tests/setup.ts)

If vitest fails:
- Check vitest.config.ts: environment must be 'jsdom'
- Verify tests/ directory exists and setup.ts is there
- Check dependencies: vitest, jsdom, @testing-library/react all installed
</action>

<acceptance_criteria>
- `npm test -- --run --reporter=verbose` exits with code 0 (success)
- Output should show either "No test files found" or "0 passed"
</acceptance_criteria>

<verify>
npm test -- --run (run test suite; should find no tests but report success)
</verify>

<done>
Vitest environment configured and working. Test setup ready for Phase 3+ component tests.
</done>
</task>

<task id="3.8" name="Verify build artifacts are not committed to git">
<read_first>
- .gitignore created in task 3.6
- git status command
</read_first>

<action>
Verify that build artifacts (dist/, node_modules/) are correctly ignored by git:

```bash
git status
```

Check output:
- dist/ should NOT appear in "Changes not staged" or "Untracked files"
- node_modules/ should NOT appear
- .gitignore should appear as a new file ready to commit

If build artifacts are showing in git status:
1. Verify .gitignore was created with correct patterns
2. If dist/ was already tracked, remove it: `git rm -r --cached dist/ && git commit -m "Remove dist from tracking"`
3. Verify: `git status` should no longer show dist/ in untracked files

Expected git status output (before final commit):
```
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        .gitignore
        package-lock.json
        package.json
        postcss.config.cjs
        src/
        tailwind.config.ts
        tests/
        tsconfig.json
        vite.config.ts
        vitest.config.ts
```

Note: dist/ should NOT be listed (it's ignored by .gitignore)
</action>

<acceptance_criteria>
- `git status | grep -q dist` returns false (dist/ not shown in git status)
- `git status | grep -q node_modules` returns false (node_modules/ not shown)
- `git status | grep -q ".gitignore"` returns true (.gitignore is tracked)
</acceptance_criteria>

<verify>
git status (verify dist/ and node_modules/ are not listed)
</verify>

<done>
Build artifacts correctly ignored by git. Only source code and configuration files are staged.
</done>
</task>

</tasks>

## Verification

After all tasks complete, run full Phase 1 validation:

```bash
# 1. Type check
npx tsc --noEmit

# 2. Build
npm run build

# 3. Verify dist/ structure
ls -la dist/esm/ dist/cjs/

# 4. Run tests (should find none)
npm test -- --run

# 5. Check git status
git status
```

All should succeed with no errors.

## Success Criteria

Phase 1, Plan 3 is complete when:

1. **npm install** succeeds with all dependencies resolved
2. **TypeScript compilation** passes with `npx tsc --noEmit` (zero errors)
3. **Vite build** generates dist/esm/ and dist/cjs/ with all token modules
4. **Type declarations** are generated (.d.ts files in both ESM and CJS outputs)
5. **package.json exports** point to correct files and paths exist
6. **Vitest environment** is configured and working (finds zero tests, no errors)
7. **.gitignore** excludes build artifacts and node_modules
8. **git status** shows no build artifacts being tracked

## Output

Create `.planning/phases/01-foundation-design-tokens/03-PLAN-SUMMARY.md` after execution with:
- npm install output (dependency versions)
- TypeScript type check output (should be clean)
- Vite build output (bundle sizes, modules transformed)
- dist/ directory structure listing
- npm test output (should show zero tests)
- git status output (should show only source files)
- Confirmation that all success criteria met

## Next Steps

Phase 1 Foundation & Design Tokens is complete. The design system now has:
- Production-ready build configuration (Vite 8 with ESM/CJS)
- Type-safe design tokens system in TypeScript
- Tailwind CSS integration powered by design tokens
- Testing environment ready for Phase 3+ components

Proceed to Phase 2: Build Infrastructure (Storybook setup, documentation, Chromatic CI/CD)
