# Fitness Tracker - UI Enhancement Guide

## Overview

The Fitness Tracker now features a modern, cohesive design system with improved visual hierarchy, consistency, and user experience. This guide explains the new UI components and design tokens available for development.

---

## Design Tokens

All design values are defined as CSS variables in `app.scss`:

### Colors
- **Primary**: `var(--accent-primary)` - #667eea (Purple-blue)
- **Secondary**: `var(--accent-purple)` - #764ba2 (Purple)
- **Accent**: `var(--accent-pink)` - #f093fb (Pink)
- **Success**: `var(--accent-success)` - #26de81 (Green)
- **Warning**: `var(--accent-warning)` - #ffd93d (yellow)
- **Danger**: `var(--accent-danger)` - #ff6b6b (Red)
- **Info**: `var(--accent-info)` - #4fc3f7 (Light Blue)

### Backgrounds
- `var(--bg-primary)` - Main background (#0f0f1e)
- `var(--bg-secondary)` - Cards & elevated surfaces (#1a1a2e)
- `var(--bg-tertiary)` - Tertiary background (#242842)
- `var(--bg-elevated)` - Highly elevated surfaces (#2d2d47)

### Text
- `var(--text-primary)` - Main text (white)
- `var(--text-secondary)` - Secondary text (#b0b0c0)
- `var(--text-muted)` - Muted text (#808090)

### Spacing
- `var(--space-xs)` - 0.25rem
- `var(--space-sm)` - 0.5rem
- `var(--space-md)` - 1rem
- `var(--space-lg)` - 1.5rem
- `var(--space-xl)` - 2rem
- `var(--space-2xl)` - 3rem

### Border Radius
- `var(--radius-sm)` - 8px
- `var(--radius-md)` - 12px
- `var(--radius-lg)` - 16px
- `var(--radius-xl)` - 24px

### Shadows
- `var(--shadow-sm)` - Small shadow
- `var(--shadow-md)` - Medium shadow
- `var(--shadow-lg)` - Large shadow
- `var(--shadow-xl)` - Extra large shadow
- `var(--shadow-glow)` - Glow effect

### Transitions
- `var(--transition-fast)` - 150ms
- `var(--transition-normal)` - 300ms
- `var(--transition-slow)` - 500ms

---

## Reusable Components

### 1. StatCard

**Purpose**: Display metrics with title, value, icon, and optional trend

**Location**: `src/components/common/StatCard.jsx`

**Props**:
- `title` (string) - Card title
- `value` (string/number) - Main value display
- `icon` (Component) - Icon to display
- `subtitle` (string) - Optional subtitle
- `trend` (object) - Optional trend with value and direction (up/down)
- `color` (string) - Color variant: primary, purple, success, warning, danger, info
- `isGlass` (boolean) - Enable glassmorphism
- `delay` (number) - Animation delay

**Example**:
```jsx
import { StatCard } from '../components/common';
import { FiActivity } from 'react-icons/fi';

<StatCard
  title="Calories Burned"
  value="2,450"
  icon={FiActivity}
  subtitle="Today"
  trend={{ value: '+12%', direction: 'up' }}
  color="primary"
  delay={0}
/>
```

### 2. DataCard

**Purpose**: Display detailed information in a structured card

**Location**: `src/components/common/DataCard.jsx`

**Props**:
- `title` (string) - Card title
- `children` (ReactNode) - Card content
- `icon` (Component) - Icon to display
- `footer` (ReactNode) - Optional footer content
- `action` (ReactNode) - Optional action button/element
- `variant` (string) - Style variant: default, elevated, glass, gradient
- `delay` (number) - Animation delay

**Example**:
```jsx
import { DataCard } from '../components/common';
import { FiUsers } from 'react-icons/fi';

<DataCard
  title="Workout Summary"
  icon={<FiUsers />}
  variant="elevated"
  footer="Last updated: 2 hours ago"
>
  <p>Your content here</p>
</DataCard>
```

### 3. FormInput

**Purpose**: Modern form input with label, error handling, and icons

**Location**: `src/components/common/FormInput.jsx`

**Props**:
- `label` (string) - Input label
- `type` (string) - Input type (text, email, password, etc.)
- `placeholder` (string) - Placeholder text
- `value` (string) - Input value
- `onChange` (function) - Change handler
- `onBlur` (function) - Blur handler
- `error` (string) - Error message to display
- `icon` (Component) - Icon component
- `required` (boolean) - Show required asterisk
- `helpText` (string) - Help text below input
- `disabled` (boolean) - Disable input

**Example**:
```jsx
import { FormInput } from '../components/common';
import { FiMail } from 'react-icons/fi';
import { useState } from 'react';

const [email, setEmail] = useState('');

<FormInput
  label="Email"
  type="email"
  placeholder="your@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  icon={FiMail}
  required
/>
```

### 4. GradientButton

**Purpose**: Modern button with gradient, hover effects, and loading state

**Location**: `src/components/common/GradientButton.jsx`

**Props**:
- `children` (ReactNode) - Button text
- `onClick` (function) - Click handler
- `type` (string) - Button type: button, submit, reset
- `variant` (string) - Style: primary, secondary, success, danger, ghost
- `size` (string) - Size: sm, md, lg
- `disabled` (boolean) - Disable button
- `isLoading` (boolean) - Show loading state
- `icon` (Component) - Icon component

**Example**:
```jsx
import { GradientButton } from '../components/common';
import { FiSave } from 'react-icons/fi';
import { useState } from 'react';

const [isLoading, setIsLoading] = useState(false);

<GradientButton
  onClick={() => handleSave()}
  variant="primary"
  size="lg"
  icon={FiSave}
  isLoading={isLoading}
>
  Save Changes
</GradientButton>
```

### 5. Modal

**Purpose**: Overlay dialog with backdrop and animations

**Location**: `src/components/common/Modal.jsx`

**Props**:
- `isOpen` (boolean) - Control modal visibility
- `onClose` (function) - Close handler
- `title` (string) - Modal title
- `children` (ReactNode) - Modal content
- `footer` (ReactNode) - Optional footer with actions
- `size` (string) - Size: sm, md, lg, xl

**Example**:
```jsx
import { Modal } from '../components/common';
import { useState } from 'react';

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
>
  <p>Are you sure you want to continue?</p>
</Modal>
```

### 6. LoadingSpinner

**Purpose**: Animated loading indicator

**Location**: `src/components/common/LoadingSpinner.jsx`

**Props**:
- `size` (string) - Size: sm, md, lg
- `fullScreen` (boolean) - Show centered on screen

**Example**:
```jsx
import { LoadingSpinner } from '../components/common';

<LoadingSpinner size="md" />
```

---

## Utility Classes

### Glassmorphism
```html
<div class="glass">Glassmorphic content</div>
<div class="glass-medium">Medium glass effect</div>
```

### Cards
```html
<div class="card">Standard card</div>
<div class="card-elevated">Elevated card with shadow</div>
<div class="card-gradient">Card with gradient background</div>
```

### Buttons (CSS-only)
```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-ghost">Ghost Button</button>
```

### Badges
```html
<span class="badge">Default Badge</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Danger</span>
```

### Layout
```html
<!-- Responsive Grid -->
<div class="grid grid-3">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Flexbox Utilities -->
<div class="flex flex-between gap-lg">
  <span>Left</span>
  <span>Right</span>
</div>

<!-- Container -->
<div class="container">Centered content (max 1200px)</div>
<div class="container-sm">Centered content (max 800px)</div>
```

### Typography
```html
<h1 class="heading-1">Large Heading</h1>
<h2 class="heading-2">Medium Heading</h2>
<p class="text-muted">Muted text</p>
<p class="text-sm">Small text</p>
```

### Animations
```html
<div class="animate-fade-in">Fades in</div>
<div class="animate-slide-in-up">Slides up</div>
<div class="animate-pulse">Pulsing animation</div>
<div class="animate-glow">Glowing effect</div>
```

---

## Implementation Tips

### Import Components
```jsx
import { 
  StatCard, 
  DataCard, 
  FormInput, 
  GradientButton, 
  Modal, 
  LoadingSpinner 
} from '../components/common';
```

### Use Framer Motion Animations
Most components use Framer Motion for smooth animations. Control stagger and delay:

```jsx
// Multiple cards with staggered animation
{items.map((item, index) => (
  <StatCard 
    key={item.id}
    {...item}
    delay={index * 0.1}
  />
))}
```

### Responsive Design
All components are mobile-responsive. Use CSS media queries in `app.scss`:

```scss
@media (max-width: 768px) {
  // Mobile styles
}
```

### Color Variants
Components support multiple color variants. Choose based on context:

```jsx
<StatCard color="success" /> // Green
<StatCard color="danger" /> // Red
<StatCard color="warning" /> // Yellow
```

---

## Examples

### Dashboard Layout
```jsx
<div class="container">
  <div class="grid grid-4">
    <StatCard title="Steps" value="12,450" color="primary" />
    <StatCard title="Calories" value="2,450" color="danger" />
    <StatCard title="Water" value="2.5L" color="info" />
    <StatCard title="Sleep" value="7.5h" color="success" />
  </div>
  
  <div class="grid grid-2" style="margin-top: 2rem;">
    <DataCard title="Recent Workouts" variant="elevated">
      {/* Content */}
    </DataCard>
    <DataCard title="Nutrition" variant="elevated">
      {/* Content */}
    </DataCard>
  </div>
</div>
```

### Form
```jsx
<form onSubmit={handleSubmit} class="container-sm">
  <FormInput
    label="Full Name"
    placeholder="John Doe"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
  />
  
  <FormInput
    label="Email"
    type="email"
    placeholder="your@email.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    error={emailError}
    required
  />
  
  <GradientButton type="submit" size="lg">
    Submit
  </GradientButton>
</form>
```

---

## Best Practices

1. **Use Design Tokens**: Always reference CSS variables instead of hardcoding colors/spacing
2. **Animate Meaningfully**: Use animations to guide attention, not distract
3. **Mobile First**: Design for mobile, then enhance for larger screens
4. **Accessibility**: Ensure proper contrast, ARIA labels, and keyboard navigation
5. **Performance**: Lazy load images, optimize animations, use proper asset formats
6. **Consistency**: Stick to the design system for visual coherence

---

## File Structure

```
frontend/src/
├── components/
│   ├── common/
│   │   ├── StatCard.jsx
│   │   ├── StatCard.scss
│   │   ├── DataCard.jsx
│   │   ├── DataCard.scss
│   │   ├── FormInput.jsx
│   │   ├── FormInput.scss
│   │   ├── GradientButton.jsx
│   │   ├── GradientButton.scss
│   │   ├── Modal.jsx
│   │   ├── Modal.scss
│   │   ├── LoadingSpinner.jsx
│   │   ├── LoadingSpinner.scss
│   │   └── index.js
│   ├── navbar/
│   └── ...
├── app.scss (Design Tokens)
└── ...
```

---

## Next Steps

1. Update existing pages to use the new components
2. Implement consistent spacing and layout using grid utilities
3. Add more interactive components as needed
4. Conduct user testing for UI/UX improvements
5. Monitor performance and optimize animations
