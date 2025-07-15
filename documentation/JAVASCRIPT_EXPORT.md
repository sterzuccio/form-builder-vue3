# JavaScript Export Feature Documentation

The JavaScript Export feature allows you to generate self-contained JavaScript code that can be embedded in any HTML page to dynamically load and render forms. This feature is particularly useful for:

- Embedding forms in static websites
- Creating forms that can be updated without code changes
- Integrating forms across multiple domains or applications
- Implementing dynamic form loading from server endpoints

## Table of Contents

1. [How It Works](#how-it-works)
2. [Generated Code Structure](#generated-code-structure)
3. [Basic Implementation](#basic-implementation)
4. [Backend Integration Concept](#backend-integration-concept)
5. [Advanced Usage](#advanced-usage)
6. [Security Considerations](#security-considerations)
7. [Troubleshooting](#troubleshooting)

## How It Works

The JavaScript export feature generates a self-contained script that:

1. **Includes CSS Styles**: All necessary styling is embedded in the JavaScript
2. **Creates Form HTML**: Dynamically generates form elements based on configuration
3. **Handles Validation**: Provides client-side validation for required fields
4. **Manages Submission**: Handles form submission to configured endpoints
5. **Provides Public API**: Exposes methods for programmatic form control

## Generated Code Structure

The generated JavaScript code follows this structure:

```javascript
(function() {
  'use strict';

  // Form configuration object
  const formConfig = {
    name: "Form Name",
    endpoint: "https://api.example.com/submit",
    method: "POST",
    headers: {},
    fields: [...],
    jsEndpoint: "https://api.example.com/forms/form-id"
  };

  // CSS styles (embedded)
  const formStyles = `...`;

  // Core functionality
  function injectStyles() { ... }
  function generateFieldHTML(field) { ... }
  function createFormHTML() { ... }
  function validateForm(form) { ... }
  function submitForm(formData) { ... }
  function initForm(containerId) { ... }

  // Public API
  window.DynamicFormLoader = {
    load: initForm,
    config: formConfig
  };

  // Auto-initialization
  document.addEventListener('DOMContentLoaded', function() {
    const defaultContainer = document.getElementById('dynamic-form-container');
    if (defaultContainer) {
      initForm('dynamic-form-container');
    }
  });
})();
```

## Basic Implementation

### Step 1: Generate JavaScript Code

1. Open FormBuilder
2. Create your form with desired fields
3. Select "JavaScript (Head Script)" from the export format dropdown
4. Click "Export Code"
5. Copy the generated JavaScript code

### Step 2: Embed in HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Form Page</title>

    <!-- Paste your generated JavaScript code here -->
    <script>
        // Your generated FormBuilder JavaScript code
        (function() {
            // ... generated code ...
        })();
    </script>
</head>
<body>
    <h1>Contact Form</h1>

    <!-- Form will automatically load here -->
    <div id="dynamic-form-container"></div>
</body>
</html>
```

### Step 3: Customize Container (Optional)

```html
<body>
    <div id="my-custom-form-container"></div>

    <script>
        // Load form into custom container after page loads
        document.addEventListener('DOMContentLoaded', function() {
            DynamicFormLoader.load('my-custom-form-container');
        });
    </script>
</body>
```

## Backend Integration Concept

The JavaScript export feature supports dynamic form loading from backend endpoints. This allows you to:

- Store form configurations on your server
- Update forms without regenerating JavaScript code
- Implement form versioning and management
- Use custom headers for authentication

### Basic Concept

The generated JavaScript can call your backend API to load form configurations dynamically. When you configure a "Form Endpoint URL" in the FormBuilder's JavaScript Configuration section, the generated script can:

1. **Load forms by ID**: Call your endpoint with a form ID to get the configuration
2. **Support custom headers**: Include authentication tokens or API keys
3. **Handle errors gracefully**: Show appropriate messages when forms can't be loaded

### Backend Requirements

Your backend endpoint should:

1. **Accept GET requests** at a URL like `/api/forms/{formId}`
2. **Return JSON** with the form configuration
3. **Handle authentication** if required
4. **Support CORS** for cross-domain requests

### Expected Response Format

Your endpoint should return a JSON object with this structure:

```json
{
  "name": "Contact Form",
  "endpoint": "https://api.example.com/submit",
  "method": "POST",
  "headers": {
    "X-API-Key": "your-api-key"
  },
  "fields": [
    {
      "type": "text",
      "key": "name",
      "label": "Full Name",
      "placeholder": "Enter your full name",
      "required": true,
      "width": "full",
      "options": [],
      "validation": {}
    }
  ]
}
```

## Advanced Usage

### Dynamic Form Loading

The generated JavaScript provides methods to load forms dynamically:

```javascript
// Load form into a specific container
DynamicFormLoader.load('my-form-container');

// Load form from endpoint with form ID
DynamicFormLoader.loadFromEndpoint('container-id', 'https://api.example.com/forms', 'contact-form');

// Load form by ID using configured jsEndpoint
DynamicFormLoader.loadFormById('container-id', 'contact-form');

// Load form with custom headers (for authentication)
DynamicFormLoader.loadFormById('container-id', 'secure-form', {
    'Authorization': 'Bearer your-token',
    'X-API-Key': 'your-api-key'
});
```

### HTML Data Attributes

You can configure form loading using HTML data attributes:

```html
<!-- Auto-load form by ID with custom headers -->
<div id="dynamic-form-container" 
     data-form-id="contact-form"
     data-header-authorization="Bearer your-token"
     data-header-x-api-key="your-api-key">
</div>
```

### Backend Implementation Example

Your backend endpoint should handle GET requests and return form configuration:

```javascript
// Example endpoint response
GET /api/forms/contact-form

{
  "name": "Contact Form",
  "endpoint": "https://api.example.com/submit",
  "method": "POST",
  "headers": {
    "X-API-Key": "your-api-key"
  },
  "fields": [
    {
      "type": "text",
      "key": "name",
      "label": "Full Name",
      "required": true,
      "width": "full"
    },
    {
      "type": "email", 
      "key": "email",
      "label": "Email Address",
      "required": true,
      "width": "full"
    }
  ]
}
```

### Custom Styling

You can override the default styles by adding custom CSS after the form loads:

```html
<style>
.dynamic-form {
  /* Your custom styles */
  font-family: 'Your Custom Font', sans-serif;
}

.dynamic-form button {
  background-color: #your-brand-color;
}
</style>
```

### Event Handling

Add custom event handlers to the generated form:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('dynamicForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      // Custom logic before form submission
      console.log('Form is being submitted');
    });
  }
});
```

## Security Considerations

### CSRF Protection

For frameworks that use CSRF tokens, make sure to:

1. Include CSRF tokens in form headers
2. Configure your backend to accept the tokens
3. Handle token refresh for long-lived pages

### Input Validation

Always validate input on both client and server sides:

- Client-side validation for user experience
- Server-side validation for security
- Sanitize all input data before processing

### Rate Limiting

Implement rate limiting on your form endpoints to prevent abuse.

### CORS Configuration

Configure CORS properly for cross-domain form submissions.

## Troubleshooting

### Common Issues

1. **Form not loading**: Check browser console for JavaScript errors
2. **CORS errors**: Ensure your backend allows cross-origin requests
3. **Validation errors**: Verify field validation rules match between frontend and backend

### Debug Mode

Add debug logging to your generated JavaScript:

```javascript
// Add this to your form configuration
const DEBUG = true;

function debugLog(message, data) {
  if (DEBUG) {
    console.log('[DynamicForm]', message, data);
  }
}

// Use throughout the code
debugLog('Form initialized', formConfig);
debugLog('Form submitted', formData);
```

### Testing

Test your forms thoroughly:

1. **Validation testing**: Test all validation rules
2. **Cross-browser testing**: Ensure compatibility across browsers
3. **Mobile testing**: Test responsive behavior
4. **Error handling**: Test error scenarios (network failures, server errors)

This documentation covers the JavaScript export feature and provides guidance for implementing backend integration according to your specific requirements.
