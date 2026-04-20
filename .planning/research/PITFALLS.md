# Domain Pitfalls: React Design Systems

**Domain:** React/TypeScript component libraries with Tailwind CSS
**Researched:** March 2026

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Conflating Styling with Behavior

**What goes wrong:**
- Components are tightly coupled to specific visual designs
- Any brand change (colors, spacing, shadows) requires component refactoring
- Design system becomes fragile and hard to theme

**Why it happens:**
- Early projects treat components as "finished products" rather than building blocks
- No separation between Radix (behavior) and Tailwind (style)
- Hard-coded class names instead of token-driven styling

**Consequences:**
- Can't support multi-brand theming without forking components
- Dark mode additions break existing styling
- 20-50% rework when design system scales to second/third app

**Prevention:**
1. Use unstyled Radix primitives as foundation—never build from HTML directly
2. Drive all styling from design tokens, not hard-coded Tailwind classes
3. Make theming a first-class concern; test dark mode alongside light
4. Review: can a component render in 3 different brand themes without code changes?

**Detection:**
- `className="bg-blue-500"` instead of `className={`bg-primary-500`}`
- Components fail when theme tokens change
- Designer request for "component variant" becomes a code change, not a config change

---

### Pitfall 2: Storybook as Afterthought

**What goes wrong:**
- Components built first; Storybook added later
- Stories are documentation (low value)
- Chromatic integration happens after 50+ components are built
- Breaking changes discovered late in development

**Why it happens:**
- Belief that Storybook is "documentation tool" rather than "development environment"
- Pressure to ship components quickly; treat Storybook as nice-to-have
- Unclear who is using stories (developers, designers, QA all need different things)

**Consequences:**
- Inconsistent component APIs across team
- Designer feedback comes too late (when components are "done")
- Visual regression detection starts late; accumulated bugs
- High churn rate; redesigns once users see finished components

**Prevention:**
1. Initialize Storybook in Phase 1, before building first component
2. Every component starts with a story, not the reverse
3. Use Storybook for interactive development: edit story, see changes instantly
4. Chromatic integration day 1; every story is a visual regression test

**Detection:**
- "We don't have time for stories; let's build real components"
- Designers reviewing in Figma while developers build in code
- Visual regressions discovered by users, not in CI

---

### Pitfall 3: Over-Engineering Component Props

**What goes wrong:**
- Button has 30+ props (isLoading, isActive, isError, isDisabled, isSmall, isLarge, etc.)
- Combinations are untestable; edge cases abound
- Consumer apps confused by which props to use
- API changes frequently

**Why it happens:**
- Trying to handle every use case in a single component
- No clear composition strategy; components become god objects
- Lack of atomic design thinking

**Consequences:**
- 2^n prop combinations; impossible to document and test
- Components hard to understand and harder to extend
- High maintenance burden; every new feature is a prop
- Onboarding takes longer

**Prevention:**
1. Limit component props to: variant, size, disabled, children, className
2. Use composition (slots, children) instead of props for customization
3. Separate concerns: Button handles click behavior; Card handles layout
4. Rule: If a component needs > 10 props, break it into smaller components

**Detection:**
- Feeling like you need to explain a component's props for 10+ minutes
- PropTypes or TypeScript interfaces with 20+ properties
- Issue tracker filled with "add support for X prop" requests

---

### Pitfall 4: Tailwind Sprawl & Unconstrained Customization

**What goes wrong:**
- Tailwind config extended with hundreds of custom utilities
- Components use arbitrary values: `w-[345px]`, `text-[#f0a2d4]`
- No design system discipline; developers add whatever they need
- Design tokens exist, but aren't enforced

**Why it happens:**
- Tailwind's flexibility tempts infinite customization
- No linting rules to enforce token usage
- Pressure to move fast; custom utilities seem faster than adding tokens
- Designers and developers misaligned on token definitions

**Consequences:**
- Design system becomes cargo cult; looks good but doesn't enforce consistency
- Colors drift (5 slightly different blues across components)
- Responsive breakpoints inconsistent
- Impossible to theme without touching hundreds of files
- Bundle size creeps as Tailwind generates unused utility combinations

