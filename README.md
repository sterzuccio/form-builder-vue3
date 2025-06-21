# Form Builder - Vue 3

A powerful form builder component library for Vue 3, featuring drag-and-drop form creation, validation, and customization.

## Features

- **Vue 3 Compatible**: Built using Vue 3 and the Composition API
- **Tailwind CSS**: Modern, responsive UI with Tailwind CSS
- **Drag and Drop Form Building**: Easily build forms by dragging and dropping components
- **Live Preview**: Preview your form as you build it
- **Form Export**: Download the form code to embed in other projects
- **Form Saving**: Save forms in JSON format for easy maintenance
- **Component Selection**: Choose which components to use when instantiating the library
- **Endpoint Configuration**: Configure endpoints, HTTP methods, and custom headers
- **Field Validation**: Support for required, min, max, and pattern validations
- **Customizable Fields**: Customize labels, placeholders, required status, and options for select/radio fields
- **Comprehensive Tests**: Includes unit and integration tests for all components

## Available Field Types

- Text Input
- Text Area
- Number
- Select Dropdown
- Radio Buttons
- Checkbox
- Date
- Email
- Password

## Installation

```bash
# Install the package
npm install form-builder-vue3
```

## Usage

### Basic Usage

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import FormBuilderPlugin from 'form-builder-vue3'

// Import the CSS (if you're using a bundler that supports CSS imports)
import 'form-builder-vue3/dist/form-builder-vue3.css'

const app = createApp(App)

// Use the plugin with default options
app.use(FormBuilderPlugin)

app.mount('#app')
```

### Using Individual Components

```vue
<template>
  <div>
    <h1>Form Builder</h1>
    <FormBuilder 
      :initial-form="myForm" 
      @save="handleSave"
      @export="handleExport"
    />

    <h1>Form Preview</h1>
    <FormPreview 
      :form="myForm" 
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import { FormBuilder, FormPreview } from 'form-builder-vue3'

export default {
  components: {
    FormBuilder,
    FormPreview
  },
  setup() {
    const myForm = ref({
      name: 'My Form',
      fields: [],
      endpoint: 'https://api.example.com/submit',
      method: 'POST',
      headers: {
        'X-Custom-Header': 'value'
      }
    })

    const handleSave = (form) => {
      console.log('Form saved:', form)
      myForm.value = form
    }

    const handleExport = (code) => {
      console.log('Exported code:', code)
    }

    const handleSubmit = (data) => {
      console.log('Form submitted with data:', data)
    }

    return {
      myForm,
      handleSave,
      handleExport,
      handleSubmit
    }
  }
}
</script>
```

### Using with Vuex

The library can integrate with your existing Vuex store:

```javascript
import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import FormBuilderPlugin from 'form-builder-vue3'

const store = createStore({
  // Your store configuration
})

const app = createApp(App)
app.use(store)
app.use(FormBuilderPlugin, {
  // Custom options
  storeModuleName: 'customFormBuilder' // Default is 'formBuilder'
})

app.mount('#app')
```

## Component Props

### FormBuilder

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| initialForm | Object | `{}` | Initial form data |
| components | Array | `[]` | Custom components to use |
| showComponentSelector | Boolean | `true` | Whether to show the component selector |
| showFormSettings | Boolean | `true` | Whether to show form settings |
| showFormName | Boolean | `true` | Whether to show form name input |
| ... | ... | ... | Many more customization options |

### FormPreview

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| form | Object | Required | Form data to preview |
| formId | String | `null` | ID to load form from store |
| showHeader | Boolean | `true` | Whether to show the header |
| ... | ... | ... | Many more customization options |

## Events

### FormBuilder Events

- `save`: Emitted when the form is saved
- `export`: Emitted when the form code is exported
- `field-added`: Emitted when a field is added
- `field-updated`: Emitted when a field is updated
- `field-deleted`: Emitted when a field is deleted
- `form-updated`: Emitted when the form is updated

### FormPreview Events

- `submit`: Emitted when the form is submitted
- `validation-error`: Emitted when validation fails
- `submit-success`: Emitted when submission succeeds
- `submit-error`: Emitted when submission fails

## Development

```bash
# Install dependencies
npm install

# Serve with hot-reload for development
npm run serve

# Build the library
npm run build:lib

# Run tests
npm run test

# Lint and fix files
npm run lint
```

## Testing

For detailed instructions on how to test the application locally, please see the [Testing Guide](./TESTING.md).

## Publishing

For instructions on how to push this project to GitHub and publish it to npm, please see the [Publishing Guide](./PUBLISHING.md).

## Security

For information about security updates and how to handle vulnerabilities, please see the [Security Guide](./SECURITY.md).

## License

MIT
