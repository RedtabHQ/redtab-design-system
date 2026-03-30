# Architecture Patterns: redtab Design System

**Domain:** React/TypeScript component library + Tailwind CSS
**Researched:** March 2026

## Recommended Architecture

The redtab design system follows a **layered, composition-first architecture** with clear separation between unstyled primitives (Radix), styling (Tailwind + tokens), and compound patterns (opinionated components).

```
┌─────────────────────────────────────────────────────┐
│  Consumer Apps (redtab frontends)                   │
│  Import: <Button />, <Form />, tokens.colors.blue  │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  Compound Components (Modal, Form, Dropdown)        │
│  Built from: Atoms + Radix primitives + Tailwind   │
│  Composition: Card.Header + Card.Body + Card.Footer│
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  Atomic Components (Button, Input, Label, Card)    │
│  Built from: Radix primitives + Tailwind classes   │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  Radix UI Primitives (unstyled, accessible)        │
│  Dialog, Dropdown, Checkbox, Select, etc.          │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│  Design Tokens + Tailwind CSS                       │
│  TypeScript tokens + Tailwind config + CSS vars    │
└─────────────────────────────────────────────────────┘
```

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Design Tokens** | Single source of truth for colors, spacing, typography, shadows | Tailwind config, all components, CSS variables export |
| **Radix Primitives** | Unstyled, semantically correct HTML + keyboard nav + ARIA | Base components (wrapped by redtab atoms) |
| **Atom Components** | Smallest reusable units (Button, Input, Label, Card) | Radix primitives, design tokens, Tailwind utilities |
| **Compound Components** | Multi-element components (Modal, Form, Dropdown) | Atoms + Radix primitives via composition |
| **Export Barrel** | Public API surface; tree-shakeable imports | Consumer apps |
| **Storybook Stories** | Interactive documentation + regression testing | Chromatic for visual diffs |

## Data Flow

### Component Creation Flow
```
1. Designer defines design in Figma
   ↓
2. Token values extracted → TypeScript tokens file
   ↓
3. Tokens imported in Tailwind config
   ↓
4. Component built: Radix primitive + Tailwind classes
   ↓
5. Story created in Storybook
   ↓
6. Chromatic auto-tests visual regressions
   ↓
7. Component exported in barrel; imported by consumer apps
```

### Styling Data Flow
```
Design Token (TypeScript)
  ↓
Export to JSON (optional, for Figma plugins)
  ↓
Import in tailwind.config.ts
  ↓
Generate CSS classes
  ↓
Apply via className props in components
  ↓
Consumer app imports component + classes applied automatically
```

### Theming Flow
```
User prefers dark mode (system preference)
  ↓
App passes dark={true} to theme provider (or detects via media query)
  ↓
Tailwind dark: variant activates CSS class selectors
  ↓
All components using dark:bg-neutral-900 etc. auto-update
  ↓
CSS variables (optional) sync across distributed systems
```

## Patterns to Follow

### Pattern 1: Radix-Wrapped Atoms
**What:** Wrap Radix primitives with Tailwind styles + design tokens

**When:** Building accessible interactive components (Button, Input, Select, Dialog)

**Example:**
```typescript
// src/components/Button.tsx
import * as React from 'react';
import { colors, spacing } from '../tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    const variantClasses = {
      primary: `bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800`,
      secondary: `bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400`,
      destructive: `bg-red-600 text-white hover:bg-red-700 active:bg-red-800`,
    };

    const sizeClasses = {
      sm: `px-${spacing['2']} py-${spacing['1']} text-sm`,
      md: `px-${spacing['4']} py-${spacing['2']} text-base`,
      lg: `px-${spacing['6']} py-${spacing['3']} text-lg`,
    };

    return (
      <button
        ref={ref}
        className={`
          rounded font-semibold transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className || ''}
        `}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

**Key points:**
- Use design tokens (colors, spacing) as source of truth
- Tailwind classes applied via className
- Radix primitives provide semantics (button is native HTML button)
- forwardRef for ref passing
- Accessible focus states via focus:ring

### Pattern 2: Compound Components
**What:** Multi-element component with internal composition (Card.Header, Dialog.Trigger, etc.)

**When:** Building flexible containers or modals that need slot-based composition

**Example:**
```typescript
// src/components/Card.tsx
import * as React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }: CardProps) => (
  <div className={`border-b border-gray-200 px-6 py-4 ${className}`}>
    {children}
  </div>
);

