# TaskFlow Global Styles & Tailwind Configuration

This directory contains the styling system for TaskFlow, including CSS custom properties, global styles, and Tailwind CSS extensions.

## CSS Architecture

### 1. `index.css` - Global Stylesheet
The main stylesheet with:
- **CSS Custom Properties** — Semantic color variables, spacing, shadows
- **Base Styles** — HTML/body reset, typography, form elements
- **Component Classes** — Reusable `.card`, `.badge`, `.button` classes
- **Animations** — Keyframe definitions and utility classes
- **Dark Mode** — Color overrides for `prefers-color-scheme: dark`
- **Responsive** — Mobile-first breakpoints and touch targets
- **Accessibility** — Focus-visible states and semantic HTML support

### 2. `animations.css` - Animation Utilities
Additional animation helpers:
- Animation delays for staggered effects
- Skeleton shimmer for loading states
- Smooth, fast, slow transition utilities
- Drag/drop state styling

## CSS Custom Properties

All CSS variables are defined in `:root` for consistent theming:

### Colors

#### Primary (Blue)
```css
--color-primary-50:  #f0f9ff
--color-primary-100: #e0f2fe
--color-primary-500: #0ea5e9  /* Main brand color */
--color-primary-600: #0284c7
--color-primary-700: #0369a1
--color-primary-900: #0c3d66
```

#### Secondary (Gray - Neutral)
```css
--color-secondary-50:  #f9fafb
--color-secondary-500: #6b7280
--color-secondary-700: #374151
--color-secondary-900: #111827
```

#### Status Colors
```css
--color-success: #10b981  /* Green - completed tasks */
--color-warning: #f59e0b  /* Yellow - blocked/at-risk */
--color-error:   #ef4444  /* Red - errors/deletions */
--color-info:    #3b82f6  /* Blue - informational */
```

#### Task Board States
```css
--color-task-todo:         #f3f4f6  /* Light gray */
--color-task-in-progress:  #dbeafe  /* Light blue */
--color-task-completed:    #ecfdf5  /* Light green */
--color-task-blocked:      #fef3c7  /* Light yellow */
```

#### Text & Background
```css
--color-text-primary:   #111827  /* Main text */
--color-text-secondary: #6b7280  /* Secondary text */
--color-text-tertiary:  #9ca3af  /* Subtle text */

--color-bg-primary:   #ffffff   /* Main background */
--color-bg-secondary: #f9fafb   /* Card backgrounds */
--color-bg-tertiary:  #f3f4f6   /* Hover backgrounds */
```

### Spacing
```css
--spacing-xs:  0.25rem (4px)
--spacing-sm:  0.5rem  (8px)
--spacing-md:  1rem    (16px)
--spacing-lg:  1.5rem  (24px)
--spacing-xl:  2rem    (32px)
--spacing-2xl: 3rem    (48px)
--spacing-3xl: 4rem    (64px)
```

### Border Radius
```css
--radius-sm:   0.25rem  (4px)
--radius-md:   0.5rem   (8px)
--radius-lg:   0.75rem  (12px)
--radius-xl:   1rem     (16px)
--radius-2xl:  1.5rem   (24px)
```

### Shadows (Elevation)
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
--shadow-md: 0 4px 6px rgba(0,0,0,0.1)
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1)
--shadow-xl: 0 20px 25px rgba(0,0,0,0.1)
```

### Transitions
```css
--transition-fast:   150ms ease-in-out
--transition-normal: 250ms ease-in-out
--transition-slow:   350ms ease-in-out
```

## Component Classes

### Card
```html
<div class="card">
  <!-- Content here -->
</div>

<!-- Elevated variant with more shadow -->
<div class="card card--elevated">
  <!-- Prominent card -->
</div>
```

### Badge
```html
<!-- Primary (default color) -->
<span class="badge badge--primary">Active</span>

<!-- Success (green) -->
<span class="badge badge--success">Completed</span>

<!-- Warning (yellow) -->
<span class="badge badge--warning">At Risk</span>

