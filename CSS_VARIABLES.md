# CSS Variables System - XO1.618

## Design Philosophy

- **Minimal Design**: Clean, aesthetic like Monkeytype
- **Modern Typography**: Inter font family for readability
- **Subtle Colors**: Grayscale palette with gentle contrast
- **Easy Customization**: All styling controlled through CSS variables
- **Centered Layout**: Beautiful, centered post presentation

## Color System

```css
--base: #ffffff; /* Primary background */
--base-secondary: #fafafa; /* Secondary background */
--on-base: #171717; /* Primary text */
--on-base-secondary: #525252; /* Secondary text */
--on-base-tertiary: #a3a3a3; /* Tertiary text */
--accent: #e5e5e5; /* Accent background */
--border: #e5e5e5; /* Border color */
```

## Typography System

```css
--font-family: "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", "SF Mono", Monaco, "Cascadia Code",
  monospace;
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;
--font-size-xl: 20px;
--font-size-2xl: 24px;
--font-size-3xl: 28px;
--font-size-4xl: 32px;
--font-size-5xl: 36px;
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

## Spacing System

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

## Border System

```css
--border-width: 1px;
--border-color: var(--border);
--border-radius: 8px;
--border-radius-sm: 4px;
--border-radius-lg: 12px;
```

## Layout System

```css
--max-width: 680px;
--max-width-wide: 800px;
--container-padding: var(--space-6);
```

## Shadow System

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

## How to Customize

### Change Colors

To change the color scheme, simply update the color variables in `src/index.css`:

```css
:root {
  --base: #f0f0f0; /* Light gray background */
  --base-secondary: #e0e0e0; /* Darker gray */
  --on-base: #1a1a1a; /* Dark text */
  --on-base-secondary: #4a4a4a; /* Medium gray text */
  --on-base-tertiary: #8a8a8a; /* Light gray text */
}
```

### Change Typography

To change fonts, update the typography variables:

```css
:root {
  --font-family: "Helvetica", "Arial", sans-serif;
  --font-size-base: 18px;
  --font-weight-normal: 300;
}
```

### Change Spacing

To adjust spacing throughout the app:

```css
:root {
  --space-sm: 12px; /* Increase small spacing */
  --space-md: 20px; /* Increase medium spacing */
  --space-lg: 32px; /* Increase large spacing */
}
```

## Component Classes

### Layout

- `.container` - Max-width container with padding
- `.text-center` - Center-aligned text
- `.text-left` - Left-aligned text
- `.text-right` - Right-aligned text

### Spacing

- `.mt-xs`, `.mt-sm`, `.mt-md`, `.mt-lg`, `.mt-xl` - Margin top
- `.mb-xs`, `.mb-sm`, `.mb-md`, `.mb-lg`, `.mb-xl` - Margin bottom
- `.p-xs`, `.p-sm`, `.p-md`, `.p-lg`, `.p-xl` - Padding

### States

- `.loading` - Loading state styling
- `.no-posts` - Empty state styling
- `.warning-banner` - Warning/notification styling

## Design Principles

1. **Consistency**: All elements use the same spacing, typography, and color system
2. **Accessibility**: High contrast ratios and clear typography
3. **Performance**: No complex animations or effects
4. **Maintainability**: Easy to modify through CSS variables
5. **Brutal Aesthetic**: Sharp, technical, no-nonsense design

## Browser Support

- Modern browsers with CSS custom properties support
- Fallbacks provided for older browsers
- Mobile-responsive design included
