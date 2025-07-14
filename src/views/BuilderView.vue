<template>
  <div class="builder">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Left Sidebar - Component Selection -->
      <div class="md:col-span-1 bg-white shadow rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Components</h3>
        <div class="space-y-2">
          <div 
            v-for="component in availableComponents" 
            :key="component.type"
            class="p-3 border rounded-md bg-gray-50 cursor-move hover:bg-gray-100"
            draggable="true"
            @dragstart="onDragStart($event, component)"
          >
            <div class="flex items-center">
              <span class="text-gray-700">{{ component.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content - Form Builder -->
      <div class="md:col-span-2 bg-white shadow rounded-lg p-4">
        <div class="flex justify-between items-center mb-4">
          <div>
            <label for="form-name" class="block text-sm font-medium text-gray-700">Form Name</label>
            <input 
              type="text" 
              id="form-name" 
              v-model="currentForm.name" 
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter form name"
            >
          </div>
          <div class="flex space-x-2">
            <button 
              @click="saveForm" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Form
            </button>
            <button 
              @click="exportFormCode" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Export Code
            </button>
          </div>
        </div>

        <!-- Form Builder Area -->
        <div 
          class="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[400px]"
          @dragover.prevent
          @drop="onDrop"
        >
          <div v-if="currentForm.fields.length === 0" class="text-center text-gray-500 py-8">
            Drag and drop components here to build your form
          </div>
          <div v-else class="grid grid-cols-2 gap-4">
            <div 
              v-for="(field, index) in currentForm.fields" 
              :key="index"
              :class="[
                'p-4 border rounded-md bg-white hover:bg-gray-50 relative',
                field.width === 'half' ? 'col-span-1' : 'col-span-2'
              ]"
            >
              <div class="flex justify-between items-start">
                <div class="w-full">
                  <div class="flex justify-between mb-2">
                    <span class="font-medium text-gray-700">{{ getComponentLabel(field.type) }}</span>
                    <div class="flex space-x-1">
                      <button 
                        @click="editField(index)" 
                        class="text-gray-500 hover:text-gray-700"
                      >
                        Edit
                      </button>
                      <button 
                        @click="deleteField(index)" 
                        class="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div class="text-sm text-gray-500">
                    <div v-if="field.key">Key: {{ field.key }}</div>
                    <div v-if="field.label">Label: {{ field.label }}</div>
                    <div v-if="field.placeholder">Placeholder: {{ field.placeholder }}</div>
                    <div>Required: {{ field.required ? 'Yes' : 'No' }}</div>
                    <div>Width: {{ field.width === 'half' ? 'Half Width' : 'Full Width' }}</div>
                    <div v-if="field.validation">
                      Validation: 
                      <span v-if="field.validation.min">Min: {{ field.validation.min }}</span>
                      <span v-if="field.validation.max">Max: {{ field.validation.max }}</span>
                      <span v-if="field.validation.pattern">Pattern: {{ field.validation.pattern }}</span>
                    </div>
                    <div v-if="field.options && field.options.length">
                      Options: {{ field.options.map(o => o.label).join(', ') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar - Form Settings -->
      <div class="md:col-span-1 bg-white shadow rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Form Settings</h3>

        <div class="space-y-4">
          <div>
            <label for="endpoint" class="block text-sm font-medium text-gray-700">Endpoint</label>
            <input 
              type="text" 
              id="endpoint" 
              v-model="currentForm.endpoint" 
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="https://api.example.com/submit"
            >
          </div>

          <div>
            <label for="method" class="block text-sm font-medium text-gray-700">HTTP Method</label>
            <select 
              id="method" 
              v-model="currentForm.method" 
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Headers</label>
            <div v-for="(value, key) in headers" :key="key" class="flex mb-2">
              <input 
                type="text" 
                v-model="headerKeys[key]" 
                class="w-1/3 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Key"
              >
              <input 
                type="text" 
                v-model="headers[key]" 
                class="w-2/3 border border-gray-300 rounded-r-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Value"
              >
            </div>
            <button 
              @click="addHeader" 
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Header
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Field Edit Modal -->
    <div v-if="showFieldModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Edit {{ getComponentLabel(editingField.type) }}</h3>

        <div class="space-y-4">
          <div>
            <label for="field-label" class="block text-sm font-medium text-gray-700">Label</label>
            <input 
              type="text" 
              id="field-label" 
              v-model="editingField.label" 
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
          </div>

          <div>
            <label for="field-key" class="block text-sm font-medium text-gray-700">Key</label>
            <input 
              type="text" 
              id="field-key" 
              v-model="editingField.key" 
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :class="{ 'border-red-500': fieldErrors.value.key }"
              @input="keyManuallyEdited = true"
            >
            <p v-if="fieldErrors.value.key" class="mt-1 text-sm text-red-600">{{ fieldErrors.value.key }}</p>
          </div>

          <div>
            <label for="field-placeholder" class="block text-sm font-medium text-gray-700">Placeholder</label>
            <input 
              type="text" 
              id="field-placeholder" 
              v-model="editingField.placeholder" 
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
          </div>

          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="field-required" 
              v-model="editingField.required" 
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            >
            <label for="field-required" class="ml-2 block text-sm text-gray-900">Required</label>
          </div>

          <!-- Field Width Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Field Width</label>
            <div class="flex space-x-4">
              <div class="flex items-center">
                <input 
                  type="radio" 
                  id="field-width-full" 
                  v-model="editingField.width" 
                  value="full" 
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                >
                <label for="field-width-full" class="ml-2 block text-sm text-gray-900">Full Width</label>
              </div>
              <div class="flex items-center">
                <input 
                  type="radio" 
                  id="field-width-half" 
                  v-model="editingField.width" 
                  value="half" 
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                >
                <label for="field-width-half" class="ml-2 block text-sm text-gray-900">Half Width</label>
              </div>
            </div>
          </div>

          <!-- Validation Options -->
          <div v-if="['text', 'textarea', 'number', 'email', 'password'].includes(editingField.type)">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Validation</h4>

            <div v-if="['text', 'textarea', 'password'].includes(editingField.type)" class="grid grid-cols-2 gap-4">
              <div>
                <label for="field-min" class="block text-sm font-medium text-gray-700">Min Length</label>
                <input 
                  type="number" 
                  id="field-min" 
                  v-model="editingField.validation.min" 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
              </div>
              <div>
                <label for="field-max" class="block text-sm font-medium text-gray-700">Max Length</label>
                <input 
                  type="number" 
                  id="field-max" 
                  v-model="editingField.validation.max" 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
              </div>
            </div>

            <div v-if="['number'].includes(editingField.type)" class="grid grid-cols-2 gap-4">
              <div>
                <label for="field-min" class="block text-sm font-medium text-gray-700">Min Value</label>
                <input 
                  type="number" 
                  id="field-min" 
                  v-model="editingField.validation.min" 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
              </div>
              <div>
                <label for="field-max" class="block text-sm font-medium text-gray-700">Max Value</label>
                <input 
                  type="number" 
                  id="field-max" 
                  v-model="editingField.validation.max" 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
              </div>
            </div>

            <div v-if="['text', 'email', 'password'].includes(editingField.type)">
              <label for="field-pattern" class="block text-sm font-medium text-gray-700 mt-4">Pattern (Regex)</label>
              <input 
                type="text" 
                id="field-pattern" 
                v-model="editingField.validation.pattern" 
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
            </div>
          </div>

          <!-- Options for select, radio, checkbox -->
          <div v-if="['select', 'radio', 'checkbox'].includes(editingField.type)">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Options</h4>

            <div v-for="(option, optionIndex) in editingField.options" :key="optionIndex" class="flex mb-2">
              <input 
                type="text" 
                v-model="option.value" 
                class="w-1/3 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Value"
              >
              <input 
                type="text" 
                v-model="option.label" 
                class="w-2/3 border border-gray-300 rounded-r-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Label"
              >
              <button 
                @click="removeOption(optionIndex)" 
                class="ml-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            <button 
              @click="addOption" 
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Option
            </button>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="closeFieldModal" 
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button 
            @click="saveField" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Code Export Modal -->
    <div v-if="showExportModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Export Form Code</h3>

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
            @click="closeExportModal" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Notification Modal -->
    <NotificationModal
      v-model="showNotification"
      :title="notificationTitle"
      :message="notificationMessage"
      :button-text="notificationButtonText"
      :timeout="notificationTimeout"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import NotificationModal from "../lib/components/NotificationModal.vue";

export default {
  name: 'BuilderView',
  components: {NotificationModal},
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    // Form data
    const currentForm = computed(() => store.getters.getCurrentForm)
    const availableComponents = computed(() => store.getters.getAvailableComponents)

    // Headers management
    const headers = ref({...currentForm.value.headers})
    const headerKeys = ref({})

    // Field editing
    const showFieldModal = ref(false)
    const editingField = ref({})
    const editingFieldIndex = ref(-1)
    const fieldErrors = ref({})
    const keyManuallyEdited = ref(false)

    // Code export
    const showExportModal = ref(false)
    const exportedCode = ref('')

    // Notification modal
    const showNotification = ref(false)
    const notificationTitle = ref('Notification')
    const notificationMessage = ref('')
    const notificationButtonText = ref('OK')
    const notificationTimeout = ref(3000) // Auto-close after 3 seconds

    onMounted(() => {
      // Check if we're editing an existing form
      const formId = route.query.id
      if (formId) {
        const forms = store.getters.getForms
        const form = forms.find(f => f.id === formId)
        if (form) {
          store.dispatch('setCurrentForm', {...form})
        }
      }

      // Initialize headers
      Object.keys(currentForm.value.headers).forEach(key => {
        headerKeys.value[key] = key
      })
    })

    // Drag and drop functionality
    const onDragStart = (event, component) => {
      event.dataTransfer.setData('componentType', component.type)
    }

    const onDrop = (event) => {
      const componentType = event.dataTransfer.getData('componentType')
      if (!componentType) return

      // Create a new field based on the component type
      const newField = createDefaultField(componentType)
      store.dispatch('addField', newField)
    }

    const createDefaultField = (type) => {
      const componentLabel = getComponentLabel(type)
      // Generate key from label: convert to lowercase and remove spaces
      const generatedKey = componentLabel.toLowerCase().replace(/\s+/g, '')

      const field = {
        type,
        key: generatedKey, // Key based on the field's label
        label: componentLabel,
        placeholder: '',
        required: false,
        validation: {},
        width: 'full' // Default width: full or half
      }

      if (['select', 'radio', 'checkbox'].includes(type)) {
        field.options = [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ]
      }

      return field
    }

    const getComponentLabel = (type) => {
      const component = availableComponents.value.find(c => c.type === type)
      return component ? component.label : type
    }

    // Field editing
    const editField = (index) => {
      editingFieldIndex.value = index
      editingField.value = JSON.parse(JSON.stringify(currentForm.value.fields[index]))

      // Ensure validation object exists
      if (!editingField.value.validation) {
        editingField.value.validation = {}
      }

      showFieldModal.value = true
    }

    const saveField = () => {
      // Clear previous errors
      fieldErrors.value = {}

      // Check if key is empty
      if (!editingField.value.key || editingField.value.key.trim() === '') {
        fieldErrors.value.key = 'Key cannot be empty'
        return
      }

      // Check for duplicate keys
      const duplicateKeyIndex = currentForm.value.fields.findIndex((field, index) => 
        field.key === editingField.value.key && index !== editingFieldIndex.value
      )

      if (duplicateKeyIndex !== -1) {
        fieldErrors.value.key = 'This key is already used by another field'
        return
      }

      // If no errors, save the field
      store.dispatch('updateField', {
        index: editingFieldIndex.value,
        field: editingField.value
      })
      closeFieldModal()
    }

    const closeFieldModal = () => {
      showFieldModal.value = false
      editingField.value = {}
      editingFieldIndex.value = -1
      fieldErrors.value = {}
      keyManuallyEdited.value = false
    }

    // Watch for label changes to update key automatically
    watch(() => editingField.value.label, (newLabel) => {
      // Only update key if we're editing a field and the key hasn't been manually edited
      if (showFieldModal.value && newLabel && !keyManuallyEdited.value) {
        // Generate key from label: convert to lowercase and remove spaces
        const generatedKey = newLabel.toLowerCase().replace(/\s+/g, '')
        editingField.value.key = generatedKey
      }
    })

    const deleteField = (index) => {
      if (confirm('Are you sure you want to delete this field?')) {
        store.dispatch('deleteField', index)
      }
    }

    // Options management for select, radio, checkbox
    const addOption = () => {
      if (!editingField.value.options) {
        editingField.value.options = []
      }
      editingField.value.options.push({ value: '', label: '' })
    }

    const removeOption = (index) => {
      editingField.value.options.splice(index, 1)
    }

    // Headers management
    const addHeader = () => {
      const newKey = `header${Object.keys(headers.value).length + 1}`
      headers.value[newKey] = ''
      headerKeys.value[newKey] = newKey
    }

    // Save form
    const saveForm = () => {
      // Update headers from the UI to the form
      const formattedHeaders = {}
      Object.keys(headers.value).forEach(key => {
        if (headerKeys.value[key] && headers.value[key]) {
          formattedHeaders[headerKeys.value[key]] = headers.value[key]
        }
      })

      store.dispatch('updateFormSettings', {
        endpoint: currentForm.value.endpoint,
        method: currentForm.value.method,
        headers: formattedHeaders
      })

      store.dispatch('saveForm').then(savedForm => {
        notificationTitle.value = 'Success'
        notificationMessage.value = 'Form saved successfully!'
        notificationButtonText.value = 'OK'
        showNotification.value = true
        // If it's a new form, update the URL to include the form ID
        if (!route.query.id) {
          router.replace({ path: '/builder', query: { id: savedForm.id } })
        }
      })
    }

    // Export form code
    const exportFormCode = () => {
      // Generate Vue component code for the form
      const formFields = currentForm.value.fields.map(field => {
        return generateFieldCode(field)
      }).join('\n      ')

      const validationRules = currentForm.value.fields.reduce((rules, field) => {
        if (field.required || field.validation) {
          rules[field.key || field.type + field.label.replace(/\s+/g, '')] = generateValidationRules(field)
        }
        return rules
      }, {})

      // Use string concatenation to avoid Vue parsing the template tags
      exportedCode.value = '<template>\n' +
  '  <form @submit.prevent="submitForm" class="space-y-6">\n' +
  '    ' + formFields + '\n' +
  '    <div>\n' +
  '      <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">\n' +
  '        Submit\n' +
  '      </button>\n' +
  '    </div>\n' +
  '    \n' +
  '    <!-- Notification Modal -->\n' +
  '    <div v-if="showNotification" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">\n' +
  '      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">\n' +
  '        <h3 class="text-lg font-medium text-gray-900 mb-4">{{ notificationTitle }}</h3>\n' +
  '        \n' +
  '        <div class="mb-6">\n' +
  '          <p class="text-gray-700">{{ notificationMessage }}</p>\n' +
  '        </div>\n' +
  '        \n' +
  '        <div class="flex justify-end">\n' +
  '          <button \n' +
  '            @click="closeNotification" \n' +
  '            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"\n' +
  '          >\n' +
  '            OK\n' +
  '          </button>\n' +
  '        </div>\n' +
  '      </div>\n' +
  '    </div>\n' +
  '  </form>\n' +
  '</template>\n' +
  '\n' +
  '<script>\n' +
  'import { reactive, ref } from \'vue\'\n' +
  '\n' +
  'export default {\n' +
  '  name: \'' + (currentForm.value.name || 'GeneratedForm') + '\',\n' +
  '  setup() {\n' +
  '    const formData = reactive({\n' +
  '      ' + currentForm.value.fields.map(field => {
          const fieldName = field.key || field.type + field.label.replace(/\s+/g, '')
          return fieldName + ': ' + getDefaultValueForType(field.type, field)
        }).join(',\n      ') + '\n' +
  '    })\n' +
  '\n' +
  '    const errors = ref({})\n' +
  '    \n' +
  '    // Notification state\n' +
  '    const showNotification = ref(false)\n' +
  '    const notificationTitle = ref(\'Notification\')\n' +
  '    const notificationMessage = ref(\'\')\n' +
  '    \n' +
  '    const closeNotification = () => {\n' +
  '      showNotification.value = false\n' +
  '    }\n' +
  '    \n' +
  '    const showNotificationModal = (title, message) => {\n' +
  '      notificationTitle.value = title\n' +
  '      notificationMessage.value = message\n' +
  '      showNotification.value = true\n' +
  '    }\n' +
  '\n' +
  '    const rules = ' + JSON.stringify(validationRules, null, 6).replace(/"([^"]+)":/g, '$1:') + '\n' +
  '\n' +
  '    const validate = () => {\n' +
  '      const newErrors = {}\n' +
  '\n' +
  '      Object.keys(rules).forEach(field => {\n' +
  '        const fieldRules = rules[field]\n' +
  '\n' +
  '        if (fieldRules.required && !formData[field]) {\n' +
  '          newErrors[field] = \'This field is required\'\n' +
  '        } else if (fieldRules.min && formData[field].length < fieldRules.min) {\n' +
  '          newErrors[field] = `Minimum length is ${fieldRules.min}`\n' +
  '        } else if (fieldRules.max && formData[field].length > fieldRules.max) {\n' +
  '          newErrors[field] = `Maximum length is ${fieldRules.max}`\n' +
  '        } else if (fieldRules.pattern && !new RegExp(fieldRules.pattern).test(formData[field])) {\n' +
  '          newErrors[field] = \'Invalid format\'\n' +
  '        }\n' +
  '      })\n' +
  '\n' +
  '      errors.value = newErrors\n' +
  '      return Object.keys(newErrors).length === 0\n' +
  '    }\n' +
  '\n' +
  '    const submitForm = async () => {\n' +
  '      if (!validate()) {\n' +
  '        return\n' +
  '      }\n' +
  '\n' +
  '      try {\n' +
  '        const response = await fetch(\'' + (currentForm.value.endpoint || 'https://api.example.com/submit') + '\', {\n' +
  '          method: \'' + (currentForm.value.method || 'POST') + '\',\n' +
  '          headers: {\n' +
  '            \'Content-Type\': \'application/json\',\n' +
  '            ' + Object.entries(currentForm.value.headers || {}).map(([key, value]) => '\'' + key + '\': \'' + value + '\'').join(',\n            ') + '\n' +
  '          },\n' +
  '          body: JSON.stringify(formData)\n' +
  '        })\n' +
  '\n' +
  '        if (response.ok) {\n' +
  '          showNotificationModal(\'Success\', \'Form submitted successfully!\')\n' +
  '          // Reset form or redirect\n' +
  '        } else {\n' +
  '          showNotificationModal(\'Error\', \'Error submitting form\')\n' +
  '        }\n' +
  '      } catch (error) {\n' +
  '        console.error(\'Error:\', error)\n' +
  '        showNotificationModal(\'Error\', \'Error submitting form\')\n' +
  '      }\n' +
  '    }\n' +
  '\n' +
  '    return {\n' +
  '      formData,\n' +
  '      errors,\n' +
  '      submitForm,\n' +
  '      showNotification,\n' +
  '      notificationTitle,\n' +
  '      notificationMessage,\n' +
  '      closeNotification\n' +
  '    }\n' +
  '  }\n' +
  '}\n' +
  '<'+'/script>'

      showExportModal.value = true
    }

    const generateFieldCode = (field) => {
      const fieldName = field.key || field.type + field.label.replace(/\s+/g, '')
      const requiredAttr = field.required ? ' required' : ''
      const errorDisplay = `<p v-if="errors['${fieldName}']" class="mt-2 text-sm text-red-600">{{ errors['${fieldName}'] }}</p>`
      const widthClass = field.width === 'half' ? 'w-1/2 px-2' : 'w-full px-2'

      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
        case 'date':
          return `<div class="${widthClass} mb-4">
        <label for="${fieldName}" class="block text-sm font-medium text-gray-700">${field.label}${field.required ? ' *' : ''}</label>
        <input 
          type="${field.type}" 
          id="${fieldName}" 
          v-model="formData.${fieldName}"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="${field.placeholder || ''}"${requiredAttr}
        >
        ${errorDisplay}
      </div>`

        case 'textarea':
          return `<div class="${widthClass} mb-4">
        <label for="${fieldName}" class="block text-sm font-medium text-gray-700">${field.label}${field.required ? ' *' : ''}</label>
        <textarea 
          id="${fieldName}" 
          v-model="formData.${fieldName}"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="${field.placeholder || ''}"${requiredAttr}
        ></textarea>
        ${errorDisplay}
      </div>`

        case 'select':
          return `<div class="${widthClass} mb-4">
        <label for="${fieldName}" class="block text-sm font-medium text-gray-700">${field.label}${field.required ? ' *' : ''}</label>
        <select 
          id="${fieldName}" 
          v-model="formData.${fieldName}"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"${requiredAttr}
        >
          <option value="" disabled>Select an option</option>
          ${field.options.map(option => `<option value="${option.value}">${option.label}</option>`).join('\n          ')}
        </select>
        ${errorDisplay}
      </div>`

        case 'radio':
          return `<div class="${widthClass} mb-4">
        <span class="block text-sm font-medium text-gray-700">${field.label}${field.required ? ' *' : ''}</span>
        <div class="mt-2 space-y-2">
          ${field.options.map(option => `
          <div class="flex items-center">
            <input 
              type="radio" 
              id="${fieldName}_${option.value}" 
              name="${fieldName}" 
              value="${option.value}" 
              v-model="formData.${fieldName}"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"${requiredAttr}
            >
            <label for="${fieldName}_${option.value}" class="ml-3 block text-sm font-medium text-gray-700">
              ${option.label}
            </label>
          </div>`).join('')}
        </div>
        ${errorDisplay}
      </div>`

        case 'checkbox':
          if (field.options && field.options.length > 1) {
            return `<div class="${widthClass} mb-4">
        <span class="block text-sm font-medium text-gray-700">${field.label}${field.required ? ' *' : ''}</span>
        <div class="mt-2 space-y-2">
          ${field.options.map(option => `
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="${fieldName}_${option.value}" 
              value="${option.value}" 
              v-model="formData.${fieldName}"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            >
            <label for="${fieldName}_${option.value}" class="ml-3 block text-sm font-medium text-gray-700">
              ${option.label}
            </label>
          </div>`).join('')}
        </div>
        ${errorDisplay}
      </div>`
          } else {
            return `<div class="${widthClass} mb-4 flex items-center">
        <input 
          type="checkbox" 
          id="${fieldName}" 
          v-model="formData.${fieldName}"
          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"${requiredAttr}
        >
        <label for="${fieldName}" class="ml-3 block text-sm font-medium text-gray-700">
          ${field.label}${field.required ? ' *' : ''}
        </label>
        ${errorDisplay}
      </div>`
          }

        default:
          return `<div class="${widthClass} mb-4">
        <label for="${fieldName}" class="block text-sm font-medium text-gray-700">${field.label}${field.required ? ' *' : ''}</label>
        <input 
          type="text" 
          id="${fieldName}" 
          v-model="formData.${fieldName}"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="${field.placeholder || ''}"${requiredAttr}
        >
        ${errorDisplay}
      </div>`
      }
    }

    const generateValidationRules = (field) => {
      const rules = {}

      if (field.required) {
        rules.required = true
      }

      if (field.validation) {
        if (field.validation.min !== undefined && field.validation.min !== null && field.validation.min !== '') {
          rules.min = parseInt(field.validation.min)
        }

        if (field.validation.max !== undefined && field.validation.max !== null && field.validation.max !== '') {
          rules.max = parseInt(field.validation.max)
        }

        if (field.validation.pattern) {
          rules.pattern = field.validation.pattern
        }
      }

      return rules
    }

    const getDefaultValueForType = (type, field) => {
      switch (type) {
        case 'checkbox':
          // For a checkbox group with multiple options, return an array
          // For a single checkbox, return false
          return field && field.options && field.options.length > 1 ? '[]' : 'false'
        case 'number':
          return '0'
        case 'select':
        case 'radio':
          return "''"
        default:
          return "''"
      }
    }

    const closeExportModal = () => {
      showExportModal.value = false
    }

    const copyCode = () => {
      navigator.clipboard.writeText(exportedCode.value)
        .then(() => {
          notificationTitle.value = 'Success'
          notificationMessage.value = 'Code copied to clipboard!'
          notificationButtonText.value = 'OK'
          showNotification.value = true
        })
        .catch(err => {
          console.error('Failed to copy code: ', err)
          notificationTitle.value = 'Error'
          notificationMessage.value = 'Failed to copy code to clipboard'
          notificationButtonText.value = 'OK'
          showNotification.value = true
        })
    }

    return {
      currentForm,
      availableComponents,
      headers,
      headerKeys,
      showFieldModal,
      editingField,
      editingFieldIndex,
      fieldErrors,
      keyManuallyEdited,
      showExportModal,
      exportedCode,
      showNotification,
      notificationTitle,
      notificationMessage,
      notificationButtonText,
      notificationTimeout,
      onDragStart,
      onDrop,
      getComponentLabel,
      editField,
      saveField,
      closeFieldModal,
      deleteField,
      addOption,
      removeOption,
      addHeader,
      saveForm,
      exportFormCode,
      closeExportModal,
      copyCode
    }
  }
}
</script>