<!-- Error (red) -->
<span class="badge badge--error">Blocked</span>
```

### Button
```html
<!-- Primary action button -->
<button class="button button--primary">Save</button>

<!-- Secondary button -->
<button class="button button--secondary">Cancel</button>

<!-- Ghost button (outline style) -->
<button class="button button--ghost">Learn More</button>

<!-- Disabled state -->
<button class="button button--primary" disabled>Disabled</button>
```

### Task Cards (Kanban)
```html
<!-- Base task card -->
<div class="task-card">
  <h3>Task Title</h3>
  <p>Task description</p>
</div>

<!-- Completed task -->
<div class="task-card task-card--completed">
  <h3>Done Task</h3>
</div>

<!-- Blocked task -->
<div class="task-card task-card--blocked">
  <h3>Blocked Task</h3>
</div>

<!-- High priority -->
<div class="task-card task-card--high-priority">
  <h3>Urgent Task</h3>
</div>
```

### Task Column (Kanban board column)
```html
<div class="task-column">
  <h2>To Do</h2>
  <div class="task-card">Card 1</div>
  <div class="task-card">Card 2</div>
</div>
```

## Animations

### Keyframes Available
- `fadeIn` - Fade in from transparent
- `slideInUp` - Slide up from below
- `slideInDown` - Slide down from above
- `slideInLeft` - Slide in from left
- `slideInRight` - Slide in from right
- `pulse` - Soft pulse opacity
- `spin` - Continuous rotation
- `bounce` - Bouncy up-down motion
- `shimmer` - Loading shimmer effect

### Using Animations

#### CSS
```css
.modal {
  animation: slideInDown 250ms ease-in-out;
}

.loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

#### HTML with Utility Classes
```html
<!-- Fade in -->
<div class="animate-fade-in">Content</div>

<!-- Slide up -->
<div class="animate-slide-in-up">Modal</div>

<!-- Custom timing -->
<div class="animate-delay-200">Staggered item</div>

<!-- Pulse attention -->
<div class="pulse-attention">Important info</div>
```

## Tailwind CSS Extensions

The `tailwind.config.js` extends the default Tailwind theme with:

### Extended Colors
All CSS variables are converted to Tailwind utilities:
- `text-primary-600`, `bg-primary-50`, `border-primary-700`
- `text-success-500`, `bg-warning-100`, `text-error-600`
- `bg-task-todo`, `bg-task-in-progress`, etc.

### Extended Animations
```html
<!-- Fade animations -->
<div class="animate-fade-in">Quick fade</div>
<div class="animate-fade-in-slow">Slower fade</div>

<!-- Slide animations -->
<div class="animate-slide-in-up">Up slide</div>
<div class="animate-slide-in-down">Down slide</div>
<div class="animate-slide-in-left">Left slide</div>
<div class="animate-slide-in-right">Right slide</div>

<!-- Custom animations -->
<div class="animate-pulse-soft">Soft pulse</div>
<div class="animate-spin-slow">Slow spin</div>
<div class="animate-bounce-soft">Soft bounce</div>
<div class="animate-shimmer">Shimmer effect</div>
```

### Transition Utilities
```html
<!-- Fast transitions (150ms) -->
<button class="transition-fast duration-fast">Hover me</button>

<!-- Normal transitions (250ms) -->
<div class="transition-normal duration-normal">Changes</div>

<!-- Slow transitions (350ms) -->
<div class="transition-slow duration-slow">Dramatic</div>
```

### Custom Shadows
```html
<!-- Card shadows -->
<div class="shadow-card">Card shadow</div>
<div class="shadow-card-hover">Hover shadow</div>

<!-- All elevation levels -->
<div class="shadow-xs">Extra small</div>
<div class="shadow-sm">Small</div>
<div class="shadow-md">Medium</div>
<div class="shadow-lg">Large</div>
<div class="shadow-xl">Extra large</div>
```