**Prevention:**
1. Tailwind config: only extend with token values, never arbitrary values
2. Add eslint-plugin-tailwindcss to enforce class naming
3. No hardcoded color/spacing values in components; must use tokens
4. Monthly design token audit: colors, spacing, typography, shadows
5. Code review: "Is this using a token or a custom value?"

**Detection:**
- Tailwind config with custom colors beyond theme tokens
- `w-[345px]` or `text-[#f0a2d4]` in component code
- Team members asking "what's the blue color we use?" without a single answer

---

### Pitfall 5: Radix Inaccessibility Due to Styling

**What goes wrong:**
- Radix primitives provide accessibility (ARIA, keyboard nav)
- Poor styling hides or breaks accessibility (no focus ring, hard-to-read contrast)
- Components pass lighthouse but fail real screen reader usage
- WCAG violations in visual presentation

**Why it happens:**
- Radix's semantic HTML ignored; focus on visual design
- No automated a11y testing (axe-core); relies on manual testing
- Disabled states not visually obvious
- Focus indicators removed to match design aesthetic

**Consequences:**
- Legal liability (WCAG compliance complaints)
- 10-20% of users can't use application
- Expensive retrofitting when violations discovered
- Damage to brand reputation

**Prevention:**
1. Axe-core integration in Chromatic; CI fails on violations
2. Manual testing with screen readers: NVDA (Windows), VoiceOver (Mac)
3. Every disabled state must be visually obvious (lower opacity, grayed out)
4. Always include focus:ring-2 focus:ring-offset-2 in interactive components
5. Design token for disabled state opacity (e.g., opacity: 0.5)

**Detection:**
- Missing focus:ring classes on buttons/inputs
- Disabled buttons rendered at 100% opacity
- Chromatic shows visual diffs but no a11y audit results
- Screen reader testing skipped or manual-only

---

### Pitfall 6: No Tree-Shaking; Entire Library Bundled

**What goes wrong:**
- Consuming apps import Button but get entire component library (50+ components)
- Bundle size 200 KB even though only 5 components used
- Code splitting doesn't work; tree-shaking fails

**Why it happens:**
- Package exports don't use barrel files or use incorrect entry points
- ESM/CJS mismatch in package.json exports field
- Unclear distinction between dist/esm and dist/cjs

**Consequences:**
- Slow app startup; first contentful paint delayed
- Users on slow networks see loading spinner longer
- Expensive AWS bandwidth for distributed apps

**Prevention:**
1. Component library exports individual components:
   ```json
   {
     "exports": {
       "./Button": "./dist/esm/Button.js",
       "./Input": "./dist/esm/Input.js"
     }
   }
   ```
2. Or: Barrel file with ESM/CJS separation:
   ```typescript
   // src/index.ts
   export { Button } from './Button';
   export { Input } from './Input';
   export * from './tokens';
   ```
3. Build tool must support tree-shaking: Vite + Rollup do this by default
4. Test tree-shaking: `npm install` lib, inspect `node_modules/lib/dist/` file sizes

**Detection:**
- Bundle analysis shows library is 200+ KB despite importing 3 components
- `import * as DS from '@redtab/ds'` appears in codebase (triggers bundling)
- Webpack/Vite bundle analyzer shows unused code

---

### Pitfall 7: Design System Doesn't Support Dark Mode

**What goes wrong:**
- Dark mode bolted on as afterthought
- Components have dark mode stories but component code doesn't support it
- Consuming apps implement their own dark mode; design system styling breaks
- Token system has no dark variant

**Why it happens:**
- Dark mode design not done in Figma; only light mode designed
- Storybook theme switcher not set up; stories only rendered in light
- No dark variants in design tokens
- Belief that dark mode is "app responsibility" not "design system responsibility"

**Consequences:**
- Every app duplicates dark mode work
- Inconsistent dark theme across apps
- User preference (system dark mode) ignored; broken UX
- Design system feels incomplete; undermines trust

