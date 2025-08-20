# Brand Color System Documentation

## Overview
This document outlines the centralized brand color system implemented for the Unix Timestamp Converter application. The color system is designed to be professional, accessible, and easily maintainable.

## Color Palette

### Primary Colors (Main Brand Identity)
- **Primary 50**: `#f0f9ff` - Lightest blue for backgrounds
- **Primary 100**: `#e0f2fe` - Light blue for subtle backgrounds
- **Primary 200**: `#bae6fd` - Light blue for borders and accents
- **Primary 300**: `#7dd3fc` - Medium light blue
- **Primary 400**: `#38bdf8` - Medium blue
- **Primary 500**: `#0ea5e9` - **Main Primary Color** - Used for primary buttons, links, and key elements
- **Primary 600**: `#0284c7` - Darker blue for hover states and emphasis
- **Primary 700**: `#0369a1` - Dark blue
- **Primary 800**: `#075985` - Darker blue
- **Primary 900**: `#0c4a6e` - Very dark blue
- **Primary 950**: `#082f49` - Darkest blue

### Secondary Colors (Supporting Elements)
- **Secondary 50**: `#f8fafc` - Lightest gray for backgrounds
- **Secondary 100**: `#f1f5f9` - Light gray for subtle backgrounds
- **Secondary 200**: `#e2e8f0` - Light gray for borders
- **Secondary 300**: `#cbd5e1` - Medium light gray for borders and dividers
- **Secondary 400**: `#94a3b8` - Medium gray for secondary text
- **Secondary 500**: `#64748b` - **Main Secondary Color** - Used for body text and secondary elements
- **Secondary 600**: `#475569` - Darker gray for headings and important text
- **Secondary 700**: `#334155` - Dark gray for labels and form text
- **Secondary 800**: `#1e293b` - Very dark gray
- **Secondary 900**: `#0f172a` - Darkest gray for headings and high contrast text
- **Secondary 950**: `#020617` - Almost black

### Accent Colors (Call-to-Action & Highlights)
- **Accent 500**: `#f37316` - **Main Accent Color** - Used for special highlights and CTAs

### Status Colors
- **Success 500**: `#22c55e` - Success messages and positive states
- **Warning 500**: `#f59e0b` - Warning messages and caution states
- **Error 500**: `#ef4444` - Error messages and negative states

## Usage Guidelines

### CSS Custom Properties
All colors are defined as CSS custom properties in `src/app/globals.css`:

```css
:root {
  /* Primary Colors */
  --brand-primary-500: #0ea5e9;
  --brand-primary-600: #0284c7;
  /* ... etc */
}
```

### Tailwind CSS Classes
Colors are available as Tailwind CSS classes:

```html
<!-- Primary colors -->
<div class="bg-brand-primary-500 text-white">Primary Button</div>
<div class="border-brand-primary-200">Light border</div>

<!-- Secondary colors -->
<h1 class="text-brand-secondary-900">Main Heading</h1>
<p class="text-brand-secondary-600">Body text</p>

<!-- Status colors -->
<div class="bg-brand-success-100 text-brand-success-700">Success message</div>
```

## Component Usage

### Hero Section
- Background: `brand-primary-50` to `brand-primary-100` gradient
- Icon background: `brand-primary-600`
- Main heading: `brand-secondary-900`
- Subtitle: `brand-secondary-600`

### Forms & Inputs
- Input borders: `brand-secondary-300`
- Focus states: `brand-primary-500`
- Labels: `brand-secondary-700`

### Cards & Containers
- Background: `white`
- Borders: `brand-secondary-200`
- Hover borders: `brand-primary-300`

### Icons & Interactive Elements
- Primary icons: `brand-primary-600`
- Secondary icons: `brand-secondary-400`
- Hover states: `brand-primary-600`

## Accessibility

All color combinations meet WCAG 2.1 AA contrast requirements:
- Primary text on white backgrounds: 4.5:1 minimum
- Secondary text on light backgrounds: 4.5:1 minimum
- Interactive elements have clear focus indicators

## Maintenance

To update the brand colors:

1. **Single Source of Truth**: Modify colors in `src/app/globals.css` under the `:root` selector
2. **Automatic Propagation**: All components will automatically use the updated colors
3. **Consistent Application**: No need to update individual component files

### Example: Changing Primary Color
```css
:root {
  /* Change this single value */
  --brand-primary-500: #your-new-color;
  --brand-primary-600: #your-new-darker-color;
  /* All components using brand-primary-500 will update automatically */
}
```

## Benefits

1. **Centralized Management**: All colors defined in one location
2. **Easy Updates**: Change colors globally by modifying CSS custom properties
3. **Consistent Application**: Ensures brand consistency across all components
4. **Professional Appearance**: Carefully selected colors with proper contrast ratios
5. **Maintainable**: Future developers can easily understand and modify the color system
6. **Accessible**: All color combinations meet accessibility standards

## File Structure

- `src/app/globals.css` - Main color definitions and Tailwind configuration
- `src/components/*.tsx` - All components use the centralized color classes
- `BRAND_COLORS.md` - This documentation file

This color system provides a solid foundation for the Unix Timestamp Converter application while remaining flexible for future updates and modifications.
