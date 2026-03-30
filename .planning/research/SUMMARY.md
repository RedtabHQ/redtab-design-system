# Research Summary: redtab Design System

**Domain:** React/TypeScript component library with Tailwind CSS
**Researched:** March 2026
**Overall confidence:** HIGH

## Executive Summary

The 2026 design system stack for React applications has crystallized around a mature, proven set of tools. Vite 8 represents a watershed moment: its integration of Rolldown (a Rust-based bundler) delivers 10-30x faster production builds while maintaining simplicity. Storybook 10.3 remains the industry standard for component development and documentation, now tightly coupled with Chromatic for visual regression testing. The JavaScript ecosystem has moved decisively away from JavaScript-based bundlers (Webpack) and runtime CSS-in-JS libraries toward Rust-based builders and CSS-first frameworks like Tailwind.

For redtab specifically, the recommendation is to build on React 18 + TypeScript 5.5 (with isolatedDeclarations for explicit type APIs), Vite 8 for zero-config bundling, Storybook 10.3 for interactive documentation, Vitest for fast testing (10x faster than Jest), and Tailwind CSS (already in use) for styling. This stack minimizes configuration burden, maximizes performance, and aligns with industry best practices in March 2026.

The critical decision is architectural: use unstyled Radix UI primitives as a foundation layer, styled with Tailwind CSS. This approach gives redtab maximum flexibility and reusability—components can be themed per-app without refactoring the core library.

## Key Findings

**Stack:** Vite 8 + Storybook 10.3 + Vitest + TypeScript 5.5 + Radix primitives + Tailwind CSS
**Architecture:** Radix unstyled primitives as foundation, Tailwind for theming, TypeScript tokens for design consistency
**Critical pitfall:** Conflating component styling with behavior—build unstyled, theme separately

## Implications for Roadmap

Based on research, suggested phase structure:

### 1. **Foundation Phase** (2 weeks)
- Set up Vite 8 library build with tsup
- Configure TypeScript 5.5 with isolatedDeclarations
- Create design token system (TypeScript-first)
- Define Tailwind config + component tailoring

**Rationale:** Foundation must be solid before component development. TypeScript tokens and Tailwind config are prerequisites for consistency.

**Avoids:** Building components, then retrofitting design tokens (causes rework)

### 2. **Storybook + Infrastructure Phase** (1 week)
- Initialize Storybook 10.3 with React preset
- Configure Chromatic integration
- Set up MDX documentation
- Establish component story patterns

**Rationale:** Documentation infrastructure must be in place before developers start building. Chromatic setup ensures visual regression testing from day one.

**Avoids:** Adding Storybook after 50+ components (painful migration)

### 3. **Core Component Development** (4 weeks)
- Build atomic components (Button, Input, Label, Badge, etc.)
- Layer with Radix primitives (for accessible patterns)
- Style with Tailwind + design tokens
- Add Vitest + React Testing Library coverage

**Rationale:** Build foundational components first. Radix provides accessibility scaffold; Tailwind provides styling; Vitest validates behavior.

**Avoids:** Building complex components before atoms (breaks composition)

### 4. **Composite Components** (3 weeks)
- Build molecules (Form, Card, Dialog, Dropdown, etc.)
- Use atoms + Radix patterns as building blocks
- Document compound component patterns in Storybook

**Rationale:** Composite components depend on stable atoms. Storybook becomes rich documentation at this stage.

### 5. **Testing & Documentation** (1 week)
- Complete test coverage (aim for 80%+ on core library)
- Finalize Storybook documentation
- Write integration guides for consuming apps

**Rationale:** Late-stage testing after architecture is stable; avoid testing during architectural flux.

### 6. **Publishing & Release** (1 week)
- Set up semantic versioning + changelog (via changesets or manual)
- Configure npm publishing with Trusted Publishing (Node 24+)
- Create initial 1.0.0 release
- Publish private beta to @redtab scope, then public

**Rationale:** Publishing strategy must be intentional. Alpha → Beta → Stable progression prevents public API churn.

**Phase ordering rationale:**
- Design tokens and Tailwind config unlock consistency (Phase 1)
- Storybook infrastructure must exist before component development accelerates (Phase 2)
- Atomic components are simpler to build and stabilize first (Phase 3)
- Composite components rely on stable atoms (Phase 4)
- Testing is cheaper in phases 3-4 after patterns stabilize (Phase 5)
- Publishing is final after quality gates (Phase 6)