**Prevention:**
1. Design both light and dark modes in Figma before building
2. Storybook preview setup includes theme provider with dark mode toggle
3. Design tokens defined per theme variant:
   ```typescript
   export const colors = {
     light: { primary: '#0ea5e9', neutral: '#fafafa' },
     dark: { primary: '#0284c7', neutral: '#0a0a0a' },
   };
   ```
4. Tailwind dark: variant used in every component that needs it
5. Every story rendered in both light + dark in Chromatic

**Detection:**
- Storybook stories only in light mode; no dark variant
- Tailwind dark: classes missing from components
- Consuming apps implement own dark theme separate from design system
- Issue reports: "Dark mode looks wrong in app X"

---

## Moderate Pitfalls

### Pitfall 1: TypeScript Type Definitions Missing or Wrong

**What goes wrong:**
- Component props not properly typed
- Consumers get no IDE autocomplete
- Runtime errors from prop misuse not caught at compile time
- .d.ts files out of sync with implementation

**Why it happens:**
- Assumed TypeScript is only for developers; skipped type annotations
- Separate type definition repo; doesn't stay in sync
- `any` types used liberally instead of proper unions

**Prevention:**
- Every component function signature typed: `React.FC<ButtonProps>`
- Props interface exported: `export interface ButtonProps { ... }`
- tsconfig: `strict: true`, `noImplicitAny: true`
- Generate .d.ts automatically via `declaration: true` in tsconfig
- Test TS consumer imports in CI (check imports resolve correctly)

**Detection:**
- `// @ts-expect-error` comments in consuming code
- Storybook controls show `args: any` instead of specific prop types
- Type errors in consuming apps that should be caught

---

### Pitfall 2: No Semantic Versioning; Breaking Changes in Minor Versions

**What goes wrong:**
- Component API changes from 1.0.0 to 1.0.1
- Consuming apps break after `npm update`
- No clear upgrade path; users confused about compatibility

**Why it happens:**
- Unclear versioning policy
- Small changes treated as patches
- Deprecation warnings skipped; breaking changes announced post-release

**Prevention:**
1. Semantic versioning strict: MAJOR.MINOR.PATCH
   - MAJOR: breaking changes (component removed, prop renamed, behavior changed)
   - MINOR: backward-compatible features (new component, new prop)
   - PATCH: bug fixes (no API changes)
2. Document breaking changes in CHANGELOG
3. Deprecation warnings before removal: 1 major version notice period
4. Pre-release testing: publish 1.0.0-beta before 1.0.0

**Detection:**
- Users pinning versions `@redtab/ds": "1.0.0"` instead of `"^1.0.0"`
- GitHub issues: "After updating, Button broke"

---

### Pitfall 3: No Build Output Validation

**What goes wrong:**
- Library builds successfully but dist/ folder is empty or malformed
- Exports in package.json point to non-existent files
- Consuming apps fail at runtime: "Cannot find module @redtab/ds/Button"

**Why it happens:**
- No CI check for build output
- Manual publishing; missed verifying dist/ before npm publish
- Vite/tsup misconfigured; outputs to wrong directory

**Prevention:**
1. CI pipeline: run `npm run build`, then verify dist/ exists
2. Check package.json exports resolve:
   ```bash
   node -e "require('@redtab/ds/Button')"
   ```
3. Test entry point before publish:
   ```bash
   npm pack  # creates .tgz locally
   npm install redtab-design-system-1.0.0.tgz  # install from tarball
   # Test import in a scratch app
   ```
4. GitHub Actions: automate publish only after build + test passes

**Detection:**
- npm install succeeds but import fails
- dist/ folder missing from npm registry (npm view @redtab/ds files)
- Runtime error in consuming apps despite successful build

---

### Pitfall 4: Monorepo Complexity Without Benefit

**What goes wrong:**
- Design system in monorepo with multiple packages
- Build/publish complexity increases; CI pipelines fragile
- Version management across packages becomes nightmare
- Unclear where to file issues; maintenance burden

**Why it happens:**
- Copy-pasted setup from large companies
- Assumption that monorepo automatically enables reuse
- Premature optimization

