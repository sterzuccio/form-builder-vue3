# Form Builder - Vue 3

A powerful form builder component library for Vue 3, featuring drag-and-drop form creation, validation, and customization.

## Features

- **Vue 3 Compatible**: Built using Vue 3 and the Composition API
- **Tailwind CSS**: Modern, responsive UI with Tailwind CSS
- **Drag and Drop Form Building**: Easily build forms by dragging and dropping components
- **Live Preview**: Preview your form as you build it
- **Multiple Export Formats**: Export forms as Vue/Nuxt components, JSON (importable), or embeddable HTML
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
      ref="formBuilder"
      :initial-form="myForm" 
      @save="handleSave"
      @export="handleExport"
      @get-form-code="handleGetFormCode"
    />

    <h1>Form Preview</h1>
    <FormPreview 
      :form="myForm" 
      @submit="handleSubmit"
    />

    <button @click="getAndSaveFormCode" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
      Get Form Code
    </button>
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
    const formBuilder = ref(null)
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

    const handleGetFormCode = (code) => {
      console.log('Got form code:', code)
      // You can save the code wherever you want
      saveCodeToCustomLocation(code)
    }

    const getAndSaveFormCode = () => {
      // Programmatically get the form code
      const code = formBuilder.value.getFormCode()
      console.log('Got form code programmatically:', code)
      // You can save the code wherever you want
      saveCodeToCustomLocation(code)
    }

    const saveCodeToCustomLocation = (code) => {
      // Example function to save the code to a custom location
      // This could be a file download, localStorage, or any other storage method
      console.log('Saving code to custom location:', code)
    }

    const handleSubmit = (data) => {
      console.log('Form submitted with data:', data)
    }

    return {
      formBuilder,
      myForm,
      handleSave,
      handleExport,
      handleGetFormCode,
      getAndSaveFormCode,
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
| initialForm | Object | `{}` | Initial form data. Each field in the form will automatically receive a unique ID and key. |
| components | Array | `[]` | Custom components to use |
| customFields | Array | `[]` | Custom fields that can be added via drag and drop |
| activeFieldKeys | Array | `[]` | List of field types that should be visible in the component selector. If empty, all fields are shown. |
| showComponentSelector | Boolean | `true` | Whether to show the component selector |
| showFormSettings | Boolean | `true` | Whether to show form settings |
| showFormName | Boolean | `true` | Whether to show form name input |
| exportFormats | Array | `[{ value: 'vue', label: 'Vue/Nuxt Component' }, { value: 'json', label: 'JSON (Importable)' }, { value: 'html', label: 'Embeddable HTML' }]` | Available export formats |

### FormPreview

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| form | Object | Required | Form data to preview |
| formId | String | `null` | ID to load form from store |
| showHeader | Boolean | `true` | Whether to show the header |

## Events

### FormBuilder Events

- `save`: Emitted when the form is saved
- `export`: Emitted when the form code is exported
- `get-form-code`: Emitted when the form code is requested without displaying the modal
- `field-added`: Emitted when a field is added
- `field-updated`: Emitted when a field is updated
- `field-deleted`: Emitted when a field is deleted
- `form-updated`: Emitted when the form is updated

### FormPreview Events

- `submit`: Emitted when the form is submitted
- `validation-error`: Emitted when validation fails
- `submit-success`: Emitted when submission succeeds
- `submit-error`: Emitted when submission fails

## Form Data Structure

### Field Structure

Each field in the form has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| id | String | Unique identifier for the field (automatically generated) |
| key | String | Key that identifies the field (automatically generated, but can be customized) |
| type | String | Type of the field (e.g., 'text', 'textarea', 'select', etc.) |
| label | String | Label for the field |
| placeholder | String | Placeholder text for the field |
| required | Boolean | Whether the field is required |
| validation | Object | Validation rules for the field (e.g., min, max, pattern) |
| options | Array | Options for select, radio, and checkbox fields |

## Component Methods

### FormBuilder Methods

- `saveForm()`: Saves the form to the store and emits the 'save' event
- `exportFormCode()`: Generates the form code based on the selected export format (Vue/Nuxt, JSON, or HTML), displays it in a modal, and emits the 'export' event
- `getFormCode()`: Generates the Vue/Nuxt form code without displaying the modal, emits the 'get-form-code' event, and returns the code

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
