# Required Components Feature

## Overview

The FormBuilder component now supports a new `requiredComponents` prop that allows you to define components that are always visible, always required, and cannot be modified by the user.

## Usage

### Basic Example

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

## Prop Definition

### `requiredComponents`

- **Type**: `Array`
- **Default**: `[]`
- **Description**: An array of component objects that will always be visible and cannot be modified

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

### Form Export
When exporting form code, required components are included in the generated form structure and are marked as required fields in the validation rules.

## Backward Compatibility

This feature is fully backward compatible. Existing forms without the `requiredComponents` prop will continue to work exactly as before.