const CardBody = ({ children, className = '' }: CardProps) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = '' }: CardProps) => (
  <div className={`border-t border-gray-200 px-6 py-4 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card };

// Usage in consumer app:
// <Card>
//   <Card.Header>Title</Card.Header>
//   <Card.Body>Content</Card.Body>
//   <Card.Footer>Actions</Card.Footer>
// </Card>
```

**Key points:**
- No props drilling; visual structure == component structure
- Easy for consumers to modify parts independently
- TypeScript ensures proper composition

### Pattern 3: Variant-Driven Components
**What:** Single component with prop-driven variants for different states/styles

**When:** Building simple atoms (Button, Badge, Alert) with multiple visual states

**Example:** (Button above is a variant pattern)

**Key points:**
- variant and size props drive Tailwind classes
- Type-safe variants via union types
- Avoids prop explosion (don't create ButtonSmall, ButtonLarge variants)

### Pattern 4: Design Token-Driven Styling
**What:** Use TypeScript tokens as the source of truth; Tailwind config extends tokens

**When:** All components; ensures design consistency

**Example:**
```typescript
// src/tokens/colors.ts
export const colors = {
  primary: { 50: '#f0f9ff', 500: '#0ea5e9', 900: '#0c2d6b' },
  neutral: { 50: '#fafafa', 900: '#0a0a0a' },
  success: { 50: '#f0fdf4', 500: '#22c55e', 900: '#15803d' },
} as const;

// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: colors,
    },
  },
};

// Component usage
<button className="bg-primary-500 hover:bg-primary-600">Click me</button>
```

**Key points:**
- Tokens defined once, used everywhere
- Color theme changes cascade automatically
- Type-safe token references in TypeScript components

### Pattern 5: Form Composition with Radix + Atoms
**What:** Radix Form primitives (e.g., Dialog for modal forms) composed with Input atoms

**When:** Building form-heavy pages (login, registration, settings)

**Example:**
```typescript
// src/components/FormField.tsx
import * as React from 'react';
import { Input } from './Input';
import { Label } from './Label';

interface FormFieldProps {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  children?: React.ReactNode;
  required?: boolean;
}

export const FormField = ({ name, label, error, hint, children, required }: FormFieldProps) => (
  <div className="mb-4">
    <Label htmlFor={name} required={required}>
      {label}
    </Label>
    {children || <Input id={name} name={name} />}
    {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);
```

**Key points:**
- Slots for custom input types (children prop)
- Error/hint messaging integrated
- Semantic label association

## Anti-Patterns to Avoid

### Anti-Pattern 1: Hard-Coded Color Values
**What:** `bg-blue-500` hardcoded in components instead of using tokens

**Why bad:**
- Theme changes require code search/replace
- Inconsistent color usage (5 shades of blue in different components)
- Designers and developers misaligned on color system

**Instead:**
```typescript
// BAD
<div className="bg-blue-500">...</div>

// GOOD
import { colors } from '../tokens';
<div className="bg-primary-500">...</div>
// or via direct token import for dynamic styles
<div style={{ backgroundColor: colors.primary[500] }}>...</div>
```

### Anti-Pattern 2: Props Explosion
**What:** Component with dozens of boolean props (isActive, isDisabled, isLoading, isError, isHovering, ...)

**Why bad:**
- API surface hard to understand
- Testing complexity explodes (2^n combinations)
- Difficult to extend without adding more props

**Instead:**
```typescript
// BAD
<Button isActive={true} isDisabled={false} isLoading={true} size="md" />

// GOOD: use variant prop + composition
<Button variant="primary" size="md" disabled={false} loading={true} />

// OR: separate components for distinct use cases
<Button variant="primary" disabled />
<Button variant="secondary" loading />
```

### Anti-Pattern 3: Tailwind Classes in JavaScript
**What:** Dynamically building Tailwind class strings in components

**Why bad:**
- Tailwind's JIT compiler won't find dynamic classes
- Build-time tree-shaking breaks
- Classes won't be generated; styling fails

**Instead:**
```typescript
// BAD
const buttonClasses = variant === 'primary' ? `bg-blue-${size}` : 'bg-gray-500';

// GOOD: define all class combinations ahead of time
const variantClasses = {
  primary: 'bg-blue-600',
  secondary: 'bg-gray-200',
};
```

### Anti-Pattern 4: Coupling Components to Specific Apps
**What:** Component logic includes app-specific business logic or styling

**Why bad:**
- Design system becomes a dump for every feature
- Components can't be reused across apps
- Library grows unmaintainable

**Instead:**
- Design system provides atoms + compound patterns
- Apps compose for their specific needs
- Form validation, API calls, etc. live in apps, not design system

### Anti-Pattern 5: Mixing Radix + Tailwind Incorrectly
**What:** Radix primitives applied without Tailwind styling, or Tailwind utility proliferation

**Why bad:**
- Unstyled primitives are unusable without developer styling
- Tailwind bloat from over-customization

**Instead:**
- Every Radix primitive gets base Tailwind styling in design system
- Apps extend, don't rewrite
- Use Tailwind's @apply sparingly; prefer component classes

### Anti-Pattern 6: No Type Safety on Variants
**What:** variant prop accepts string without validation

**Why bad:**
- Typos go undetected: `<Button variant="primry" />`
- Developers rely on trial-and-error

**Instead:**
```typescript
type ButtonVariant = 'primary' | 'secondary' | 'destructive';

interface ButtonProps {
  variant?: ButtonVariant;
}
```

## Scalability Considerations

| Concern | At 10 Apps | At 50 Apps | At 200+ Apps |
|---------|-----------|-----------|-------------|
| **Component Count** | 15-20 atoms + 5 compounds | 30+ atoms + 15 compounds | 50+ atoms + 30+ compounds; modular exports |
| **Token Management** | Single colors.ts | Split tokens/ directory; theme variants | Token registry; design-time tooling (Supernova) |
| **Build Time** | Vite 8 < 5s | Vite 8 < 10s | Vite 8 < 15s; consider esbuild for library output |
| **Bundle Size** | 50 KB gzipped atoms | 100 KB gzipped; lazy-load compounds | 150-200 KB; require tree-shaking; document bundle splits |
| **Breaking Changes** | Deprecate aggressively; minor API changes | Semantic versioning strict; beta releases | Aligned release schedule; feature flags |
| **Designer Handoff** | Manual Figma-to-Storybook | Automated sync (Storybook Figma plugin) | Supernova or similar; component-as-contract |
| **Documentation** | Storybook + README | Storybook + detailed guides + recipes | Storybook + guides + API docs + migration paths |
| **Testing** | Vitest coverage > 80% | Vitest + Chromatic visual; a11y audits | Vitest + Chromatic + percy for fine-grained visual testing |

## File Structure

```
redtab-design-system/
├── src/
│   ├── tokens/
│   │   ├── colors.ts          # Primary token source
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   ├── shadows.ts
│   │   ├── index.ts           # Barrel export: re-export all tokens
│   │   └── themes.ts          # Theme variants (dark, light, brand-specific)
│   │
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx      # Component implementation
│   │   │   ├── Button.test.tsx # Unit tests
│   │   │   └── Button.stories.tsx # Storybook stories
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   ├── Input.test.tsx
│   │   │   └── Input.stories.tsx
│   │   ├── Card/
│   │   │   ├── Card.tsx        # Compound component
│   │   │   └── Card.stories.tsx
│   │   ├── Modal/
│   │   │   ├── Modal.tsx       # Radix Dialog wrapper
│   │   │   ├── Modal.test.tsx
│   │   │   └── Modal.stories.tsx
│   │   └── index.ts            # Barrel: export all components
│   │
│   ├── hooks/
│   │   ├── useTheme.ts         # Theme context hook (optional)
│   │   ├── useDarkMode.ts      # Dark mode preference (optional)
│   │   └── index.ts
│   │
│   └── index.ts               # Main entry point; re-exports components + tokens
│
├── .storybook/
│   ├── main.ts                # Storybook config (Vite-based)
│   ├── preview.tsx            # Global decorators, theme provider
│   └── tailwind.config.ts      # Tailwind config for Storybook preview
│
├── tests/
│   ├── setup.ts               # Vitest setup (jsdom, RTL)
│   └── mocks/                 # Mock Radix components if needed
│
├── tailwind.config.ts         # Tailwind config (imports tokens)
├── vite.config.ts             # Vite library build config
├── vitest.config.ts           # Vitest unit test config
├── tsconfig.json              # TypeScript config
└── package.json               # Exports, scripts, dependencies
```

## Testing Strategy by Component Type

| Component Type | Unit Tests | Integration Tests | Visual Tests | Accessibility |
|---|---|---|---|---|
| **Atoms (Button, Input)** | Render + props | Click handlers, state changes | Storybook snapshot + Chromatic | Axe in Chromatic |
| **Compounds (Card, Form)** | Composition | Multiple elements interacting | Storybook responsive preview | Axe |
| **Radix Wrappers (Modal, Menu)** | Prop passing | Keyboard nav (arrows, escape) | Chromatic | Axe + manual NVDA/VO |
| **Tokens + Theme** | TypeScript types | Dark mode switching | Visual regression (Chromatic) | N/A |

---

## Performance Optimization

1. **Tree-shaking:** All components individually importable
   ```typescript
   // Good: tree-shakes unused components
   import { Button } from '@redtab/ds';

   // Bad: imports entire library
   import * as DS from '@redtab/ds';
   ```

2. **Code splitting:** Storybook uses dynamic imports per story
   ```typescript
   // Storybook auto-handles this via Vite
   ```

3. **CSS bundling:** Tailwind's PurgeCSS removes unused utilities
   ```typescript
   // All components use actual class names; Tailwind finds them at build time
   ```

4. **TypeScript declaration files:** Pre-generated .d.ts for fast IDE support
   ```json
   {
     "declaration": true,
     "declarationMap": true
   }
   ```

5. **Monorepo consideration:** If multiple design systems, use npm workspaces
   ```
   redtab-monorepo/
   ├── packages/ds-core/
   ├── packages/ds-icons/
   └── packages/ds-web/
   ```
