# STATE: Redtab Design System

**Project:** Redtab Design System
**Status:** Roadmap complete, ready for Phase 1 planning
**Last Updated:** 2026-03-30

---

## Project Reference

### Core Value
Enable designers and developers to build consistent, professional interfaces rapidly by providing battle-tested, well-documented components extracted and refined from redtab's existing codebase.

### Scope
- React 18+ component library with TypeScript
- Tailwind CSS styling with design tokens
- Storybook 10.3 interactive documentation
- Vitest + React Testing Library testing
- npm package for consumption across redtab ecosystem

### Out of Scope (v1)
- Page-level templates
- Backend API integration helpers
- Third-party analytics/tracking
- Mobile-specific optimizations
- Dark mode (v2 feature)
- Multi-brand theming (v2 feature)

---

## Current Position

**Milestone:** Roadmap Phase
**Current Phase:** Roadmap complete; awaiting Phase 1 planning
**Overall Progress:** 0/7 phases started

```
[████                                                                ] 0%

Phase 1: Foundation & Tokens         [                    ] 0%
Phase 2: Build Infrastructure        [                    ] 0%
Phase 3: Core Atoms                  [                    ] 0%
Phase 4: Forms & Layout              [                    ] 0%
Phase 5: Complex Components          [                    ] 0%
Phase 6: Hooks, Utils & Tests        [                    ] 0%
Phase 7: Quality & Publishing        [                    ] 0%
```

---

## Roadmap Summary

| Phase | Goal | Dependencies | Requirements | Success Criteria |
|-------|------|--------------|--------------|------------------|
| 1 | Foundation & design tokens | None | 4 (FOUND-01, FOUND-02, FOUND-04, FOUND-05) | 5 |
| 2 | Build infrastructure (Storybook, Chromatic) | Phase 1 | 2 (FOUND-03, FOUND-06) | 5 |
| 3 | Core atomic components (atoms) | Phases 1-2 | 6 (ATOM-01..06) | 7 |
| 4 | Form & layout components | Phase 3 | 11 (FORM-01..06, LAYOUT-01..05) | 7 |
| 5 | Complex interactive components | Phase 4 | 6 (COMPLEX-01..06) | 7 |
| 6 | Hooks, utilities, testing, documentation | Phase 5 | 20 (HOOKS, UTIL, DOC, TEST) | 9 |
| 7 | Quality & publishing | Phase 6 | 6 (QUALITY, PUB) | 7 |

**Total v1 Requirements:** 43 (all mapped, 0 orphans)

---

## Stack Decision

**Locked Stack (from research):**
- **Build**: Vite 8 + tsup for library bundling
- **Runtime**: React 18+ with TypeScript 5.5 (isolatedDeclarations)
- **Styling**: Tailwind CSS 3.4+ with custom design tokens
- **Documentation**: Storybook 10.3 + Chromatic
- **Testing**: Vitest (10x faster than Jest) + React Testing Library + Axe
- **Accessibility**: Radix UI primitives as unstyled foundation + Tailwind styling
- **Publishing**: npm with semantic versioning + GitHub Actions Trusted Publishing

**Architecture Principle:**
Unstyled Radix primitives layered with Tailwind CSS. This enables maximum flexibility—components can be themed per-app without refactoring the core library.

---

## Key Decisions Made

| Decision | Chosen | Rationale | Status |
|----------|--------|-----------|--------|
| Repository | Standalone repo | Better reusability, cleaner separation, independent npm publishing | ✓ Locked |
| Component Base | Radix + Tailwind | Accessibility built-in, maximum flexibility, industry standard | ✓ Locked |
| Documentation | Storybook 10.3 + Chromatic | Industry standard, visual regression testing, designer-developer collaboration | ✓ Locked |
| Build Tool | Vite 8 + tsup | 10-30x faster production builds, zero-config, Rust bundler | ✓ Locked |
| Test Framework | Vitest + RTL | 10x faster than Jest, tightly integrated with Vite | ✓ Locked |
| Token Format | TypeScript-first | Strongly typed, enables IDE autocomplete, can export to JSON later | ⏳ Pending decision |
| Tailwind Plugins | Vanilla config (Phase 1) | Keep Phase 1 simple; custom plugins decided in Phase 3 if needed | ⏳ Decision point |

---

## Research Flags

These require decisions during phase execution:

| Phase | Flag | Question | Resolve By |
|-------|------|----------|------------|
| 1 | Token Architecture | Should tokens be TypeScript-only or also JSON/CSS for designer collaboration? | Phase 1 kickoff |
| 1 | Tailwind Plugin Strategy | Build custom Tailwind plugins (spacing, shadows) or use vanilla config? | Phase 1 completion |
| 2 | Storybook Addons | Which Storybook addons (accessibility, viewport manager, docs)? | Phase 2 kickoff |
| 3 | Radix Audit | Which Radix primitives map to redtab's component needs? | Phase 3 kickoff |
| 4 | Compound Patterns | How to expose flexible APIs for Dialog, Dropdown, Form patterns? | Phase 4 kickoff |
| 6 | Test Coverage Target | What code coverage threshold (80%, 90%)? Performance baselines? | Phase 6 kickoff |
| 7 | Breaking Change Policy | SemVer strategy: how aggressively to iterate API? | Phase 7 kickoff |

---

## Performance Metrics

**Build Speed (baseline to beat):**
- Vite dev server startup: < 500ms
- Storybook startup: < 2 seconds
- Component build (Vitest): < 100ms per component

**Testing Coverage (Phase 6 target):**
- Unit test coverage: 80%+ code coverage
- Components tested: 100% (all 27 components)
- a11y compliance: 100% WCAG 2.1 AA

**Documentation (Phase 6 target):**
- Every component has Storybook story: 100%
- API documentation complete: 100%
- Usage examples provided: 100%

---

## Accumulated Context

### Architectural Insights
- **Radix as foundation:** Radix provides accessibility scaffold (keyboard navigation, ARIA, focus management); Tailwind provides styling; composition happens at component level
- **Design tokens must precede components:** Attempting to add tokens after 20+ components are built causes rework; Phase 1 locks token architecture early
- **Storybook as development environment:** After Phase 2, Storybook becomes primary UI development workspace; developers work story-first, not code-first
- **Chromatic from day one:** Visual regression testing enables confidence in refactoring; adding later is disruptive

### Common Pitfalls to Avoid
1. **Conflating styling with behavior:** Don't hard-code Tailwind classes in Radix component wrappers. Instead: Radix handles behavior (keyboard, ARIA), consumers style with Tailwind.
2. **Over-engineering tokens:** TypeScript tokens can become complex. Start simple (colors, spacing, typography); add complexity only if needed.
3. **Delaying Storybook setup:** Adding Storybook after 50+ components are built is painful. Phase 2 completes before Phase 3 scales.
4. **Testing after architecture is done:** Testing during Phases 3-5 (when patterns are forming) is cheaper than testing during Phase 6 if architecture shifts.

### Dependencies & Blockers
- **Phase 1 blocks all others:** Design token decision and Vite config must be solid before component development
- **Phase 2 blocks Phase 3 scaling:** Storybook infrastructure must exist before rapid component development (else documentation debt)
- **Chromatic account setup:** Phase 2 requires Chromatic connection; this needs GH account + Chromatic signup (1-2 hours)

### Team & Effort Estimation
- **Solo developer + Claude:** All phases suitable for parallel planning → sequential execution
- **Estimated effort:** 10-12 weeks for v1 (foundation to publishing)
  - Phase 1: 1-2 weeks (foundation + tokens)
  - Phase 2: 1 week (Storybook setup)
  - Phase 3: 2 weeks (6 atoms)
  - Phase 4: 2 weeks (11 form + layout components)
  - Phase 5: 1.5 weeks (6 complex components)
  - Phase 6: 2 weeks (hooks, utils, tests, docs)
  - Phase 7: 1.5 weeks (quality checks + publishing)

---

## TODOs & Next Steps

### Immediate (Before Phase 1)
- [ ] Confirm Radix + Tailwind architecture with team
- [ ] Decide token format (TypeScript-only vs. JSON export)
- [ ] Create Chromatic account if not already done
- [ ] Confirm npm publishing scope (@redtab/design-system)

### Phase 1 Kickoff
- [ ] Initialize Vite 8 library with React preset
- [ ] Configure TypeScript 5.5 with isolatedDeclarations
- [ ] Create design token system (colors, spacing, typography, shadows)
- [ ] Configure Tailwind with tokens
- [ ] Validate type checking passes

### Phase 1 Completion
- [ ] All FOUND requirements passing success criteria
- [ ] Run `/gsd:plan-phase 2`

---

## Session Continuity

**Last Action:**
- Roadmap created with 7 phases, 43 requirements mapped, 0 orphans
- Files written: ROADMAP.md, STATE.md, REQUIREMENTS.md (traceability updated)

**Next Action:**
- User approval of roadmap structure
- If approved: `/gsd:plan-phase 1` to decompose Phase 1 into executable plans

**Context Preservation:**
- ROADMAP.md: Full phase breakdown with success criteria and requirement mappings
- STATE.md: Project memory (decisions, flags, effort estimates, continuation notes)
- REQUIREMENTS.md: Traceability linking requirements to phases

---

*State created: 2026-03-30*
*Last updated: 2026-03-30*