**Prevention:**
1. Start with single package: @redtabcode/design-system
2. Only split into monorepo (workspaces) if truly separate concerns:
   - Core components (@redtab/ds-core)
   - Icons (@redtab/ds-icons)
   - For different teams maintaining different packages
3. If monorepo: use changesets for coordinated versioning

**Detection:**
- Publishing is manual and error-prone
- Each package has different version numbers
- Users confused about which package to install

---

## Minor Pitfalls

### Pitfall 1: Storybook Addon Bloat

**What goes wrong:**
- Installed 10+ Storybook addons; build time 2+ minutes
- Addon features underused; adds complexity
- Performance degradation in large projects

**Prevention:**
- Essentials addon (actions, docs, controls, viewport)
- a11y addon for accessibility testing
- Chromatic for visual regression
- Avoid: deprecated addons, testing library integration (use Vitest instead)

---

### Pitfall 2: Unclear Export Strategy

**What goes wrong:**
- Consumers import from nested paths: `@redtab/ds/src/components/Button`
- No clear "public API"
- Internal refactoring breaks consumers

**Prevention:**
- Single entry point: `/src/index.ts`
- Barrel export: `export { Button } from './components/Button'`
- package.json exports field restricts imports
- Mark internal modules: `/* @internal */` JSDoc comment

---

### Pitfall 3: No Changelog

**What goes wrong:**
- Users upgrade to new version with no clarity on what changed
- Breaking changes not documented
- Deprecations not announced

**Prevention:**
- CHANGELOG.md in root
- Entry per release: features, fixes, breaking changes
- Tools: changesets, release-it, or manual

---

### Pitfall 4: Inconsistent Naming Conventions

**What goes wrong:**
- Some props: `isLoading`, others: `loading`
- Component names: `TextInput` vs `InputText`
- CSS class conventions: `btn-primary` vs `buttonPrimary`

**Prevention:**
- Design system API guide: document naming conventions
- Linting rules: enforce consistent naming
- Code review: catch inconsistencies early

---

## Phase-Specific Warnings

| Phase | Likely Pitfall | Mitigation |
|-------|---------------|------------|
| 1 (Foundation) | Token system incomplete; colors/spacing mismatch | Define tokens for all atoms before building any |
| 2 (Storybook) | Storybook theme switcher not working; dark mode preview broken | Test dark mode Storybook preview in Chromatic |
| 3 (Core Atoms) | Components don't compose; props explosion | Keep Button, Input, Card simple; defer complexity |
| 4 (Compounds) | Accessibility breaks in compound patterns; focus management | Test Modal/Dialog keyboard nav; screen reader testing |
| 5 (Testing) | Coverage metrics gamed; untestable components | Test behavior, not implementation; avoid snapshot tests |
| 6 (Publishing) | Package.json exports misconfigured; tree-shaking fails | npm pack locally and test before publishing to registry |

---

## Design System Maturity Checklist

- [ ] Storybook initialized and accessible to team
- [ ] Chromatic connected; visual regression testing automated
- [ ] Design tokens defined and enforced via linting
- [ ] Dark mode supported in all components
- [ ] Tree-shaking verified; component library < 50 KB atoms
- [ ] Accessibility audited: axe-core in CI, manual screen reader testing
- [ ] TypeScript strict mode enabled; no implicit any
- [ ] Semantic versioning documented and followed
- [ ] Breaking changes deprecated one major version before removal
- [ ] CHANGELOG maintained
- [ ] Component API documented in Storybook
- [ ] Testing: > 80% coverage of component behavior
- [ ] Publishing: automated via CI/CD, not manual
- [ ] Code review process: design consistency, naming, accessibility

---

## Sources

- [Building Accessible Component Libraries with Radix](https://www.radix-ui.com/)
- [Storybook best practices and testing](https://storybook.js.org/docs)
- [Chromatic visual testing and regression](https://www.chromatic.com/)
- [Design Systems best practices (Design Systems Handbook)](https://www.designsystems.com/)
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS best practices](https://tailwindcss.com/docs)
- [npm package publishing and tree-shaking](https://snyk.io/blog/best-practices-create-modern-npm-package/)
- [TypeScript strict mode and type safety](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
