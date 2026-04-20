---
wave: 2
depends_on: ["01-foundation-design-tokens-01"]
files_modified:
  - src/tokens/colors.ts
  - src/tokens/spacing.ts
  - src/tokens/typography.ts
  - src/tokens/shadows.ts
  - src/tokens/index.ts
  - tailwind.config.ts
  - src/index.ts
  - tests/setup.ts
autonomous: true
requirements:
  - FOUND-01
  - FOUND-02
---

# Phase 1, Plan 2: Design Tokens System & Tailwind Integration

## Objective

Create the complete design tokens system in TypeScript with colors, spacing, typography, and shadows, then integrate these tokens into Tailwind CSS configuration. This establishes the single source of truth for all visual properties used throughout the design system.

**Purpose:** Enable developers to import and use design tokens from TypeScript source; ensure Tailwind CSS utilities are powered by design tokens, not arbitrary values.

**Output:**
- src/tokens/colors.ts with primary, neutral, and semantic color palettes
- src/tokens/spacing.ts with 4px-based spacing scale
- src/tokens/typography.ts with font sizes, weights, line heights, and predefined styles
- src/tokens/shadows.ts with elevation system
- src/tokens/index.ts barrel export
- tailwind.config.ts importing and extending theme with design tokens
- src/index.ts main entry point for library
- tests/setup.ts for test environment configuration

## Execution Context

This is Wave 2 work. Depends on Wave 1 (package.json, TypeScript config, Vite config all complete).

## Context

Prerequisites from Wave 1:
- package.json created with correct exports and dependencies
- tsconfig.json configured with strict mode and isolatedDeclarations
- vite.config.ts configured for dual ESM/CJS outputs
- Project directories created (src/tokens, etc.)

Design token architecture reference: 01-RESEARCH.md lines 151-352

## Tasks

<task id="2.1" name="Create design tokens: colors">
<read_first>
- 01-RESEARCH.md (section: Design Tokens Architecture, subsection Colors, lines 157-220)
- Understanding 'as const' for type inference in TypeScript
</read_first>

<action>
Create src/tokens/colors.ts with:

1. **Structure:** Export a `colors` const object with `as const` assertion
2. **Primary palette (primary):** Define 9 shades (50, 100, 200, 300, 400, 500, 600, 700, 800, 900)
   - Use sky blue as primary color (matches redtab brand): #0ea5e9 at 500
   - Lighter shades (50-400) for backgrounds and light accents
   - Base (500) for primary actions and interactive elements
   - Darker shades (600-900) for borders, text, and emphasis
   - Example: primary.500 = '#0ea5e9'

