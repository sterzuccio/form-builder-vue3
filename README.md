# Form Builder - Vue 3

A powerful form builder component library for Vue 3, featuring drag-and-drop form creation, validation, and customization.

Repository git: [form-builder-vue3](https://github.com/sterzuccio/form-builder-vue3)

## Features

- **Vue 3 Compatible**: Built using Vue 3 and the Composition API
- **Tailwind CSS**: Modern, responsive UI with Tailwind CSS
- **Drag and Drop Form Building**: Easily build forms by dragging and dropping components
- **Live Preview**: Preview your form as you build it
- **Multiple Export Formats**: Export forms as Vue/Nuxt components, JSON (importable), embeddable HTML, or JavaScript (head script)
- **Form Saving**: Save forms in JSON format for easy maintenance
- **Component Selection**: Choose which components to use when instantiating the library
- **Endpoint Configuration**: Configure endpoints, HTTP methods, and custom headers
- **Field Validation**: Support for required, min, max, and pattern validations
- **Customizable Fields**: Customize labels, placeholders, required status, hidden status, field width, and options for select/radio fields
- **Required Fields**: Support for required fields
- **Hidden Fields**: Support for hidden fields with default values that are not visible in the form but are included in form submissions
- **Required Components**: Define components that are always visible, always required, and cannot be modified by users
- **Color Customization**: Customize component colors using Tailwind CSS color palette (indigo by default)
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
        @get-form-code="handleGetFormCode"></FormBuilder>

    <h1>Form Preview</h1>
    <FormPreview
        :form="myForm"
        @submit="handleSubmit"></FormPreview>

    <button @click="getAndSaveFormCode" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
      Get Form Code
    </button>
  </div>
</template>

<script>
  import {ref} from 'vue'
  import {FormBuilder, FormPreview} from 'form-builder-vue3'

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

### Color Customization

All components support color customization using the `color` prop. You can use any Tailwind CSS color name to theme the components:

```vue

<template>
  <div>
    <!-- Blue theme -->
    <FormBuilder
        :initial-form="myForm"
        color="blue"
        @save="handleSave"></FormBuilder>

    <!-- Green theme -->
    <FormPreview
        :form="myForm"
        color="green"
        @submit="handleSubmit"></FormPreview>

    <!-- Red theme -->
    <FormBuilder
        :initial-form="myForm"
        color="red"
        @save="handleSave"></FormBuilder>

    <!-- Purple theme -->
    <FormPreview
        :form="myForm"
        color="purple"
        @submit="handleSubmit"></FormPreview>
  </div>
</template>
```

#### Available Colors

The following Tailwind CSS colors are supported:
- `slate`, `gray`, `zinc`, `neutral`, `stone`
- `red`, `orange`, `amber`, `yellow`, `lime`, `green`
- `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`
- `violet`, `purple`, `fuchsia`, `pink`, `rose`

The color affects:
- Button backgrounds and hover states
- Focus rings and borders
- Radio button and checkbox colors
- Form field focus states
- All interactive elements

**Note**: Make sure the chosen color classes are available in your Tailwind CSS build. The default color is `indigo`.

#### Custom Colors

In addition to standard Tailwind colors, you can also define custom colors with all the standard Tailwind color shades (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950). For detailed information on how to use custom colors, see the [Custom Colors Documentation](documentation/CUSTOM_COLORS.md).

### Required Components

Both FormBuilder and FormPreview components support a `requiredComponents` prop that allows you to define components that are always visible, always required, and cannot be modified by users. This is perfect for mandatory fields, system fields, or compliance requirements.

```vue
<template>
  <div>
    <!-- Form Builder -->
    <FormBuilder
      :required-components="requiredComponents"
      :initial-form="initialForm"
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
export default {
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
      name: 'Employee Form',
      fields: [],
      endpoint: '/api/submit',
      method: 'POST'
    })

    const handleSave = (savedForm) => {
      form.value = savedForm
    }

    const handleSubmit = (formData) => {
      // formData includes both required components and regular fields
      console.log('Form submitted:', formData)
    }

    return { requiredComponents, form, handleSave, handleSubmit }
  }
}
</script>
```

**Key Features:**
- Required components appear first in the form and have a distinctive blue background
- They display a "Required" badge and cannot be edited or deleted by users
- They work alongside regular draggable components in both FormBuilder and FormPreview
- Fully integrated with form export functionality (Vue, JSON, HTML, JavaScript formats)
- Form validation and submission includes required components
- Perfect for mandatory fields, system requirements, or compliance needs

**Recent Improvements (v0.6.0):**
- FormPreview now fully supports required components
- All export formats include required components in generated code
- Enhanced form validation for required components
- Improved visual consistency between FormBuilder and FormPreview

For detailed usage examples and advanced configurations, see the [Required Components Documentation](documentation/REQUIRED_COMPONENTS_FEATURE.md).

## JavaScript Export Feature

The FormBuilder now supports exporting forms as JavaScript code that works just like Google Analytics - simple script tags that load forms dynamically from your server. This approach makes form integration as easy as adding Google Analytics to your website.

### Key Features

- **Google Analytics Style**: Simple script tags just like gtag.js
- **Dynamic Loading**: Forms are loaded from your backend endpoint
- **Lightweight**: No large embedded JavaScript code in HTML
- **Cacheable**: Form JavaScript can be cached by browsers
- **Easy Updates**: Update forms on server without changing HTML
- **Familiar Pattern**: Developers already know this integration pattern

### Basic Usage

1. **Export JavaScript Code**: Select "JavaScript (Head Script)" from the export format dropdown in FormBuilder
2. **Configure Endpoint**: Set your form endpoint URL in the JavaScript Configuration section
3. **Embed Script Tags**: Add the generated script tags to your HTML page's `<head>` section
4. **Add Container**: Include a container div where the form should appear

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Form Builder Script (Google Analytics style) -->
    <script async src="https://your-domain.com/api/forms/contact-form.js"></script>
    <script>
      window.formConfig = window.formConfig || {};
      window.formConfig['contact-form'] = {
        containerId: 'form-contact-form',
        formId: 'contact-form'
      };
    </script>
</head>
<body>
    <h1>Contact Us</h1>
    <!-- Form will be loaded here -->
    <div id="form-contact-form"></div>
</body>
</html>
```

### Backend Requirements

Your backend endpoint `https://your-domain.com/api/forms/{formId}.js` should return JavaScript that creates and embeds the form. The endpoint receives the form ID and returns the appropriate JavaScript code to render that specific form.

### Comparison with Google Analytics

| Google Analytics | Form Builder |
|------------------|--------------|
| `<script async src="https://www.googletagmanager.com/gtag/js?id=TAG_ID"></script>` | `<script async src="https://your-domain.com/api/forms/form-id.js"></script>` |
| `gtag('config', 'TAG_ID');` | `window.formConfig['form-id'] = { containerId: 'form-form-id' };` |

For detailed implementation guidance and backend examples, see the [JavaScript Export Documentation](documentation/JAVASCRIPT_EXPORT.md).

## Component Props

### FormBuilder

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| initialForm | Object | `{}` | Initial form data. Each field in the form will automatically receive a unique ID and key. |
| components | Array | `[]` | Custom components to use |
| customFields | Array | `[]` | Custom fields that can be added via drag and drop |
| activeFieldKeys | Array | `[]` | List of field types that should be visible in the component selector. If empty, all fields are shown. |
| requiredComponents | Array | `[]` | Components that are always visible, always required, and cannot be modified by users. See [Required Components Documentation](documentation/REQUIRED_COMPONENTS_FEATURE.md) for details. |
| showComponentSelector | Boolean | `true` | Whether to show the component selector |
| showFormSettings | Boolean | `true` | Whether to show form settings |
| showFormName | Boolean | `true` | Whether to show form name input |
| exportFormats | Array | `[{ value: 'vue', label: 'Vue/Nuxt Component' }, { value: 'json', label: 'JSON (Importable)' }, { value: 'html', label: 'Embeddable HTML' }, { value: 'js', label: 'JavaScript (Head Script)' }]` | Available export formats |
| color | String \| Object | `'indigo'` | Color theme for the component. Accepts any Tailwind CSS color name (e.g., 'blue', 'green', 'red', 'purple', etc.) or a custom color object with all required shades. See [Custom Colors Documentation](documentation/CUSTOM_COLORS.md) for object format. |

### FormPreview

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| form | Object | Required | Form data to preview |
| formId | String | `null` | ID to load form from store |
| requiredComponents | Array | `[]` | Components that are always visible, always required, and cannot be modified by users. Must match the array used in FormBuilder for consistent display. See [Required Components Documentation](documentation/REQUIRED_COMPONENTS_FEATURE.md) for details. |
| showHeader | Boolean | `true` | Whether to show the header |
| color | String \| Object | `'indigo'` | Color theme for the component. Accepts any Tailwind CSS color name (e.g., 'blue', 'green', 'red', 'purple', etc.) or a custom color object with all required shades. See [Custom Colors Documentation](documentation/CUSTOM_COLORS.md) for object format. |

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
| hidden | Boolean | Whether the field is hidden from the form display but included in submissions |
| defaultValue | String | Default value for hidden fields (only used when hidden is true) |
| width | String | Width of the field ('full' or 'half'). Full width spans the entire form, half width allows two fields to be placed side by side |
| validation | Object | Validation rules for the field (e.g., min, max, pattern) |
| options | Array | Options for select, radio, and checkbox fields |

## Component Methods

### FormBuilder Methods

- `saveForm()`: Saves the form to the store and emits the 'save' event
- `exportFormCode()`: Generates the form code based on the selected export format (Vue/Nuxt, JSON, HTML, or JavaScript), displays it in a modal, and emits the 'export' event
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

## Security

For information about security updates and how to handle vulnerabilities, please see the [Security Guide](./SECURITY.md).

## License

MIT
