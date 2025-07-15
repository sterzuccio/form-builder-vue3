# Required Components Feature

## Overview

The FormBuilder component now supports a new `requiredComponents` prop that allows you to define components that are always visible, always required, and cannot be modified by the user.

## Usage

### Basic Example with FormBuilder

```vue
<template>
  <FormBuilder
    :required-components="requiredComponents"
    :initial-form="initialForm"
  />
</template>

<script>
import { FormBuilder } from 'form-builder-vue3'

export default {
  components: {
    FormBuilder
  },
  setup() {
    const requiredComponents = [
      {
        type: 'text',
        label: 'Full Name',
        key: 'fullName',
        placeholder: 'Enter your full name',
        required: true,
        width: 'full'
      },
      {
        type: 'email',
        label: 'Email Address',
        key: 'email',
        placeholder: 'Enter your email',
        required: true,
        width: 'half'
      },
      {
        type: 'select',
        label: 'Department',
        key: 'department',
        required: true,
        width: 'half',
        options: [
          { value: 'hr', label: 'Human Resources' },
          { value: 'it', label: 'Information Technology' },
          { value: 'finance', label: 'Finance' }
        ]
      }
    ]

    const initialForm = {
      name: 'Employee Registration Form',
      fields: [], // Regular fields that can be added via drag & drop
      endpoint: '/api/employees',
      method: 'POST'
    }

    return {
      requiredComponents,
      initialForm
    }
  }
}
</script>
```

### Using with FormPreview

The FormPreview component also supports required components, allowing you to preview forms that include both required and regular components:

```vue
<template>
  <div>
    <!-- Form Builder -->
    <FormBuilder
      :required-components="requiredComponents"
      :initial-form="form"
      @save="handleSave"
    />

    <!-- Form Preview -->
    <FormPreview
      :form="form"
      :required-components="requiredComponents"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import { FormBuilder, FormPreview } from 'form-builder-vue3'

export default {
  components: {
    FormBuilder,
    FormPreview
  },
  setup() {
    const requiredComponents = [
      {
        type: 'text',
        label: 'Full Name',
        key: 'fullName',
        placeholder: 'Enter your full name',
        required: true,
        width: 'full'
      },
      {
        type: 'email',
        label: 'Email Address',
        key: 'email',
        placeholder: 'Enter your email',
        required: true,
        width: 'half'
      }
    ]

    const form = ref({
      name: 'Employee Registration Form',
      fields: [],
      endpoint: '/api/employees',
      method: 'POST'
    })

    const handleSave = (savedForm) => {
      form.value = savedForm
    }

    const handleSubmit = (formData) => {
      console.log('Form submitted with data:', formData)
      // formData will include both required components and regular fields
    }

    return {
      requiredComponents,
      form,
      handleSave,
      handleSubmit
    }
  }
}
</script>
```

## Component Props

### FormBuilder Props

#### `requiredComponents`

- **Type**: `Array`
- **Default**: `[]`
- **Description**: An array of component objects that will always be visible and cannot be modified

### FormPreview Props

#### `requiredComponents`

- **Type**: `Array`
- **Default**: `[]`
- **Description**: An array of component objects that will be displayed in the preview alongside regular form fields

**Note**: When using FormPreview, you must pass the same `requiredComponents` array that you used in FormBuilder to ensure consistent display and functionality.

### Component Object Structure

Each component in the `requiredComponents` array should have the following structure:

```javascript
{
  type: 'text',           // Component type (text, email, select, etc.)
  label: 'Field Label',   // Display label
  key: 'fieldKey',        // Unique field key
  placeholder: 'Enter...', // Placeholder text (optional)
  required: true,         // Always true for required components
  width: 'full',          // 'full' or 'half'
  options: []             // For select/radio/checkbox components (optional)
}
```

## Features

### Visual Distinction
- Required components have a **blue background** (`bg-blue-50`)
- They display a **"Required" badge** with blue styling
- They appear **first** in the form, before any draggable components

### Non-Editable
- **No edit button** - Users cannot modify required components
- **No delete button** - Users cannot remove required components
- Components are **always visible** regardless of form state

### Integration with Regular Components
- Required components work alongside regular draggable components
- Regular components can still be added, edited, and deleted normally
- The form maintains proper layout with both types of components

### FormPreview Integration
- FormPreview component fully supports required components when the `requiredComponents` prop is provided
- Required components are displayed with the same blue background and visual distinction as in FormBuilder
- Form validation includes both required components and regular fields
- Form submission data includes values from both required components and regular fields
- Required components are properly initialized with default values if specified

## Use Cases

### 1. Mandatory Form Fields
```javascript
const requiredComponents = [
  {
    type: 'text',
    label: 'Company Name',
    key: 'companyName',
    required: true,
    width: 'full'
  },
  {
    type: 'email',
    label: 'Contact Email',
    key: 'contactEmail',
    required: true,
    width: 'half'
  }
]
```

