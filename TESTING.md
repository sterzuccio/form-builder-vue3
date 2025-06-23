# Testing Guide for form-builder-vue3

This guide provides step-by-step instructions for testing the form-builder-vue3 application locally.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- Git (for cloning the repository)

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/sterzuccio/form-builder-vue3.git
   cd form-builder-vue3
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

## Running the Application

1. **Start the Development Server**

   ```bash
   npm run serve
   ```

   This will start the development server, typically at http://localhost:8080 (the exact URL will be shown in your terminal).

2. **Access the Application**

   Open your browser and navigate to the URL shown in your terminal (usually http://localhost:8080).

## Testing the Form Builder

1. **Navigate to the Builder Page**

   Click on "Create New Form" on the home page or navigate to the "/builder" route.

2. **Create a Form**

   - Drag and drop components from the left sidebar into the form area.
   - Click on a component in the form to edit its properties (label, placeholder, validation rules, etc.).
   - Configure form settings (endpoint, method, headers) in the right sidebar.
   - Note that each component you add will automatically receive a unique ID and key.
   - The key parameter can be used to identify the field in your application.

3. **Test Form Settings Visibility**

   - You can hide the Form Settings column by setting the `showFormSettings` prop to `false` when using the FormBuilder component.
   - When Form Settings are hidden, the main content area will automatically adjust to use the available space.

4. **Save the Form**

   Click the "Save Form" button to save your form. It will be stored in your browser's local storage.

5. **Preview the Form**

   Navigate to the "/preview" route or click on "Preview" for your form on the home page to see how it will look and function.

6. **Test Custom Fields**

   - You can add custom fields to the form builder by passing them to the `customFields` prop.
   - Custom fields should have the same structure as standard fields (type, label, icon).
   - Custom fields can be dragged and dropped just like standard fields.
   - Example: `customFields: [{ type: 'custom-field', label: 'Custom Field', icon: 'extension' }]`

7. **Test Field Activation**

   - You can control which fields are visible in the component selector by passing an array of field types to the `activeFieldKeys` prop.
   - Only fields whose types are included in the `activeFieldKeys` array will be shown.
   - If the `activeFieldKeys` array is empty, all fields will be shown.
   - Example: `activeFieldKeys: ['text', 'textarea', 'custom-field']`

8. **Test Field Width**

   - When editing a field, you can choose between "Full Width" and "Half Width" options.
   - Full width fields will span the entire form width.
   - Half width fields will take up half the form width, allowing two fields to be placed side by side.
   - Try creating multiple fields with different width settings to see how they appear in the form.

9. **Test Key Customization**

   - When editing a field, you can customize the "Key" field.
   - The key is automatically generated based on the field label, but you can modify it.
   - The key must be unique across all fields in the form.
   - Try editing the key of a field and observe how it's reflected in the form.

10. **Export Form Code**

   Click the "Export Code" button to generate Vue component code for your form that you can use in other projects.

## Testing Form Submission

1. **Create a Form with an Endpoint**

   When creating your form, set an endpoint URL in the form settings. You can use services like [Mockbin](https://mockbin.io/) or [RequestBin](https://requestbin.com/) to create a temporary endpoint for testing.

2. **Submit the Form**

   In the preview mode, fill out the form and click "Submit". Check the console for the submission data and response.

## Building the Library

If you want to test the library build:

1. **Build the Library**

   ```bash
   npm run build:lib
   ```

   This will create the distribution files in the `dist` directory.

2. **Test the Built Library**

   You can create a simple HTML file that includes the built library to test it:

   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <title>Form Builder Test</title>
     <script src="https://unpkg.com/vue@3"></script>
     <script src="./dist/form-builder-vue3.umd.js"></script>
     <link rel="stylesheet" href="./dist/style.css">
   </head>
   <body>
     <div id="app">
       <h1>Form Builder</h1>
       <form-builder></form-builder>
     </div>
     <script>
       const app = Vue.createApp({})
       app.use(FormBuilderVue3)
       app.mount('#app')
     </script>
   </body>
   </html>
   ```

## Troubleshooting

### Common Issues

1. **Components Not Rendering**

   If you see placeholders instead of actual components, ensure that:
   - The correct entry point is set in vite.config.js (should be 'src/lib/index.js')
   - You've imported and registered the components correctly

2. **Styling Issues**

   If the components don't look right:
   - Make sure Tailwind CSS is properly set up
   - Check for any CSS conflicts with your existing styles

3. **Form Not Saving**

   If forms aren't being saved:
   - Check browser console for errors
   - Ensure localStorage is available and not full
   - Verify that the Vuex store is properly configured

### Getting Help

If you encounter issues not covered in this guide:
1. Check the console for error messages
2. Review the component documentation in the README.md
3. Open an issue on the GitHub repository with detailed information about your problem
