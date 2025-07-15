<template>
  <div class="form-preview">
    <div v-if="showHeader" class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">{{ form.name || untitledFormText }}</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">{{ previewSubtitleText }}</p>
        </div>
        <div class="flex space-x-2">
          <slot name="header-actions"></slot>
        </div>
      </div>
    </div>

    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <form @submit.prevent="submitForm" class="space-y-6">
          <div v-for="(field, index) in form.fields" :key="index" 
               v-show="!field.hidden || previewMode"
               :class="[
                 'form-field',
                 field.hidden && previewMode ? 'opacity-50 pointer-events-none relative' : ''
               ]">
            <!-- Hidden field indicator for preview mode -->
            <div v-if="field.hidden && previewMode" class="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-md z-10">
              HIDDEN
            </div>
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
                :class="`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none ${colorClasses.focusRing} ${colorClasses.focusBorder} sm:text-sm`"
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
                :class="`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none ${colorClasses.focusRing} ${colorClasses.focusBorder} sm:text-sm`"
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
                :class="`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none ${colorClasses.focusRing} ${colorClasses.focusBorder} sm:text-sm`"
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
                :class="`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none ${colorClasses.focusRing} ${colorClasses.focusBorder} sm:text-sm`"
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
                :class="`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none ${colorClasses.focusRing} ${colorClasses.focusBorder} sm:text-sm`"
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
                :class="`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none ${colorClasses.focusRing} ${colorClasses.focusBorder} sm:text-sm`"
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
                :class="`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none ${colorClasses.focusRing} ${colorClasses.focusBorder} sm:text-sm`"
              >
                <option value="" disabled>{{ selectPlaceholderText }}</option>
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
                    :class="`h-4 w-4 ${colorClasses.text600} ${colorClasses.focusRing} border-gray-300`"
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
                      :class="`h-4 w-4 ${colorClasses.text600} ${colorClasses.focusRing} border-gray-300 rounded`"
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
                  :class="`h-4 w-4 ${colorClasses.text600} ${colorClasses.focusRing} border-gray-300 rounded`"
                >
                <label :for="getFieldId(field)" class="ml-3 block text-sm font-medium text-gray-700">
                  {{ field.label }}{{ field.required ? ' *' : '' }}
                </label>
              </div>
              <p v-if="errors[getFieldId(field)]" class="mt-2 text-sm text-red-600">{{ errors[getFieldId(field)] }}</p>
            </div>
          </div>

          <div v-if="form.fields.length === 0" class="text-center text-gray-500 py-8">
            {{ emptyFormText }}
          </div>

          <div v-else class="flex justify-end">
            <slot name="submit-button">
              <button 
                type="submit" 
                :class="`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${colorClasses.bg600} ${colorClasses.hoverBg700} focus:outline-none ${colorClasses.ring} ${colorClasses.ringOffset} ${colorClasses.ringColor}`"
              >
                {{ submitButtonText }}
              </button>
            </slot>
          </div>
        </form>
      </div>
    </div>

    <!-- Form Submission Result Modal -->
    <div v-if="showResultModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">{{ resultModalTitle }}</h3>

        <div v-if="submissionSuccess" class="text-green-600 mb-4">
          <p>{{ successMessageText }}</p>
        </div>
        <div v-else class="text-red-600 mb-4">
          <p>{{ errorMessageText }}</p>
          <p v-if="submissionError" class="text-sm">{{ submissionError }}</p>
        </div>

        <div class="mt-6 flex justify-end">
          <button 
            @click="closeResultModal" 
            :class="`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${colorClasses.bg600} ${colorClasses.hoverBg700} focus:outline-none ${colorClasses.ring} ${colorClasses.ringOffset} ${colorClasses.ringColor}`"
          >
            {{ closeButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'FormPreview',
  props: {
    // Form data
    form: {
      type: Object,
      required: true
    },
    formId: {
      type: String,
      default: null
    },
    // UI configuration
    showHeader: {
      type: Boolean,
      default: true
    },
    // Text customization
    untitledFormText: {
      type: String,
      default: 'Untitled Form'
    },
    previewSubtitleText: {
      type: String,
      default: 'Preview your form'
    },
    emptyFormText: {
      type: String,
      default: 'No fields added to this form yet. Go back to the editor to add fields.'
    },
    selectPlaceholderText: {
      type: String,
      default: 'Select an option'
    },
    submitButtonText: {
      type: String,
      default: 'Submit'
    },
    resultModalTitle: {
      type: String,
      default: 'Form Submission Result'
    },
    successMessageText: {
      type: String,
      default: 'Form submitted successfully!'
    },
    errorMessageText: {
      type: String,
      default: 'Error submitting form.'
    },
    closeButtonText: {
      type: String,
      default: 'Close'
    },
    // Preview mode - when true, hidden fields are shown as disabled
    previewMode: {
      type: Boolean,
      default: false
    },
    // Store configuration
    storeModuleName: {
      type: String,
      default: 'formBuilder'
    },
    // Color customization
    color: {
      type: [String, Object],
      default: 'indigo',
      validator: (value) => {
        // If it's a string, validate against common Tailwind colors
        if (typeof value === 'string') {
          const validColors = [
            'slate', 'gray', 'zinc', 'neutral', 'stone',
            'red', 'orange', 'amber', 'yellow', 'lime', 'green',
            'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo',
            'violet', 'purple', 'fuchsia', 'pink', 'rose'
          ]
          return validColors.includes(value)
        }

        // If it's an object, validate it has the required structure for custom colors
        if (typeof value === 'object' && value !== null) {
          // Must have a name property
          if (!value.name || typeof value.name !== 'string') {
            return false
          }

          // Must have a colors property with the required shades
          if (!value.colors || typeof value.colors !== 'object') {
            return false
          }

          // Check that all required shades are present and are valid hex colors
          const requiredShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
          const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

          for (const shade of requiredShades) {
            if (!value.colors[shade] || !hexColorRegex.test(value.colors[shade])) {
              return false
            }
          }

          return true
        }

        return false
      }
    }
  },
  emits: [
    'submit',
    'validation-error',
    'submit-success',
    'submit-error'
  ],
  setup(props, { emit }) {
    const store = useStore()

    // Computed properties for store access with namespace
    const getStoreGetter = (getter) => {
      try {
        return store.getters[`${props.storeModuleName}/${getter}`]
      } catch (e) {
        console.warn('Store not available or error accessing getter:', e)
        return null
      }
    }

    // Form data
    const formData = reactive({})
    const errors = ref({})

    // Form submission result
    const showResultModal = ref(false)
    const submissionSuccess = ref(false)
    const submissionError = ref('')

    // Watch for changes to form prop
    watch(() => props.form, (newForm) => {
      initializeFormData(newForm)
    })

    // Watch for changes to formId prop
    watch(() => props.formId, (newId) => {
      if (newId) {
        loadFormById(newId)
      }
    })

    onMounted(() => {
      // If formId is provided, try to load the form from store
      if (props.formId) {
        loadFormById(props.formId)
      } else {
        // Otherwise use the provided form
        initializeFormData(props.form)
      }
    })

    const loadFormById = (id) => {
      const formGetter = getStoreGetter('getFormById')
      if (formGetter) {
        const form = formGetter(id)
        if (form) {
          initializeFormData(form)
        }
      }
    }

    const initializeFormData = (form) => {
      // Initialize form data with default values
      form.fields.forEach(field => {
        const fieldId = getFieldId(field)

        // If field is hidden and has a default value, use it
        if (field.hidden && field.defaultValue !== undefined && field.defaultValue !== '') {
          formData[fieldId] = field.defaultValue
          return
        }

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
    }

    const getFieldId = (field) => {
      return field.name || `${field.type}_${field.label.replace(/\s+/g, '')}`
    }

    const validate = () => {
      const newErrors = {}

      props.form.fields.forEach(field => {
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

      if (Object.keys(newErrors).length > 0) {
        emit('validation-error', newErrors)
      }

      return Object.keys(newErrors).length === 0
    }

    const submitForm = async () => {
      if (!validate()) {
        return
      }

      // Emit submit event with form data
      emit('submit', { ...formData })

      // If no endpoint is specified, just show success
      if (!props.form.endpoint) {
        submissionSuccess.value = true
        submissionError.value = ''
        showResultModal.value = true
        emit('submit-success', { data: null })
        return
      }

      try {
        const response = await fetch(props.form.endpoint, {
          method: props.form.method || 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...props.form.headers
          },
          body: JSON.stringify(formData)
        })

        let responseData = null
        try {
          responseData = await response.json()
        } catch (e) {
          // Response might not be JSON
        }

        if (response.ok) {
          submissionSuccess.value = true
          submissionError.value = ''
          emit('submit-success', { data: responseData, response })
        } else {
          submissionSuccess.value = false
          submissionError.value = `Server returned ${response.status}: ${response.statusText}`
          emit('submit-error', { 
            error: new Error(`Server returned ${response.status}: ${response.statusText}`),
            data: responseData,
            response
          })
        }
      } catch (error) {
        submissionSuccess.value = false
        submissionError.value = error.message || 'Network error'
        emit('submit-error', { error })
      }

      showResultModal.value = true
    }

    const closeResultModal = () => {
      showResultModal.value = false
    }

    // Function to inject custom color styles into the document
    const injectCustomColorStyles = (customColor) => {
      const styleId = `custom-color-${customColor.name}`

      // Remove existing style if it exists
      const existingStyle = document.getElementById(styleId)
      if (existingStyle) {
        existingStyle.remove()
      }

      // Create CSS rules for all shades and states
      const cssRules = []

      // Generate CSS for each shade
      Object.entries(customColor.colors).forEach(([shade, hexColor]) => {
        // Text colors
        cssRules.push(`.text-${customColor.name}-${shade} { color: ${hexColor} !important; }`)

        // Background colors
        cssRules.push(`.bg-${customColor.name}-${shade} { background-color: ${hexColor} !important; }`)

        // Border colors
        cssRules.push(`.border-${customColor.name}-${shade} { border-color: ${hexColor} !important; }`)

        // Focus states
        cssRules.push(`.focus\\:ring-${customColor.name}-${shade}:focus { --tw-ring-color: ${hexColor} !important; }`)
        cssRules.push(`.focus\\:border-${customColor.name}-${shade}:focus { border-color: ${hexColor} !important; }`)

        // Hover states
        cssRules.push(`.hover\\:bg-${customColor.name}-${shade}:hover { background-color: ${hexColor} !important; }`)
        cssRules.push(`.hover\\:text-${customColor.name}-${shade}:hover { color: ${hexColor} !important; }`)
      })

      // Create and inject the style element
      const styleElement = document.createElement('style')
      styleElement.id = styleId
      styleElement.textContent = cssRules.join('\n')
      document.head.appendChild(styleElement)
    }

    // Color computed properties
    const colorClasses = computed(() => {
      const color = props.color
      let colorName

      // Handle both string (standard colors) and object (custom colors)
      if (typeof color === 'string') {
        colorName = color
      } else if (typeof color === 'object' && color.name) {
        colorName = color.name
        // Inject custom color definitions into the document
        injectCustomColorStyles(color)
      }

      return {
        // Focus ring and border colors
        focusRing: `focus:ring-${colorName}-500`,
        focusBorder: `focus:border-${colorName}-500`,

        // Text colors
        text600: `text-${colorName}-600`,
        text500: `text-${colorName}-500`,

        // Background colors
        bg600: `bg-${colorName}-600`,
        bg700: `bg-${colorName}-700`,

        // Hover background colors
        hoverBg700: `hover:bg-${colorName}-700`,

        // Ring colors for focus states
        ringOffset: `focus:ring-offset-2`,
        ring: `focus:ring-2`,
        ringColor: `focus:ring-${colorName}-500`
      }
    })

    return {
      formData,
      errors,
      showResultModal,
      submissionSuccess,
      submissionError,
      getFieldId,
      submitForm,
      closeResultModal,
      colorClasses
    }
  }
}
</script>
