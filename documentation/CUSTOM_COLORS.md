# Custom Colors Feature for FormBuilder

## Overview

The FormBuilder component now supports custom colors in addition to the standard Tailwind CSS colors. This allows you to define your own brand colors with all the standard Tailwind color shades (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950).

## Usage

### Standard Colors (Existing Functionality)

You can still use standard Tailwind colors as before:

```vue
<FormBuilder :color="'blue'" />
<FormBuilder :color="'red'" />
<FormBuilder :color="'indigo'" />
```

### Custom Colors (New Functionality)

To use custom colors, pass an object with the following structure:

```vue
<template>
  <FormBuilder :color="customColor" />
</template>

<script>
export default {
  data() {
    return {
      customColor: {
        name: 'brand-primary',
        colors: {
          '50': '#faf5ff',
          '100': '#f3e8ff',
          '200': '#e9d5ff',
          '300': '#d8b4fe',
          '400': '#c084fc',
          '500': '#a855f7',
          '600': '#9333ea',
          '700': '#7c3aed',
          '800': '#6b21a8',
          '900': '#581c87',
          '950': '#3b0764'
        }
      }
    }
  }
}
</script>
```

## Custom Color Object Structure

### Required Properties

1. **name** (String): The name of your custom color. This will be used to generate CSS classes like `text-{name}-500`, `bg-{name}-600`, etc.

2. **colors** (Object): An object containing all required color shades with their hex values.

### Required Color Shades

All of the following shades must be provided:

- `'50'` - Lightest shade
- `'100'`
- `'200'`
- `'300'`
- `'400'`
- `'500'` - Base color (used for focus rings and primary states)
- `'600'` - Used for text and primary backgrounds
- `'700'` - Used for darker backgrounds and hover states
- `'800'`
- `'900'`
- `'950'` - Darkest shade

### Color Value Format

All color values must be valid hex colors in the format:
- `#RRGGBB` (6-digit hex)
- `#RGB` (3-digit hex)

Examples: `#ff0000`, `#f00`, `#a855f7`

## Examples

### Brand Purple Theme

```javascript
const brandPurple = {
  name: 'brand-purple',
  colors: {
    '50': '#faf5ff',
    '100': '#f3e8ff',
    '200': '#e9d5ff',
    '300': '#d8b4fe',
    '400': '#c084fc',
    '500': '#a855f7',
    '600': '#9333ea',
    '700': '#7c3aed',
    '800': '#6b21a8',
    '900': '#581c87',
    '950': '#3b0764'
  }
}
```

### Brand Green Theme

```javascript
const brandGreen = {
  name: 'brand-green',
  colors: {
    '50': '#f0fdf4',
    '100': '#dcfce7',
    '200': '#bbf7d0',
    '300': '#86efac',
    '400': '#4ade80',
    '500': '#22c55e',
    '600': '#16a34a',
    '700': '#15803d',
    '800': '#166534',
    '900': '#14532d',
    '950': '#052e16'
  }
}
```

### Corporate Blue Theme

```javascript
const corporateBlue = {
  name: 'corporate-blue',
  colors: {
    '50': '#eff6ff',
    '100': '#dbeafe',
    '200': '#bfdbfe',
    '300': '#93c5fd',
    '400': '#60a5fa',
    '500': '#3b82f6',
    '600': '#2563eb',
    '700': '#1d4ed8',
    '800': '#1e40af',
    '900': '#1e3a8a',
    '950': '#172554'
  }
}
```

## Generated CSS Classes

When you use a custom color, the FormBuilder component automatically generates and injects CSS classes for all shades and states. For a custom color named `brand-purple`, the following classes will be available:

### Text Colors
- `text-brand-purple-50` through `text-brand-purple-950`

### Background Colors
- `bg-brand-purple-50` through `bg-brand-purple-950`

### Border Colors
- `border-brand-purple-50` through `border-brand-purple-950`

### Focus States
- `focus:ring-brand-purple-50` through `focus:ring-brand-purple-950`
- `focus:border-brand-purple-50` through `focus:border-brand-purple-950`

### Hover States
- `hover:bg-brand-purple-50` through `hover:bg-brand-purple-950`
- `hover:text-brand-purple-50` through `hover:text-brand-purple-950`

## Color Validation

The component includes built-in validation that ensures:

1. The `name` property is a non-empty string
2. The `colors` property is an object
3. All required shades (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950) are present
4. All color values are valid hex colors

If validation fails, the component will fall back to the default color (`indigo`).

## Technical Implementation

### Dynamic Style Injection

Custom colors work by dynamically injecting CSS styles into the document head. Each custom color gets its own `<style>` element with an ID like `custom-color-{name}`. If you change the custom color, the old styles are automatically removed and replaced.

### Tailwind Configuration

The `tailwind.config.js` has been updated to include pattern-based safelist entries that ensure custom color classes are not purged during the build process.

## Best Practices

1. **Consistent Naming**: Use descriptive names like `brand-primary`, `brand-secondary`, `corporate-blue` rather than generic names like `custom1`, `color2`.

2. **Color Harmony**: Ensure your color shades create a harmonious progression from light (50) to dark (950).

3. **Accessibility**: Test your custom colors for sufficient contrast ratios, especially for text colors.

4. **Performance**: While the dynamic injection is efficient, avoid frequently changing custom colors as it requires DOM manipulation.

## Troubleshooting

### Colors Not Appearing

1. Check that all required shades are provided
2. Verify hex color format (must start with #)
3. Ensure the color name doesn't conflict with existing Tailwind colors
4. Check browser console for validation errors

### Styles Not Updating

1. Custom colors are reactive - changing the color object should automatically update styles
2. If styles seem cached, try using a different color name
3. Check that the component is properly re-rendering when the color prop changes

## Migration from Standard Colors

To migrate from standard colors to custom colors:

1. Choose your custom color shades (you can use tools like [Tailwind Color Generator](https://uicolors.app/create))
2. Create a custom color object with your chosen shades
3. Replace the string color prop with your custom color object
4. Test thoroughly to ensure all UI elements display correctly

## Testing

A test file (`test_custom_colors.html`) is included in the project root that demonstrates both standard and custom color usage. Open this file in a browser to see the custom colors in action.