## Research Flags for Phases

| Phase | Research Need | Reason |
|-------|-------------------|--------|
| 1 | Design token architecture | How to structure tokens for Tailwind + future CSS variables; decision on token format (JSON, TypeScript, design tokens spec) |
| 2 | Storybook plugins for Tailwind | Validate darkmode plugin, responsive breakpoints preview in Storybook |
| 3 | Radix primitives audit | Which Radix primitives apply to redtab's component needs; accessibility audit |
| 4 | Compound component patterns | How to expose flexible APIs for dialog/dropdown/form patterns |
| 5 | Test coverage targets | Code coverage thresholds; performance test baselines |
| 6 | Breaking change policy | SemVer strategy; how aggressively to iterate API |

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Vite 8, Storybook 10.3, Vitest all current (March 2026); official docs used |
| Build Tools | HIGH | Vite 8 release verified; Rolldown integration confirmed; tsup stable |
| TypeScript | HIGH | TS 5.5 features verified; isolatedDeclarations adopted in early projects |
| Testing | HIGH | Vitest + RTL is industry standard for React; Vitest 1.0+ stable |
| Design Tokens | MEDIUM | TypeScript-based approach common, but no single "standard" format; DTCG spec exists but adoption mixed |
| Publishing | HIGH | npm Trusted Publishing (Node 24+) verified; semantic versioning standard |
| Tailwind Integration | HIGH | Tailwind 3.4 stable; design system patterns with Tailwind common |
| Storybook + Chromatic | HIGH | Both current versions; Chromatic Q1 2026 roadmap verified |

## Gaps to Address

1. **Token Format Decision** — Should tokens be TypeScript-only, or also JSON/CSS-in-JS for designer collaboration? Research DTCG spec adoption and Figma integration later.

2. **Tailwind Plugin Strategy** — Will redtab build custom Tailwind plugins (e.g., for spacing scale, shadow presets)? Or use vanilla Tailwind config? Phase 1 decision needed.

3. **Accessibility Testing** — Vitest + Testing Library covers behavioral a11y, but should Phase 5 include automated a11y audits? (Axe integration, WCAG compliance reporting)

4. **Theming Multi-Brand** — If redtab needs to support multiple brand themes (client-specific overrides), how to structure in Tailwind? CSS variables strategy vs. Tailwind variants.

5. **Monorepo Strategy** — Should design system be in its own repo, or part of larger redtab monorepo? Impacts Phase 1 tooling (npm workspaces vs. separate npm publishing).

6. **Designer Handoff** — How will Figma designs map to Storybook components? Need tooling decision (Storybook Figma plugin, Zeroheight, Supernova, etc.)

---

## 2026 Design System Trends

**Tailwind as default:** CSS-first styling dominates runtime CSS-in-JS for design systems (Emotion, styled-components relegated to special use cases).

**Rust bundlers coming of age:** Vite 8 with Rolldown represents fundamental shift from JavaScript bundlers. esbuild alone sufficient for libraries; Rollup/Rolldown for apps.

**Unstyled primitives rising:** Radix, Ark, Base UI capture design system adoption. Pre-styled libraries (Material-UI, Bootstrap) declining for new projects.

**TypeScript as lingua franca:** Strict mode + no-implicit-any standard. Design tokens, component props, hook contracts all typed.

**Storybook as platform:** No longer just documentation—now a testing and review platform (with Chromatic). Becomes primary UI development environment.

**Agent-assisted design:** Chromatic Q1 2026 roadmap includes MCP agents for component reuse suggestions. Design-to-code tooling maturing.

---

## Recommended First Steps

1. **Decision: Token Format** (2 days)
   - Interview designers about Figma collaboration needs
   - Choose: TypeScript-only vs. JSON spec vs. hybrid
   - Example: `src/tokens/index.ts` + export to `tokens.json`

2. **Setup: Vite 8 + Storybook** (3 days)
   - Initialize Vite 8 library with React preset
   - Add Storybook 10.3
   - Create first button story
   - Connect Chromatic account

3. **Design Tokens Foundation** (3 days)
   - Build colors, typography, spacing, shadows tokens
   - Create Tailwind config from tokens
   - Validate in Storybook preview

4. **Radix Audit** (2 days)
   - Map desired components to Radix primitives
   - Test Radix + Tailwind integration
   - Document composition patterns

This 10-day foundation enables Phase 3 (core components) to proceed smoothly.
