# JavaScript Export Feature Documentation

The JavaScript Export feature generates simple script tags that work just like Google Analytics - making form integration as easy as adding gtag to your website. This approach allows you to embed forms dynamically from your server with minimal code.

This feature is particularly useful for:

- Embedding forms in static websites with Google Analytics-style simplicity
- Creating forms that can be updated on the server without changing HTML
- Integrating forms across multiple domains with familiar patterns
- Implementing dynamic form loading with cacheable JavaScript

## Table of Contents

1. [How It Works](#how-it-works)
2. [Generated Code Structure](#generated-code-structure)
3. [Basic Implementation](#basic-implementation)
4. [Backend Requirements](#backend-requirements)
5. [Usage Examples](#usage-examples)
6. [Security Considerations](#security-considerations)
7. [Troubleshooting](#troubleshooting)

## How It Works

The JavaScript export feature generates simple script tags similar to Google Analytics:

1. **Script Tag Generation**: Creates `<script>` tags that load from your endpoint
2. **Dynamic Loading**: Your endpoint returns JavaScript that creates the form
3. **Automatic Embedding**: The returned JavaScript injects the form into specified containers
4. **Familiar Pattern**: Uses the same integration pattern as Google Analytics gtag

## Generated Code Structure

The generated code creates simple script tags similar to Google Analytics:

```html
<!-- Form Builder Script -->
<script async src="https://your-domain.com/api/forms/contact-form.js"></script>
<script>
  window.formConfig = window.formConfig || {};
  window.formConfig['contact-form'] = {
    containerId: 'form-contact-form',
    formId: 'contact-form'
  };
</script>

<!-- Usage: Add this div where you want the form to appear -->
<div id="form-contact-form"></div>
```

### Comparison with Google Analytics

| Google Analytics | Form Builder |
|------------------|--------------|
| `<script async src="https://www.googletagmanager.com/gtag/js?id=TAG_ID"></script>` | `<script async src="https://your-domain.com/api/forms/form-id.js"></script>` |
| `gtag('js', new Date()); gtag('config', 'TAG_ID');` | `window.formConfig['form-id'] = { containerId: 'form-form-id' };` |

The key difference is that instead of tracking analytics, your endpoint returns JavaScript that creates and embeds a form.

## Basic Implementation

### Step 1: Generate Script Tags

1. Open FormBuilder
2. Create your form with desired fields
3. Configure your endpoint URL in the JavaScript Configuration section
4. Select "JavaScript (Head Script)" from the export format dropdown
5. Click "Export Code"
6. Copy the generated script tags

### Step 2: Embed Script Tags in HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Form Page</title>

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
    <h1>Contact Form</h1>

    <!-- Form will be loaded here -->
    <div id="form-contact-form"></div>
</body>
</html>
```

### Step 3: Set Up Your Backend Endpoint

Your endpoint `https://your-domain.com/api/forms/contact-form.js` should return JavaScript that creates the form. See the [Backend Requirements](#backend-requirements) section for details.

## Backend Requirements

Your backend endpoint `https://your-domain.com/api/forms/{formId}.js` should return JavaScript code that creates and embeds the form. This is similar to how Google Analytics works - the script tag loads JavaScript that performs the actual functionality.

### Endpoint Structure

- **URL Pattern**: `https://your-domain.com/api/forms/{formId}.js`
- **Method**: GET
- **Response**: JavaScript code (Content-Type: application/javascript)
- **Purpose**: Return JavaScript that creates and injects the form

### Example Response

Your endpoint should return JavaScript similar to this:

```javascript
(function() {
  'use strict';

  const formData = {
    "name": "Contact Form",
    "endpoint": "https://api.example.com/submit",
    "method": "POST",
    "headers": {},
    "fields": [
      {
        "type": "text",
        "key": "name",
        "label": "Full Name",
        "placeholder": "Enter your full name",
        "required": true,
        "width": "full"
      },
      {
        "type": "email",
        "key": "email",
        "label": "Email Address",
        "placeholder": "Enter your email",
        "required": true,
        "width": "full"
      }
    ]
  };

  // CSS styles for the form
  const styles = `
    .dynamic-form { 
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 1rem;
    }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-group input, .form-group textarea { 
      width: 100%; 
      padding: 0.5rem; 
      border: 1px solid #ccc; 
      border-radius: 4px; 
    }
    .form-group button { 
      background-color: #4f46e5; 
      color: white; 
      border: none; 
      padding: 0.75rem 1.5rem; 
      border-radius: 4px; 
      cursor: pointer; 
    }
  `;

  function injectStyles() {
    if (!document.getElementById('form-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'form-styles';
      styleEl.textContent = styles;
      document.head.appendChild(styleEl);
    }
  }

  function createForm() {
    const container = document.getElementById('form-contact-form');
    if (container) {
      injectStyles();

      // Generate form HTML based on formData
      const formHTML = generateFormHTML(formData);
      container.innerHTML = formHTML;

      // Add event listeners for form submission, validation, etc.
      setupFormHandlers();
    }
  }

  function generateFormHTML(data) {
    // Your form generation logic here
    // Return HTML string for the form
  }

  function setupFormHandlers() {
    // Add form submission, validation, etc.
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createForm);
  } else {
    createForm();
  }
})();
```

### Key Benefits

- **Dynamic Updates**: Change forms on your server without updating HTML
- **Cacheable**: Browser can cache the JavaScript for better performance  
- **Familiar Pattern**: Same integration approach as Google Analytics
- **Lightweight**: No large embedded code in your HTML pages

## Usage Examples

### Single Form on a Page

The most common use case - one form on a page:

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Contact Form Script -->
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
    <div id="form-contact-form"></div>
</body>
</html>
```

### Multiple Forms on Same Page

You can include multiple forms by adding multiple script tags:

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Contact Form -->
    <script async src="https://your-domain.com/api/forms/contact-form.js"></script>
    <script>
      window.formConfig = window.formConfig || {};
      window.formConfig['contact-form'] = {
        containerId: 'form-contact-form',
        formId: 'contact-form'
      };
    </script>

    <!-- Newsletter Signup -->
    <script async src="https://your-domain.com/api/forms/newsletter.js"></script>
    <script>
      window.formConfig['newsletter'] = {
        containerId: 'form-newsletter',
        formId: 'newsletter'
      };
    </script>
</head>
<body>
    <h1>Contact Us</h1>
    <div id="form-contact-form"></div>

    <h2>Subscribe to Newsletter</h2>
    <div id="form-newsletter"></div>
</body>
</html>
```

### Different Forms on Different Pages

Each page can load its own form:

```html
<!-- contact.html -->
<script async src="https://your-domain.com/api/forms/contact-form.js"></script>
<script>
  window.formConfig = window.formConfig || {};
  window.formConfig['contact-form'] = {
    containerId: 'form-contact-form',
    formId: 'contact-form'
  };
</script>
<div id="form-contact-form"></div>

<!-- signup.html -->
<script async src="https://your-domain.com/api/forms/user-signup.js"></script>
<script>
  window.formConfig = window.formConfig || {};
  window.formConfig['user-signup'] = {
    containerId: 'form-user-signup',
    formId: 'user-signup'
  };
</script>
<div id="form-user-signup"></div>
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

Configure CORS properly for cross-domain requests to your form endpoints.

### Content Security Policy (CSP)

If you use CSP headers, make sure to allow:
- Script loading from your form endpoint domain
- Inline scripts for the configuration code

## Troubleshooting

### Common Issues

1. **Form not loading**: Check browser console for JavaScript errors and network requests
2. **Script loading errors**: Verify your endpoint URL is correct and accessible
3. **CORS errors**: Ensure your backend allows cross-origin requests
4. **Container not found**: Make sure the container div ID matches the configuration

### Debug Mode

Add debug logging to your backend JavaScript response:

```javascript
// Add this to your endpoint's JavaScript response
const DEBUG = true;

function debugLog(message, data) {
  if (DEBUG) {
    console.log('[FormBuilder]', message, data);
  }
}

// Use throughout your form creation code
debugLog('Form script loaded', formData);
debugLog('Container found', container);
debugLog('Form created successfully');
```

### Testing Your Implementation

Test your forms thoroughly:

1. **Script Loading**: Verify the script loads from your endpoint
2. **Form Rendering**: Check that forms render correctly in the container
3. **Cross-browser Testing**: Ensure compatibility across browsers
4. **Mobile Testing**: Test responsive behavior
5. **Error Handling**: Test scenarios like network failures or missing containers

### Backend Testing

Test your backend endpoint:

```bash
# Test that your endpoint returns JavaScript
curl -H "Accept: application/javascript" https://your-domain.com/api/forms/contact-form.js

# Should return JavaScript code, not JSON
```

This Google Analytics-style approach makes form integration simple and familiar for developers while providing the flexibility to update forms dynamically from your server.
