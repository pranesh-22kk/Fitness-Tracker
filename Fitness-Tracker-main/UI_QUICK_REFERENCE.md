# UI Components Quick Reference

## Quick Import
```jsx
import { StatCard, DataCard, FormInput, GradientButton, Modal, LoadingSpinner } 
  from '../components/common';
```

## StatCard
```jsx
<StatCard
  title="Title"
  value="999"
  icon={IconComponent}
  subtitle="subtitle"
  trend={{ value: '+5%', direction: 'up' }}
  color="primary" // primary | purple | success | warning | danger | info
  isGlass={false}
  delay={0}
/>
```

## DataCard
```jsx
<DataCard
  title="Title"
  icon={<Icon />}
  variant="default" // default | elevated | glass | gradient
  footer="Footer text"
  action={<Button />}
  delay={0}
>
  Content here
</DataCard>
```

## FormInput
```jsx
<FormInput
  label="Label"
  type="text"
  placeholder="Placeholder"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  icon={IconComponent}
  required={false}
  error={errorMessage}
  helpText="Help text"
  disabled={false}
/>
```

## GradientButton
```jsx
<GradientButton
  onClick={handleClick}
  type="button" // button | submit | reset
  variant="primary" // primary | secondary | success | danger | ghost
  size="md" // sm | md | lg
  disabled={false}
  isLoading={false}
  icon={IconComponent}
>
  Button Text
</GradientButton>
```

## Modal
```jsx
const [open, setOpen] = useState(false);

<Modal
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Modal Title"
  size="md" // sm | md | lg | xl
  footer={<div>Footer content</div>}
>
  Modal content
</Modal>
```

## LoadingSpinner
```jsx
<LoadingSpinner
  size="md" // sm | md | lg
  fullScreen={false}
/>
```

## CSS Utility Classes
```html
<!-- Glassmorphism -->
<div class="glass">Glassmorphic</div>
<div class="glass-medium">Medium glass</div>

<!-- Cards -->
<div class="card">Card</div>
<div class="card-elevated">Elevated</div>
<div class="card-gradient">Gradient</div>

<!-- Buttons -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-ghost">Ghost</button>

<!-- Badges -->
<span class="badge">Default</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Danger</span>

<!-- Layout -->
<div class="grid grid-2">2 equal cols</div>
<div class="grid grid-3">3 equal cols</div>
<div class="grid grid-4">4 equal cols</div>

<div class="flex flex-center">Centered flex</div>
<div class="flex flex-between">Space between</div>
<div class="flex flex-col">Vertical</div>
<div class="flex gap-md">With gap</div>

<!-- Typography -->
<h1 class="heading-1">Heading 1</h1>
<h2 class="heading-2">Heading 2</h2>
<h3 class="heading-3">Heading 3</h3>
<h4 class="heading-4">Heading 4</h4>

<p class="text-muted">Muted</p>
<p class="text-sm">Small</p>
<p class="text-xs">Extra small</p>

<!-- Animations -->
<div class="animate-fade-in">Fade in</div>
<div class="animate-slide-in-up">Slide up</div>
<div class="animate-slide-in-down">Slide down</div>
<div class="animate-pulse">Pulse</div>
<div class="animate-glow">Glow</div>

<!-- Containers -->
<div class="container">Max 1200px</div>
<div class="container-sm">Max 800px</div>
```

## CSS Variables

### Colors
```scss
--accent-primary: #667eea
--accent-purple: #764ba2
--accent-pink: #f093fb
--accent-success: #26de81
--accent-warning: #ffd93d
--accent-danger: #ff6b6b
--accent-info: #4fc3f7

--text-primary: #ffffff
--text-secondary: #b0b0c0
--text-muted: #808090

--bg-primary: #0f0f1e
--bg-secondary: #1a1a2e
--bg-tertiary: #242842
--bg-elevated: #2d2d47
```

### Spacing
```scss
--space-xs: 0.25rem
--space-sm: 0.5rem
--space-md: 1rem
--space-lg: 1.5rem
--space-xl: 2rem
--space-2xl: 3rem
```

### Radius
```scss
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 24px
--radius-full: 9999px
```

### Shadows
```scss
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2)
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.3)
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.4)
--shadow-xl: 0 12px 48px rgba(0, 0, 0, 0.5)
--shadow-glow: 0 0 20px rgba(102, 126, 234, 0.3)
```

### Transitions
```scss
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1)
```

## Common Patterns

### Staggered Animation
```jsx
{items.map((item, index) => (
  <StatCard 
    key={item.id}
    {...item}
    delay={index * 0.1}
  />
))}
```

### Form with Validation
```jsx
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');

const validateEmail = (value) => {
  if (!value.includes('@')) {
    setEmailError('Invalid email');
  } else {
    setEmailError('');
  }
};

<FormInput
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  onBlur={() => validateEmail(email)}
  error={emailError}
  required
/>
```

### Dashboard Layout
```jsx
<div class="container">
  <div class="grid grid-4">
    <StatCard ... />
    <StatCard ... />
    <StatCard ... />
    <StatCard ... />
  </div>
  
  <div class="grid grid-2" style={{ marginTop: '2rem' }}>
    <DataCard variant="elevated" ... />
    <DataCard variant="elevated" ... />
  </div>
</div>
```

### Modal with Actions
```jsx
const [open, setOpen] = useState(false);

<Modal
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Confirm"
  footer={
    <div style={{ display: 'flex', gap: '1rem' }}>
      <GradientButton 
        variant="ghost"
        onClick={() => setOpen(false)}
      >
        Cancel
      </GradientButton>
      <GradientButton 
        onClick={() => {
          handleAction();
          setOpen(false);
        }}
      >
        Confirm
      </GradientButton>
    </div>
  }
>
  Are you sure?
</Modal>
```

## File Locations
- Components: `src/components/common/`
- Global Styles: `src/app.scss`
- Navbar: `src/components/navbar/navbar.scss`
- Showcase: `src/pages/uiShowcase/UIShowcase.jsx`
- Documentation: `UI_ENHANCEMENT_GUIDE.md`

## Tips
✨ Always use `delay` prop for staggered animations
🎨 Use color variants for semantic meaning
📱 Test responsive behavior on mobile
♿ Include proper labels for accessibility
⚡ Lazy load heavy components
🔄 Use `isLoading` state on buttons during async operations