### Kanban Utilities
```html
<!-- Min-height for columns -->
<div class="min-h-kanban">Tall column (500px)</div>
<div class="min-h-kanban-sm">Short column (400px)</div>

<!-- Touch targets -->
<button class="min-h-touch-target">Touchable button</button>

<!-- Card sizing -->
<div class="min-w-card">Task card (280px min)</div>

<!-- Z-index layers -->
<div class="z-dropdown">Dropdown menu</div>
<div class="z-modal">Modal dialog</div>
<div class="z-tooltip">Tooltip popup</div>
```

### Responsive Spacing
```html
<!-- Safe area support for mobile notches/home bar -->
<div class="pb-safe">Padding with safe-area</div>
<div class="pl-safe-left">Left safe-area padding</div>
<div class="pr-safe-right">Right safe-area padding</div>
```

### Cursor Utilities
```html
<!-- Draggable elements -->
<div class="cursor-grab">Hover to grab</div>
<div class="cursor-grabbing">Currently grabbing</div>
```

## Dark Mode Support

The stylesheet automatically adapts to `prefers-color-scheme: dark`:

```css
@media (prefers-color-scheme: dark) {
  --color-text-primary:   #f9fafb     /* Light text */
  --color-text-secondary: #d1d5db
  --color-bg-primary:     #111827     /* Dark background */
  --color-bg-secondary:   #1f2937
  --color-border-light:   #374151
}
```

No additional work needed — dark mode just works!

## Responsive Design

### Mobile Breakpoint
At `max-width: 640px`, the following adjustments apply:
- Font size reduced to 14px
- Container padding reduced
- Card padding reduced
- Kanban column min-height reduced to 400px

### Touch-Friendly
- Minimum touch target: 44px (via `min-h-touch-target`)
- Safe areas respected on iOS with notch/home bar
- Larger tap targets for buttons and interactive elements

## Accessibility

### Focus Styles
All interactive elements have clear focus indicators:
```css
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

### Semantic HTML
Base styles support proper heading hierarchy and semantic elements:
```html
<h1>Page title</h1>
<h2>Section heading</h2>
<h3>Subsection</h3>
<p>Regular paragraph text</p>
<a href="#">Link text</a>
```

### Motion
Animations respect `prefers-reduced-motion` through reasonable defaults (avoiding excessive movement).

## Usage Examples

### Loading State
```html
<div class="skeleton rounded-lg w-full h-24"></div>
```

### Task Card with Animation
```html
<div class="task-card animate-slide-in-up">
  <h3 class="text-primary-900">Build feature</h3>
  <p class="text-secondary-600">Due tomorrow</p>
  <span class="badge badge--warning">In Progress</span>
</div>
```

### Modal with Backdrop
```html
<div class="fixed inset-0 bg-black/50 z-modal-backdrop animate-fade-in">
  <div class="card animate-slide-in-down">
    <h2>Confirm Action</h2>
    <p>Are you sure?</p>
    <button class="button button--primary">Confirm</button>
    <button class="button button--secondary">Cancel</button>
  </div>
</div>
```

### Button with Hover Effect
```html
<button class="button button--primary transition-smooth hover:shadow-lg">
  Save Changes
</button>
```

## Best Practices

1. **Use CSS Variables** for consistency: `color: var(--color-primary-600);`
2. **Prefer Tailwind Classes** for responsive design: `md:text-lg`, `sm:px-2`
3. **Combine Components** - layer `.card` with Tailwind: `<div class="card p-6 shadow-lg">`
4. **Animations** - use for entrance/attention, not excessive: `animate-fade-in`
5. **Shadows** - use elevation levels, not arbitrary values: `shadow-md`, `shadow-lg`
6. **Colors** - use status colors for meaning: `text-success-600`, `bg-error-50`

## File Organization

```
frontend/src/
├── index.css              ← Global styles (imports Tailwind)
├── styles/
│   ├── animations.css     ← Extra animation utilities
│   └── README.md          ← This file
├── components/            ← React components use these styles
├── pages/                 ← Page layouts
└── ...
```

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties (Variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)
- [Accessibility (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