### 2. System Fields
```javascript
const requiredComponents = [
  {
    type: 'text',
    label: 'User ID',
    key: 'userId',
    required: true,
    width: 'half',
    defaultValue: 'AUTO_GENERATED'
  },
  {
    type: 'select',
    label: 'Status',
    key: 'status',
    required: true,
    width: 'half',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  }
]
```

### 3. Compliance Fields
```javascript
const requiredComponents = [
  {
    type: 'checkbox',
    label: 'I agree to the terms and conditions',
    key: 'termsAccepted',
    required: true,
    width: 'full'
  },
  {
    type: 'checkbox',
    label: 'I consent to data processing',
    key: 'dataConsent',
    required: true,
    width: 'full'
  }
]
```

## Implementation Details

### Internal Structure
- Required components are processed first in the `allFields` computed property
- Each required component gets an `isRequiredComponent: true` flag
- Regular components get an `isRequiredComponent: false` flag
- Different styling and behavior are applied based on this flag

### Technical Implementation
The required components feature is implemented using a computed property that combines required components with regular form fields:

```javascript
const allFields = computed(() => {
  const combined = []

  // Add required components first (marked as required and non-editable)
  if (props.requiredComponents && props.requiredComponents.length > 0) {
    props.requiredComponents.forEach((component, index) => {
      combined.push({
        ...component,
        required: true,
        isRequiredComponent: true,
        requiredIndex: index
      })
    })
  }

  // Add regular form fields
  if (currentForm.value.fields && currentForm.value.fields.length > 0) {
    currentForm.value.fields.forEach((field, index) => {
      combined.push({
        ...field,
        isRequiredComponent: false,
        regularIndex: index
      })
    })
  }

  return combined
})
```

### Recent Fixes and Improvements
Version 0.6.0 introduced several important fixes to ensure required components work correctly across all features:

#### FormBuilder Fixes
- **Export Functions**: All export functions (`generateFormCode`, `generateJsonCode`, `generateHtmlCode`) now use `allFields` instead of just `currentForm.fields`
- **Validation Rules**: Form validation now includes required components in the generated validation rules
- **Form Data**: Generated form data initialization includes required components

#### FormPreview Fixes
- **Added Support**: FormPreview now accepts a `requiredComponents` prop
- **Combined Fields**: FormPreview uses the same `allFields` computed property pattern
- **Form Initialization**: Form data initialization includes required components
- **Validation**: Form validation processes both required components and regular fields
- **Visual Display**: Required components are displayed with proper styling and "Required" badges

### Form Export and Code Generation

Required components are fully integrated into all export formats provided by the FormBuilder component:

#### Vue/Nuxt Component Export
- Required components are included in the generated Vue component template
- Validation rules are automatically created for required components
- Form data initialization includes required components
- All required components are marked as required in the validation logic

#### JSON Export
- The exported JSON includes both regular fields and required components
- Required components are preserved with their `isRequiredComponent` flag
- The JSON structure maintains the distinction between required and regular components
- Perfect for importing forms that need to maintain required component definitions

#### HTML Export
- Required components are rendered in the HTML form structure
- Required components appear first in the form layout
- HTML validation attributes are properly set for required components
- Styling is preserved to maintain visual distinction

#### Export Functionality Fixes
Recent updates have resolved issues where required components were not being included in exports:

- **Fixed**: `generateFormCode()` now processes all fields (required + regular) instead of just regular fields
- **Fixed**: `generateJsonCode()` now includes required components in the exported JSON structure
- **Fixed**: `generateHtmlCode()` now renders required components in the HTML output
- **Enhanced**: All export formats now properly handle validation rules for required components

## Troubleshooting

### Common Issues and Solutions

#### Required Components Not Appearing in FormPreview
**Problem**: Required components are not visible in the FormPreview component.
**Solution**: Ensure you're passing the `requiredComponents` prop to both FormBuilder and FormPreview components with the same array.

```vue
<!-- Correct usage -->
<FormBuilder :required-components="requiredComponents" :initial-form="form" />
<FormPreview :form="form" :required-components="requiredComponents" />
```

#### Required Components Missing from Exported Code
**Problem**: Exported form code doesn't include required components.
**Solution**: This issue was resolved in version 0.6.0. Ensure you're using the latest version of the library.

#### Form Validation Not Working for Required Components
**Problem**: Form validation doesn't validate required components.
**Solution**: Make sure you're using FormPreview with the `requiredComponents` prop. The validation system automatically includes required components when this prop is provided.

### Best Practices

1. **Consistent Props**: Always pass the same `requiredComponents` array to both FormBuilder and FormPreview
2. **Unique Keys**: Ensure each required component has a unique `key` property
3. **Proper Structure**: Follow the documented component object structure for required components
4. **Version Compatibility**: Use version 0.6.0 or later for full required components support

## Backward Compatibility

This feature is fully backward compatible. Existing forms without the `requiredComponents` prop will continue to work exactly as before. The addition of required components support does not affect existing functionality or require any changes to existing implementations.
