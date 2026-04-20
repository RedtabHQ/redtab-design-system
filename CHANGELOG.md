# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-04-10

### Changed
- Stabilized the v1 public API surface for components, hooks, utilities, and tokens.
- Updated CI and Chromatic workflows to run on both `main` and `master` branches.

### Added
- Unit tests for `Tabs` keyboard/selection behavior.
- Unit tests for `Pagination` navigation and boundary states.
- Initial automated accessibility test using `axe-core` for core interactive primitives.

### Quality
- Local release verification passes: `npm run lint`, `npm run type-check`, `npm run test:run`, and `npm run build`.

## [0.1.0] - 2026-04-02

### Added

#### Design Tokens
- Color system: primary, neutral, semantic (success, warning, error, info)
- Spacing scale: 4px-based increments (0-128px)
- Typography: fontSize, fontWeight, lineHeight, predefined styles (h1-h6, body, caption)
- Shadows: 6-level elevation system (sm to 2xl)

#### Atom Components
- Button: primary/secondary/ghost/danger variants, sm/md/lg sizes, loading state
- Input: label, error, helperText, aria-invalid
- Card: default/surface variants, composed sub-components (Header/Title/Content/Footer)
- Typography: Heading (H1-H6), Text (body/caption) with polymorphic `as` prop
- Badge: success/warning/danger/info/neutral semantic variants
- Avatar: image/initials/fallback, sm/md/lg/xl sizes

#### Form Components
- FormField: label/error/hint wrapper with required indicator
- Select: native select with optgroup support
- Checkbox: indeterminate state support
- Radio + RadioGroup: fieldset/legend semantics
- Textarea: auto-expand mode
- Toggle: role="switch" with aria-checked

#### Layout Components
- Container: responsive max-width (sm through 2xl/full)
- Grid: configurable cols (1-12) and gap
- Stack: vertical/horizontal flex with gap/align/justify
- Divider: horizontal/vertical separator

#### Interactive Components
- Dialog: native `<dialog>` element, sm/md/lg sizes, focus trap
- Dropdown: click-triggered menu, outside click dismiss
- Tooltip: hover-triggered, top/bottom/left/right positioning
- Tabs: keyboard navigable, ARIA tablist/tab/tabpanel
- Toast: auto-dismiss timer, success/warning/error/info variants
- Pagination: page range with ellipsis, prev/next buttons

#### Custom Hooks
- useForm: generic form state management
- usePagination: page range calculation
- useMediaQuery: SSR-safe breakpoint detection
- useClickOutside: overlay dismissal
- useDebounce: value debouncing
- useLocalStorage: persisted state with cross-tab sync
- useQueryHelper: TanStack Query compatible utilities

#### Utilities
- cn(): clsx + tailwind-merge class merging
- Color: hexToRgb, rgbToHex, lighten, darken, withOpacity
- Date: formatDate, isToday, isWithinDays, timeAgo
- Validation: isEmail, isUrl, isPhone, minLength, maxLength, required, pattern
- Responsive: breakpoints, mediaQuery, isBreakpoint
- Type utilities: PropsWithClassName, Optional, RequiredKeys

#### Infrastructure
- Vite 6 library build with ESM + CJS dual output
- TypeScript 5.7 strict mode
- Storybook 10.3 with Chromatic visual regression testing
- Vitest + React Testing Library
- ESLint + Prettier configuration
- GitHub Actions CI/CD (quality checks + npm publish)
- Tailwind CSS powered by design tokens
