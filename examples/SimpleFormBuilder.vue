<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Simple Form Builder Example</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Form Builder -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Form Builder</h2>
        <FormBuilder 
          :initial-form="form" 
          @save="handleSave"
          @export="handleExport"
          @field-added="handleFieldAdded"
          @form-updated="handleFormUpdated"
        />
      </div>
      
      <!-- Form Preview -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Form Preview</h2>
        <FormPreview 
          :form="form" 
          @submit="handleSubmit"
          @validation-error="handleValidationError"
          @submit-success="handleSubmitSuccess"
          @submit-error="handleSubmitError"
        />
      </div>
    </div>
    
    <!-- Exported Code Modal -->
    <div v-if="showExportedCode" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Exported Form Code</h3>
        
        <div class="mb-4">
          <pre class="bg-gray-100 p-4 rounded-md overflow-auto max-h-96"><code>{{ exportedCode }}</code></pre>
        </div>
        
        <div class="flex justify-end">
          <button 
            @click="copyCode" 
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
          >
            Copy to Clipboard
          </button>
          <button 
            @click="showExportedCode = false" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { FormBuilder, FormPreview } from 'form-builder-vue3'

export default {
  name: 'SimpleFormBuilder',
  components: {
    FormBuilder,
    FormPreview
  },
  setup() {
    // Form data
    const form = ref({
      name: 'Contact Form',
      fields: [
        {
          type: 'text',
          label: 'Name',
          placeholder: 'Enter your name',
          required: true,
          validation: {
            min: 2,
            max: 50
          }
        },
        {
          type: 'email',
          label: 'Email',
          placeholder: 'Enter your email',
          required: true
        },
        {
          type: 'textarea',
          label: 'Message',
          placeholder: 'Enter your message',
          required: true,
          validation: {
            min: 10
          }
        }
      ],
      endpoint: 'https://api.example.com/submit',
      method: 'POST',
      headers: {
        'X-Custom-Header': 'example'
      }
    })
    
    // Exported code
    const exportedCode = ref('')
    const showExportedCode = ref(false)
    
    // Event handlers
    const handleSave = (savedForm) => {
      console.log('Form saved:', savedForm)
      form.value = savedForm
    }
    
    const handleExport = (code) => {
      console.log('Form code exported')
      exportedCode.value = code
      showExportedCode.value = true
    }
    
    const handleFieldAdded = (field) => {
      console.log('Field added:', field)
    }
    
    const handleFormUpdated = (updatedForm) => {
      console.log('Form updated:', updatedForm)
    }
    
    const handleSubmit = (data) => {
      console.log('Form submitted with data:', data)
    }
    
    const handleValidationError = (errors) => {
      console.error('Validation errors:', errors)
    }
    
    const handleSubmitSuccess = (response) => {
      console.log('Form submitted successfully:', response)
    }
    
    const handleSubmitError = (error) => {
      console.error('Error submitting form:', error)
    }
    
    const copyCode = () => {
      navigator.clipboard.writeText(exportedCode.value)
        .then(() => {
          alert('Code copied to clipboard!')
        })
        .catch(err => {
          console.error('Failed to copy code: ', err)
        })
    }
    
    return {
      form,
      exportedCode,
      showExportedCode,
      handleSave,
      handleExport,
      handleFieldAdded,
      handleFormUpdated,
      handleSubmit,
      handleValidationError,
      handleSubmitSuccess,
      handleSubmitError,
      copyCode
    }
  }
}
</script>