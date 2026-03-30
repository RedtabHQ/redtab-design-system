# Feature Landscape: redtab Design System

**Domain:** React/TypeScript component library for enterprise applications
**Researched:** March 2026

## Table Stakes

Features users (developers and designers) expect. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Button component | Every UI has buttons | Low | Multiple variants (primary, secondary, destructive); sizes (sm, md, lg); disabled state |
| Form components | Data input core need | Medium | Input, Textarea, Select, Checkbox, Radio, Label—all with validation states |
| Card component | Content grouping | Low | Container with padding, border, shadow; flexible interior |
| Modal/Dialog | Block user flow | Medium | Accessible via Radix Dialog; backdrop, header, footer slots |
| Typography | Text styling | Low | Heading levels (h1-h6), body text, caption; line height scale |
| Spacing system | Layout foundation | Low | Utility tokens: gap, margin, padding (0.5rem, 1rem, 1.5rem, 2rem, etc.) |
| Color palette | Visual identity | Low | Primary, secondary, success, warning, danger, neutral—with shades |
| Dark mode | Accessibility feature | Medium | Tailwind dark: variant; theme switching; system preference detection |
| Responsive breakpoints | Mobile-first design | Low | Tailwind breakpoints (sm, md, lg, xl, 2xl); viewport meta tag |
| Shadow system | Visual hierarchy | Low | Elevation shadows (sm, md, lg, xl) for depth perception |
| Keyboard navigation | Accessibility | Medium | Tab order, focus visible, arrow keys for menus; audited with Radix |
| ARIA attributes | Screen readers | Medium | Semantic HTML; role, aria-label, aria-describedby; tested with axe |
| Storybook documentation | Developer onboarding | Medium | Interactive stories; MDX docs; prop tables; design tokens reference |
| Type definitions | DX for consumers | Medium | Full TypeScript support; prop interfaces exported; JSDoc comments |
| Theme customization | Brand flexibility | Medium | Tailwind extend config; token overrides; CSS variables optional fallback |

## Differentiators

Features that set redtab apart. Not expected, but valued by users.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Design tokens as TypeScript | Type-safe theming | Medium | Developers get autocomplete on token usage; compile-time validation |
| Multi-brand theming | Support client variations | High | Isolated theme contexts; per-app brand overrides without forking |
| Compound component patterns | Flexible composition | Medium | Dialog.Trigger, Dialog.Content, Dialog.Close; React.cloneElement patterns |
| Form validation integration | Painless input | Medium | Optional React Hook Form integration; validation message slots |
| Icon system | Consistent iconography | Low-Medium | Tailwind-compatible icon library (Lucide or Heroicons); prop-driven sizing |
| Customizable Storybook | Designer + dev collaboration | Medium | Live theming preview; responsive viewport switcher; code preview |
| Accessibility audit reports | Compliance verification | Medium | Chromatic visual testing + axe-core integration; WCAG AAA target |
| Component composition guide | Best practices | Low | Storybook MDX guide: "Compound Components", "Form Patterns", "Modal Flows" |
| Figma to Storybook sync | Handoff automation | High | Optional: Storybook Figma plugin or Supernova integration (Phase 2+) |
| CSS variable fallback | Design system portability | Low | Token system also exports CSS custom properties; non-JS consumers can use |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Pre-styled "complete" layouts | Over-prescriptive; kills flexibility | Provide atoms + composition guide; let apps compose |
| JavaScript-heavy animations | Performance cost; bundle bloat | CSS animations via Tailwind + simple transitions; recommend Framer for complex motion |
| Custom icon set | Maintenance burden; reinvent wheel | Use Lucide (MIT, tree-shakeable, 4000+ icons) or Heroicons (Tailwind team) |
| Dark mode as afterthought | Accessibility failure; flicker | Bake dark mode into every token and story from day 1 |
| One-off utility components | Scope creep; fragmentation | Push back: "Build this from atoms in your app" if not table stakes |
| Form validation engine | Out of scope; React Hook Form exists | Provide validation message slots; guide consumers to RHF |
| Polyfill bloat | Bundle size explosion | Target modern browsers (ES2020); let consumers polyfill if needed |
| Hard-coded color literals | Design system defeats purpose | Always use design tokens; no `bg-blue-500` in component code |
| Theme CSS-in-JS at runtime | Performance penalty; lost tree-shaking | Tailwind dark: variant + CSS variables only |
| Proprietary component syntax | Lock-in; non-standard | Use React conventions (children, onClick, className); play nicely with tooling |

## Feature Dependencies

```
Design Tokens → All Components (colors, spacing, typography)
Button → Form Components (used in forms)
Input, Label → Form (grouped)
Dialog → Modal, Dropdown (share modal backdrop patterns)
Card → Most page layouts (container)
Typography → All text rendering
Tailwind Config → Dark Mode, Responsive Breakpoints
Accessibility → Modal, Dialog, Form (Radix primitives provide semantics)
Storybook → All Components (development environment)
```

## MVP Recommendation

### Phase 1 (Foundation—Week 1-2)
Build zero components. Instead:
1. Design token system (colors, typography, spacing, shadows)
2. Tailwind config + theme structure
3. Storybook 10.3 setup with preview decorators
4. Chromatic integration
5. Vitest + RTL configuration

**Why:** Architecture first prevents rework. Storybook must exist before first component.

### Phase 2 (Core Atoms—Week 3-4)
Prioritize in this order:

1. **Button** (1 day)
   - Primary, secondary, destructive variants
   - Sizes: sm, md, lg
   - Disabled state
   - Radix foundation: unstyled `<button>`, apply Tailwind

2. **Input + Label** (1 day)
   - Text input variants
   - States: default, focus, error, disabled
   - Connected to label via htmlFor
   - Radix or custom (input is simple)

3. **Textarea** (0.5 day)
   - Consistent with Input
   - Resizable, disabled states

4. **Checkbox + Radio** (1 day)
   - Radix Checkbox + Radio
   - Custom styling with Tailwind
   - Labeled patterns

5. **Card** (0.5 day)
   - Flex container with padding, border, shadow
   - Composable: Card, Card.Header, Card.Body, Card.Footer

6. **Typography** (0.5 day)
   - Heading, Paragraph, Caption, Code components
   - Token-driven font sizes, weights, colors

### Phase 3 (Form & Layout—Week 5)
7. **Form group** (composite)
   - Input + Label + Error + Hint

8. **Select** (1 day)
   - Radix Select
   - Searchable, disabled states

9. **Badge** (0.5 day)
   - Color variants tied to tokens
   - Sizes

10. **Avatar** (0.5 day)
    - Image, fallback initials
    - Sizes (sm, md, lg)

### Phase 4 (Modals & Complex—Week 6-7)
11. **Dialog/Modal** (1.5 day)
    - Radix Dialog
    - Accessible backdrop, focus management
    - Composable slots (Header, Body, Footer, CloseButton)

12. **Dropdown/Menu** (1.5 day)
    - Radix Dropdown Menu
    - Keyboard navigation (arrows, enter, escape)
    - Item variants (danger for delete, etc.)

13. **Tooltip** (0.5 day)
    - Radix Tooltip
    - Position variants (top, bottom, left, right)

14. **Tabs** (1 day)
    - Radix Tabs
    - Keyboard nav (arrows, home, end)

### Defer to Phase 5+
- DatePicker (complex; recommend Headless UI or react-day-picker)
- Pagination (composite; depends on app logic)
- Breadcrumbs (navigation; app-specific)
- Stepper (workflow; app-specific)
- Carousel (performance-sensitive; recommend Swiper or Embla)
- Combobox (complex; Radix Combobox available but rare need)

## Testing Strategy

| Feature | Test Type | Tool | Goal |
|---------|-----------|------|------|
| Button rendering | Unit | Vitest + RTL | Renders with correct classes |
| Button click | Integration | Vitest + RTL | onClick fires, disabled blocks it |
| Form submission | Integration | Vitest + RTL | Form submits with values |
| Accessibility (modal) | Axe audit | Chromatic + axe-core | No violations (WCAG AA minimum) |
| Visual regression | Visual | Chromatic | No unintended design changes |
| Component composition | Unit | Vitest | Card.Header, Card.Body render correctly together |
| Dark mode | Visual | Chromatic | Stories render in light + dark |
| TypeScript | Type check | tsc | No prop type errors in stories |

---

## Storybook Documentation Structure

```
Storybook/
├── Docs/
│   ├── Getting Started.mdx (installation, imports, examples)
│   ├── Design Tokens.mdx (colors, typography, spacing reference)
│   ├── Theming.mdx (dark mode, customization, CSS variables)
│   ├── Patterns/
│   │   ├── Compound Components.mdx
│   │   ├── Form Patterns.mdx
│   │   └── Modal Flows.mdx
│   └── Accessibility.mdx (WCAG compliance, keyboard nav)
├── Components/
│   ├── Button.stories.tsx
│   ├── Input.stories.tsx
│   ├── Card.stories.tsx
│   └── ... (one file per component)
└── Recipes/
    ├── Login Form.mdx
    ├── Data Table (with filtering, sorting).mdx
    └── Sidebar Navigation.mdx
```

---

## Performance & Bundle Targets

- **Tree-shaking:** All components must be individually importable (`import { Button } from '@redtab/ds'`)
- **Bundle size (initial):** < 50 KB gzipped for core atoms (Button, Input, Card, Typography)
- **Bundle size (full):** < 150 KB gzipped with all components + Radix + Tailwind processing
- **Dev server HMR:** < 200ms for component changes (Vite 8 typical)
- **Storybook build time:** < 30s (Vite 8 typical)
- **Component story load time:** < 500ms in Storybook

These targets assume lazy-loading in consuming apps via code splitting.

---

## Accessibility Targets

- **WCAG 2.1 Level AA:** Minimum for all components
- **WCAG 2.1 Level AAA:** Target (exceeds requirements; shows commitment)
- **Keyboard navigation:** All interactive components (Button, Dialog, Menu, Tabs) fully keyboard accessible
- **Screen reader testing:** Manual testing with NVDA (Windows) + VoiceOver (macOS)
- **Automated testing:** axe-core integration in Chromatic; CI failure on violations

---

## Success Metrics (by Phase)

| Phase | Metric | Target |
|-------|--------|--------|
| 1 (Foundation) | Token system complete | 50+ tokens (colors, spacing, typography) |
| 2 (Core Atoms) | Components built | 6 core atoms with stories + tests |
| 3 (Form) | Form components complete | 10 form-related components |
| 4 (Modals) | Complex patterns working | Modal, Dropdown, Tabs with keyboard nav |
| 5 (Quality) | Test coverage | > 80% code coverage |
| 6 (Publish) | Public package | @redtab/design-system@1.0.0 on npm |
