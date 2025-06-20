<template>
  <div class="preview">
    <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">{{ currentForm.name || 'Untitled Form' }}</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Preview your form</p>
        </div>
        <div class="flex space-x-2">
          <router-link 
            :to="`/builder?id=${currentForm.id}`" 
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Editor
          </router-link>
        </div>
      </div>
    </div>

    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <form @submit.prevent="submitForm" class="space-y-6">
          <div v-for="(field, index) in currentForm.fields" :key="index" class="form-field">
            <!-- Text Input -->
            <div v-if="field.type === 'text'" class="form-group">
              <label :for="getFieldId(field)" class="block text-sm font-medium text-gray-700">
                {{ field.label }}{{ field.required ? ' *' : '' }}
              </label>
              <input 
                type="text" 
                :id="getFieldId(field)" 
                v-model="formData[getFieldId(field)]" 
                :placeholder="field.placeholder" 
                :required="field.required"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
              <p v-if="errors[getFieldId(field)]" class="mt-2 text-sm text-red-600">{{ errors[getFieldId(field)] }}</p>
            </div>

            <!-- Textarea -->
            <div v-else-if="field.type === 'textarea'" class="form-group">
              <label :for="getFieldId(field)" class="block text-sm font-medium text-gray-700">
                {{ field.label }}{{ field.required ? ' *' : '' }}
              </label>
              <textarea 
                :id="getFieldId(field)" 
                v-model="formData[getFieldId(field)]" 
                :placeholder="field.placeholder" 
                :required="field.required"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
              <p v-if="errors[getFieldId(field)]" class="mt-2 text-sm text-red-600">{{ errors[getFieldId(field)] }}</p>
            </div>

            <!-- Number Input -->
            <div v-else-if="field.type === 'number'" class="form-group">
              <label :for="getFieldId(field)" class="block text-sm font-medium text-gray-700">
                {{ field.label }}{{ field.required ? ' *' : '' }}
              </label>
              <input 
                type="number" 
                :id="getFieldId(field)" 
                v-model="formData[getFieldId(field)]" 
                :placeholder="field.placeholder" 
                :required="field.required"
                :min="field.validation && field.validation.min"
                :max="field.validation && field.validation.max"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
              <p v-if="errors[getFieldId(field)]" class="mt-2 text-sm text-red-600">{{ errors[getFieldId(field)] }}</p>
            </div>

            <!-- Email Input -->
            <div v-else-if="field.type === 'email'" class="form-group">
              <label :for="getFieldId(field)" class="block text-sm font-medium text-gray-700">
                {{ field.label }}{{ field.required ? ' *' : '' }}
              </label>
              <input 
                type="email" 
                :id="getFieldId(field)" 
                v-model="formData[getFieldId(field)]" 
                :placeholder="field.placeholder" 
                :required="field.required"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
              <p v-if="errors[getFieldId(field)]" class="mt-2 text-sm text-red-600">{{ errors[getFieldId(field)] }}</p>
            </div>

            <!-- Password Input -->
            <div v-else-if="field.type === 'password'" class="form-group">
              <label :for="getFieldId(field)" class="block text-sm font-medium text-gray-700">
                {{ field.label }}{{ field.required ? ' *' : '' }}
              </label>
              <input 
                type="password" 
                :id="getFieldId(field)" 
                v-model="formData[getFieldId(field)]" 
                :placeholder="field.placeholder" 
                :required="field.required"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
              <p v-if="errors[getFieldId(field)]" class="mt-2 text-sm text-red-600">{{ errors[getFieldId(field)] }}</p>
            </div>

            <!-- Date Input -->
            <div v-else-if="field.type === 'date'" class="form-group">
              <label :for="getFieldId(field)" class="block text-sm font-medium text-gray-700">
                {{ field.label }}{{ field.required ? ' *' : '' }}
              </label>
              <input 
                type="date" 
                :id="getFieldId(field)" 
                v-model="formData[getFieldId(field)]" 
                :required="field.required"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
              <p v-if="errors[getFieldId(field)]" class="mt-2 text-sm text-red-600">{{ errors[getFieldId(field)] }}</p>
            </div>

            <!-- Select Dropdown -->
            <div v-else-if="field.type === 'select'" class="form-group">
              <label :for="getFieldId(field)" class="block text-sm font-medium text-gray-700">
                {{ field.label }}{{ field.required ? ' *' : '' }}
              </label>
              <select 
                :id="getFieldId(field)" 
                v-model="formData[getFieldId(field)]" 
                :required="field.required"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="" disabled>Select an option</option>
                <option 
                  v-for="option in field.options" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <p v-if="errors[getFieldId(field)]" class="mt-2 text-sm text-red-600">{{ errors[getFieldId(field)] }}</p>
            </div>

            <!-- Radio Buttons -->
            <div v-else-if="field.type === 'radio'" class="form-group">
              <span class="block text-sm font-medium text-gray-700">
                {{ field.label }}{{ field.required ? ' *' : '' }}
              </span>
              <div class="mt-2 space-y-2">
                <div 
                  v-for="option in field.options" 
                  :key="option.value" 
                  class="flex items-center"
                >
                  <input 
                    type="radio" 
                    :id="`${getFieldId(field)}_${option.value}`" 
                    :name="getFieldId(field)" 
                    :value="option.value" 
                    v-model="formData[getFieldId(field)]" 
                    :required="field.required"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  >
                  <label :for="`${getFieldId(field)}_${option.value}`" class="ml-3 block text-sm font-medium text-gray-700">
                    {{ option.label }}
                  </label>
                </div>
              </div>
              <p v-if="errors[getFieldId(field)]" class="mt-2 text-sm text-red-600">{{ errors[getFieldId(field)] }}</p>
            </div>

            <!-- Checkboxes -->
            <div v-else-if="field.type === 'checkbox'" class="form-group">
              <div v-if="field.options && field.options.length > 1">
                <span class="block text-sm font-medium text-gray-700">
                  {{ field.label }}{{ field.required ? ' *' : '' }}
                </span>
                <div class="mt-2 space-y-2">
                  <div 
                    v-for="option in field.options" 
                    :key="option.value" 
                    class="flex items-center"
                  >
                    <input 
                      type="checkbox" 
                      :id="`${getFieldId(field)}_${option.value}`" 
                      :value="option.value" 
                      v-model="formData[getFieldId(field)]" 
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    >
                    <label :for="`${getFieldId(field)}_${option.value}`" class="ml-3 block text-sm font-medium text-gray-700">
                      {{ option.label }}
                    </label>
                  </div>
                </div>
              </div>
              <div v-else class="flex items-center">
                <input 
                  type="checkbox" 
                  :id="getFieldId(field)" 
                  v-model="formData[getFieldId(field)]" 
                  :required="field.required"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                >
                <label :for="getFieldId(field)" class="ml-3 block text-sm font-medium text-gray-700">
                  {{ field.label }}{{ field.required ? ' *' : '' }}
                </label>
              </div>
              <p v-if="errors[getFieldId(field)]" class="mt-2 text-sm text-red-600">{{ errors[getFieldId(field)] }}</p>
            </div>
          </div>

          <div v-if="currentForm.fields.length === 0" class="text-center text-gray-500 py-8">
            No fields added to this form yet. Go back to the editor to add fields.
          </div>

          <div v-else class="flex justify-end">
            <button 
              type="submit" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Form Submission Result Modal -->
    <div v-if="showResultModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Form Submission Result</h3>
        
        <div v-if="submissionSuccess" class="text-green-600 mb-4">
          <p>Form submitted successfully!</p>
        </div>
        <div v-else class="text-red-600 mb-4">
          <p>Error submitting form.</p>
          <p class="text-sm">{{ submissionError }}</p>
        </div>
        
        <div class="mt-6 flex justify-end">
          <button 
            @click="closeResultModal" 
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'PreviewView',
  setup() {
    const store = useStore()
    const route = useRoute()
    
    const currentForm = computed(() => store.getters.getCurrentForm)
    const formData = reactive({})
    const errors = ref({})
    
    // Form submission result
    const showResultModal = ref(false)
    const submissionSuccess = ref(false)
    const submissionError = ref('')
    
    onMounted(() => {
      // Check if we're previewing a specific form
      const formId = route.query.id
      if (formId) {
        const forms = store.getters.getForms
        const form = forms.find(f => f.id === formId)
        if (form) {
          store.dispatch('setCurrentForm', {...form})
        }
      }
      
      // Initialize form data with default values
      currentForm.value.fields.forEach(field => {
        const fieldId = getFieldId(field)
        
        switch (field.type) {
          case 'checkbox':
            if (field.options && field.options.length > 1) {
              formData[fieldId] = []
            } else {
              formData[fieldId] = false
            }
            break
          case 'number':
            formData[fieldId] = ''
            break
          default:
            formData[fieldId] = ''
        }
      })
    })
    
    const getFieldId = (field) => {
      return field.name || `${field.type}_${field.label.replace(/\s+/g, '')}`
    }
    
    const validate = () => {
      const newErrors = {}
      
      currentForm.value.fields.forEach(field => {
        const fieldId = getFieldId(field)
        const value = formData[fieldId]
        
        // Required validation
        if (field.required && (value === '' || value === null || value === undefined || 
            (Array.isArray(value) && value.length === 0))) {
          newErrors[fieldId] = 'This field is required'
          return
        }
        
        // Skip other validations if field is empty and not required
        if (value === '' || value === null || value === undefined) {
          return
        }
        
        // Validation rules
        if (field.validation) {
          // Min/Max validation for text, textarea, password
          if (['text', 'textarea', 'password'].includes(field.type) && typeof value === 'string') {
            if (field.validation.min && value.length < field.validation.min) {
              newErrors[fieldId] = `Minimum length is ${field.validation.min}`
            } else if (field.validation.max && value.length > field.validation.max) {
              newErrors[fieldId] = `Maximum length is ${field.validation.max}`
            }
          }
          
          // Min/Max validation for number
          if (field.type === 'number' && !isNaN(value)) {
            const numValue = Number(value)
            if (field.validation.min !== undefined && numValue < field.validation.min) {
              newErrors[fieldId] = `Minimum value is ${field.validation.min}`
            } else if (field.validation.max !== undefined && numValue > field.validation.max) {
              newErrors[fieldId] = `Maximum value is ${field.validation.max}`
            }
          }
          
          // Pattern validation
          if (field.validation.pattern && typeof value === 'string') {
            try {
              const regex = new RegExp(field.validation.pattern)
              if (!regex.test(value)) {
                newErrors[fieldId] = 'Invalid format'
              }
            } catch (e) {
              console.error('Invalid regex pattern:', e)
            }
          }
        }
      })
      
      errors.value = newErrors
      return Object.keys(newErrors).length === 0
    }
    
    const submitForm = async () => {
      if (!validate()) {
        return
      }
      
      // If no endpoint is specified, just show success
      if (!currentForm.value.endpoint) {
        submissionSuccess.value = true
        submissionError.value = ''
        showResultModal.value = true
        return
      }
      
      try {
        const response = await fetch(currentForm.value.endpoint, {
          method: currentForm.value.method || 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...currentForm.value.headers
          },
          body: JSON.stringify(formData)
        })
        
        if (response.ok) {
          submissionSuccess.value = true
          submissionError.value = ''
        } else {
          submissionSuccess.value = false
          submissionError.value = `Server returned ${response.status}: ${response.statusText}`
        }
      } catch (error) {
        submissionSuccess.value = false
        submissionError.value = error.message || 'Network error'
      }
      
      showResultModal.value = true
    }
    
    const closeResultModal = () => {
      showResultModal.value = false
    }
    
    return {
      currentForm,
      formData,
      errors,
      showResultModal,
      submissionSuccess,
      submissionError,
      getFieldId,
      submitForm,
      closeResultModal
    }
  }
}
</script>