3. **Neutral palette (neutral):** Define 11 shades (0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
   - Grayscale for text, backgrounds, borders
   - 0: white (#ffffff)
   - 50-900: grays from light to dark
   - 950: black (#0a0a0a)
   - Example: neutral.900 = '#212121'

4. **Semantic colors (success, warning, error, info):** Each with 3-5 key shades
   - success (green): 50, 500, 900
   - warning (amber): 50, 500, 900
   - error (red): 50, 500, 900
   - info (blue): 50, 500, 900

5. **Type export:** Export `ColorToken = typeof colors` for IDE autocomplete

6. **Do NOT:**
   - Hardcode specific component colors (that comes in components later)
   - Use arbitrary shade names; stick to 50, 100, 200... progression
   - Create more than 4 semantic colors (simplicity)

Use the exact hex values from 01-RESEARCH.md lines 165-217. These are industry-standard, accessible colors.
</action>

<acceptance_criteria>
- `grep -q "export const colors" src/tokens/colors.ts`
- `grep -q "as const" src/tokens/colors.ts`
- `grep -q "primary.*500.*0ea5e9" src/tokens/colors.ts`
- `grep -q "neutral.*0.*ffffff" src/tokens/colors.ts`
- `grep -q "success.*warning.*error.*info" src/tokens/colors.ts`
- `grep -q "export type ColorToken" src/tokens/colors.ts`
</acceptance_criteria>

<verify>
npx tsc --noEmit (TypeScript should validate the colors.ts file has no type errors)
</verify>

<done>
src/tokens/colors.ts created with primary, neutral, and semantic color palettes. All colors use hex values. Type ColorToken exported for IDE autocomplete.
</done>
</task>

<task id="2.2" name="Create design tokens: spacing">
<read_first>
- 01-RESEARCH.md (section: Design Tokens Architecture, subsection Spacing, lines 229-251)
- Understand 4px base unit: 1 = 4px, 2 = 8px, 3 = 12px, etc.
</read_first>

<action>
Create src/tokens/spacing.ts with:

1. **Structure:** Export a `spacing` const object with `as const` assertion
2. **Scale:** Define spacing increments based on 4px base unit
   - 0: '0px'
   - 1: '4px' (base unit)
   - 2: '8px'
   - 3: '12px'
   - 4: '16px'
   - 6: '24px'
   - 8: '32px'
   - 12: '48px'
   - 16: '64px'
   - 20: '80px'
   - 24: '96px'
   - 32: '128px'

3. **Why this scale:** 4px base unit is industry standard; allows consistent, proportional spacing throughout

4. **Type export:** Export `SpacingToken = typeof spacing` for IDE autocomplete

5. **Usage:** This scale maps directly to Tailwind utilities (p-4 = padding-16px, m-2 = margin-8px, gap-3 = gap-12px)

Use exact values from 01-RESEARCH.md lines 235-248.
</action>

<acceptance_criteria>
- `grep -q "export const spacing" src/tokens/spacing.ts`
- `grep -q "as const" src/tokens/spacing.ts`
- `grep -q "0.*0px" src/tokens/spacing.ts`
- `grep -q "1.*4px" src/tokens/spacing.ts`
- `grep -q "4.*16px" src/tokens/spacing.ts`
- `grep -q "32.*128px" src/tokens/spacing.ts`
- `grep -q "export type SpacingToken" src/tokens/spacing.ts`
</acceptance_criteria>

<verify>
npx tsc --noEmit (TypeScript should validate spacing.ts has no type errors)
</verify>

<done>
src/tokens/spacing.ts created with 4px-based spacing scale. All increments defined. Type SpacingToken exported.
</done>
</task>

<task id="2.3" name="Create design tokens: typography">
<read_first>
- 01-RESEARCH.md (section: Design Tokens Architecture, subsection Typography, lines 259-306)
- Understand font size scale: xs (12px) to 6xl (60px)
- Understand predefined typography styles: h1-h6, body, caption
</read_first>

<action>
Create src/tokens/typography.ts with:

1. **fontSize const object:** Export with `as const`
   - xs: '12px' (captions, fine print)
   - sm: '14px' (small labels)
   - base: '16px' (default body text)
   - lg: '18px' (slightly larger body)
   - xl: '20px' (H6 heading)
   - 2xl: '24px' (H5 heading)
   - 3xl: '30px' (H4 heading)
   - 4xl: '36px' (H3 heading)
   - 5xl: '48px' (H2 heading)
   - 6xl: '60px' (H1 heading)

2. **fontWeight const object:** Export with `as const`
   - normal: 400
   - medium: 500
   - semibold: 600
   - bold: 700

3. **lineHeight const object:** Export with `as const`
   - tight: 1.2 (headings)
   - normal: 1.5 (body text)
   - relaxed: 1.75 (large text, descriptions)

4. **typography const object:** Predefined styles combining fontSize, fontWeight, lineHeight
   - h1: { fontSize: fontSize['6xl'], fontWeight: fontWeight.bold, lineHeight: lineHeight.tight }
   - h2: { fontSize: fontSize['5xl'], fontWeight: fontWeight.bold, lineHeight: lineHeight.tight }
   - h3: { fontSize: fontSize['4xl'], fontWeight: fontWeight.bold, lineHeight: lineHeight.tight }
   - h4: { fontSize: fontSize['3xl'], fontWeight: fontWeight.semibold, lineHeight: lineHeight.tight }
   - h5: { fontSize: fontSize['2xl'], fontWeight: fontWeight.semibold, lineHeight: lineHeight.tight }
   - h6: { fontSize: fontSize.xl, fontWeight: fontWeight.semibold, lineHeight: lineHeight.tight }
   - body: { fontSize: fontSize.base, fontWeight: fontWeight.normal, lineHeight: lineHeight.normal }
   - caption: { fontSize: fontSize.sm, fontWeight: fontWeight.normal, lineHeight: lineHeight.normal }

5. **Type exports:**
   - export type TypographyToken = typeof typography
   - Also export individual types if needed

Use exact values from 01-RESEARCH.md lines 265-303.
</action>

<acceptance_criteria>
- `grep -q "export const fontSize" src/tokens/typography.ts`
- `grep -q "export const fontWeight" src/tokens/typography.ts`
- `grep -q "export const lineHeight" src/tokens/typography.ts`
- `grep -q "export const typography" src/tokens/typography.ts`
- `grep -q "as const" src/tokens/typography.ts | wc -l` should be 4 (one per object)
- `grep -q "h1.*6xl.*bold" src/tokens/typography.ts`
- `grep -q "body.*base.*normal" src/tokens/typography.ts`
- `grep -q "export type TypographyToken" src/tokens/typography.ts`
</acceptance_criteria>

<verify>
npx tsc --noEmit (TypeScript should validate typography.ts has no type errors)
</verify>

<done>
src/tokens/typography.ts created with fontSize, fontWeight, lineHeight scales and predefined h1-h6 and body styles. Type TypographyToken exported.
</done>
</task>

<task id="2.4" name="Create design tokens: shadows">
<read_first>
- 01-RESEARCH.md (section: Design Tokens Architecture, subsection Shadows, lines 314-331)
- Understand elevation system: sm (subtle) to 2xl (heavy)
</read_first>

<action>
Create src/tokens/shadows.ts with:

1. **Structure:** Export a `shadows` const object with `as const` assertion
2. **Elevation scale:** Define shadow CSS values for 6 levels
   - none: 'none'
   - sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' (subtle, used for hover states)
   - base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' (default, cards)
   - md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' (elevated)
   - lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' (dropdown, modal)
   - xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' (tooltip)
   - 2xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' (heavy, overlay)

3. **Type export:** Export `ShadowToken = typeof shadows` for IDE autocomplete

4. **Why these values:** Realistic, layered shadows provide visual depth without being garish. Opacity values (0.05 to 0.25) are subtle enough for light mode, work in dark mode.

Use exact shadow values from 01-RESEARCH.md lines 321-328.
</action>

<acceptance_criteria>
- `grep -q "export const shadows" src/tokens/shadows.ts`
- `grep -q "as const" src/tokens/shadows.ts`
- `grep -q "none.*none" src/tokens/shadows.ts`
- `grep -q "sm.*0 1px 2px" src/tokens/shadows.ts`
- `grep -q "2xl.*0 25px 50px" src/tokens/shadows.ts`
- `grep -q "export type ShadowToken" src/tokens/shadows.ts`
</acceptance_criteria>

<verify>
npx tsc --noEmit (TypeScript should validate shadows.ts has no type errors)
</verify>

<done>
src/tokens/shadows.ts created with 6-level elevation system. Shadow values are realistic and layered. Type ShadowToken exported.
</done>
</task>

<task id="2.5" name="Create tokens barrel export">
<read_first>
- 01-RESEARCH.md (section: Design Tokens Architecture, subsection Token Barrel Export, lines 338-352)
- Tasks 2.1-2.4 (all created token files)
</read_first>

<action>
Create src/tokens/index.ts with:

1. **Re-export all token modules:**
   ```typescript
   export { colors } from './colors';
   export { spacing } from './spacing';
   export { fontSize, fontWeight, lineHeight, typography } from './typography';
   export { shadows } from './shadows';
   ```

2. **Export all token types:**
   ```typescript
   export type { ColorToken } from './colors';
   export type { SpacingToken } from './spacing';
   export type { TypographyToken } from './typography';
   export type { ShadowToken } from './shadows';
   ```

3. **Purpose:** This barrel export allows consumers to import all tokens from a single location:
   - `import { colors, spacing, typography, shadows } from '@redtabcode/design-system/tokens'`
   - Without this, consumers would need to import from individual files

This is a standard pattern for clean, organized libraries.
</action>

<acceptance_criteria>
- `grep -q "export.*colors.*from.*colors" src/tokens/index.ts`
- `grep -q "export.*spacing.*from.*spacing" src/tokens/index.ts`
- `grep -q "export.*typography" src/tokens/index.ts`
- `grep -q "export.*shadows.*from.*shadows" src/tokens/index.ts`
- `grep -q "export type.*ColorToken" src/tokens/index.ts`
</acceptance_criteria>

<verify>
npx tsc --noEmit (TypeScript should validate index.ts has no type errors)
</verify>

<done>
src/tokens/index.ts created as barrel export. All token modules and types re-exported.
</done>
</task>

<task id="2.6" name="Configure Tailwind CSS with design token integration">
<read_first>
- 01-RESEARCH.md (section: Tailwind CSS Integration, subsection Configuration Pattern, lines 358-392)
- All token files created in tasks 2.1-2.5
- package.json and tsconfig.json from Wave 1
</read_first>

<action>
Create tailwind.config.ts in project root with:

1. **Import statement:**
   ```typescript
   import type { Config } from 'tailwindcss';
   import { colors, spacing, fontSize, fontWeight, lineHeight, shadows } from './src/tokens';
   ```

2. **Configuration object (satisfies Config):**
   - content: ['./src/**/*.{ts,tsx}', './.storybook/**/*.{ts,tsx}'] (scan for used Tailwind classes)
   - darkMode: 'class' (support dark mode via class toggle)
   - theme.extend:
     - colors: import from tokens (overrides Tailwind defaults)
     - spacing: import from tokens
     - fontSize: import from tokens
     - fontWeight: import from tokens
     - lineHeight: import from tokens
     - boxShadow: shadows (maps shadows to Tailwind shadow utilities)
   - plugins: [] (empty for Phase 1; custom plugins added in Phase 3+)

3. **Key decisions:**
   - theme.extend (not theme override): allows Tailwind defaults to merge with our tokens
   - darkMode: 'class': enables explicit dark mode toggle (Phase 3+ implements dark: variants)
   - No arbitrary values: all spacing, colors, typography come from tokens

4. **Critical constraint:** NO arbitrary color values like `bg-[#ff0000]` should appear in components. All colors come from tokens.

Use exact configuration from 01-RESEARCH.md lines 362-386, modified for our specific token imports.
</action>

<acceptance_criteria>
- `grep -q "import.*colors.*from.*tokens" tailwind.config.ts`
- `grep -q "import.*spacing" tailwind.config.ts`
- `grep -q "content.*src.*storybook" tailwind.config.ts`
- `grep -q "darkMode.*class" tailwind.config.ts`
- `grep -q "colors" tailwind.config.ts` (should appear in theme.extend)
- `grep -q "boxShadow.*shadows" tailwind.config.ts`
- `grep -q "satisfies Config" tailwind.config.ts`
</acceptance_criteria>

<verify>
npx tsc tailwind.config.ts --noEmit (TypeScript should validate config file has no type errors)
</verify>

<done>
tailwind.config.ts created with design token integration. All Tailwind utilities powered by design tokens. Dark mode class strategy configured.
</done>
</task>

<task id="2.7" name="Create main library entry point (src/index.ts)">
<read_first>
- 01-RESEARCH.md (section: Recommended Project Structure, lines 129)
- vite.config.ts from Wave 1 (entry point is src/index.ts)
- All token files from tasks 2.1-2.5
</read_first>

<action>
Create src/index.ts with:

1. **Barrel exports for design system:**
   - Export all tokens: `export * from './tokens'` or individual imports for clarity
   - Optionally: `export { colors, spacing, typography, shadows } from './tokens'`

2. **Placeholder comments for future exports:**
   ```typescript
   // Components (Phase 3+)
   // export * from './components';

   // Hooks (Phase 6)
   // export * from './hooks';

   // Utilities (Phase 6)
   // export * from './utils';
   ```

3. **Purpose:** This is the single entry point that Vite will build into dist/esm/index.js and dist/cjs/index.cjs. Consumers use this to import all public APIs.

4. **What to include in Phase 1:** Only tokens. Components, hooks, utilities come later.

Vite build configuration (from Wave 1) points to this file as entry.
</action>

<acceptance_criteria>
- `[ -f src/index.ts ]` (file exists)
- `grep -q "export.*from.*tokens" src/index.ts`
- `grep -q "phase.*3" src/index.ts` (comments for future phases)
</acceptance_criteria>

<verify>
npx tsc --noEmit (TypeScript should validate index.ts has no type errors)
</verify>

<done>
src/index.ts created as main entry point. Exports design tokens. Placeholder comments for future component/hook exports.
</done>
</task>

<task id="2.8" name="Create test setup file for Vitest and React Testing Library">
<read_first>
- 01-RESEARCH.md (section: Recommended Project Structure, lines 136-138)
- Vitest configuration from Wave 1 (vitest.config.ts)
</read_first>

<action>
Create tests/setup.ts with:

1. **Import statements:**
   ```typescript
   import '@testing-library/jest-dom';
   import { cleanup } from '@testing-library/react';
   import { afterEach } from 'vitest';
   ```

2. **Test cleanup hook:**
   ```typescript
   afterEach(() => {
     cleanup();
   });
   ```

3. **Purpose:**
   - `@testing-library/jest-dom` provides custom matchers (toBeInTheDocument, toHaveClass, etc.)
   - `cleanup()` ensures DOM state is reset between tests (good practice)
   - This file runs before each test suite

4. **Configuration linkage:** vitest.config.ts (from Wave 1) points setupFiles: ['./tests/setup.ts'], so this file is automatically loaded before tests run.

This is minimal setup; Phase 6 (testing) will expand this with mocks and fixtures.
</action>

<acceptance_criteria>
- `[ -f tests/setup.ts ]` (file exists)
- `grep -q "import.*jest-dom" tests/setup.ts`
- `grep -q "cleanup" tests/setup.ts`
- `grep -q "afterEach" tests/setup.ts`
</acceptance_criteria>

<verify>
npx tsc --noEmit (TypeScript should validate setup.ts has no type errors)
</verify>

<done>
tests/setup.ts created with React Testing Library matchers and cleanup hook. Test environment ready for Phase 3+ component tests.
</done>
</task>

</tasks>

## Verification

After all tasks complete, verify design tokens and Tailwind integration:

1. **All token files exist:**
   ```bash
   [ -f src/tokens/colors.ts ] && [ -f src/tokens/spacing.ts ] && [ -f src/tokens/typography.ts ] && [ -f src/tokens/shadows.ts ] && [ -f src/tokens/index.ts ]
   ```

2. **Tailwind config imports tokens successfully:**
   ```bash
   npx tsc tailwind.config.ts --noEmit
   ```

3. **TypeScript accepts all token types:**
   ```bash
   npx tsc --noEmit
   ```

4. **Vite build will succeed (once dist/ directories exist):**
   ```bash
   npm run build
   ```

## Success Criteria

Phase 1, Plan 2 is complete when:

1. **Design tokens system complete:** colors.ts, spacing.ts, typography.ts, shadows.ts all created with correct values
2. **Token barrel export:** src/tokens/index.ts re-exports all tokens and types
3. **Tailwind configuration:** tailwind.config.ts imports tokens and extends theme
4. **Main entry point:** src/index.ts created and exports design tokens
5. **Test setup:** tests/setup.ts configured with React Testing Library
6. **TypeScript validation:** `npx tsc --noEmit` passes without errors
7. **Tailwind setup:** tailwind.config.ts validated with TypeScript

## Output

Create `.planning/phases/01-foundation-design-tokens/02-PLAN-SUMMARY.md` after execution with:
- List of created token files with line counts
- Verification that all tokens use correct values (sample grep output)
- Tailwind config validation output
- npm build output (will fail at dist/ missing, but configuration should be valid)
- Next steps (Wave 3: Verify build output, create entry points, validate distribution)
