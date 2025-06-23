<template>
  <div class="form-builder">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Left Sidebar - Component Selection -->
      <div v-if="showComponentSelector" class="md:col-span-1 bg-white shadow rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">{{ componentSelectorTitle }}</h3>
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
      <div :class="mainContentClass">
        <div class="flex justify-between items-center mb-4">
          <div v-if="showFormName">
            <label :for="formNameId" class="block text-sm font-medium text-gray-700">{{ formNameLabel }}</label>
            <input 
              type="text" 
              :id="formNameId" 
              v-model="currentForm.name" 
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :placeholder="formNamePlaceholder"
            >
          </div>
          <div class="flex space-x-2">
            <slot name="form-actions">
              <button 
                v-if="showSaveButton"
                @click="saveForm" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {{ saveButtonText }}
              </button>
              <div v-if="showExportButton" class="flex space-x-2">
                <select 
                  v-model="selectedExportFormat"
                  class="block border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option v-for="format in exportFormats" :key="format.value" :value="format.value">
                    {{ format.label }}
                  </option>
                </select>
                <button 
                  @click="exportFormCode" 
                  class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {{ exportButtonText }}
                </button>
              </div>
            </slot>
          </div>
        </div>

        <!-- Form Builder Area -->
        <div 
          class="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[400px]"
          @dragover.prevent
          @drop="onDrop"
        >
          <div v-if="currentForm.fields.length === 0" class="text-center text-gray-500 py-8">
            {{ emptyFormText }}
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
                        {{ editButtonText }}
                      </button>
                      <button 
                        @click="deleteField(index)" 
                        class="text-red-500 hover:text-red-700"
                      >
                        {{ deleteButtonText }}
                      </button>
                    </div>
                  </div>
                  <div class="text-sm text-gray-500">
                    <div v-if="field.key">Key: {{ field.key }}</div>
                    <div v-if="field.label">Label: {{ field.label }}</div>
                    <div v-if="field.placeholder">Placeholder: {{ field.placeholder }}</div>
                    <div>Required: {{ field.required ? 'Yes' : 'No' }}</div>
                    <div>Width: {{ field.width === 'half' ? fieldWidthHalfText : fieldWidthFullText }}</div>
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
      <div v-if="showFormSettings" class="md:col-span-1 bg-white shadow rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">{{ formSettingsTitle }}</h3>

        <div class="space-y-4">
          <div>
            <label for="endpoint" class="block text-sm font-medium text-gray-700">{{ endpointLabel }}</label>
            <input 
              type="text" 
              id="endpoint" 
              v-model="currentForm.endpoint" 
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :placeholder="endpointPlaceholder"
            >
          </div>

          <div>
            <label for="method" class="block text-sm font-medium text-gray-700">{{ methodLabel }}</label>
            <select 
              id="method" 
              v-model="currentForm.method" 
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option v-for="method in httpMethods" :key="method" :value="method">{{ method }}</option>
            </select>
          </div>

          <div v-if="showHeaders">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ headersLabel }}</label>
            <div v-for="(value, key) in headers" :key="key" class="flex mb-2">
              <input 
                type="text" 
                v-model="headerKeys[key]" 
                class="w-1/3 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :placeholder="headerKeyPlaceholder"
              >
              <input 
                type="text" 
                v-model="headers[key]" 
                class="w-2/3 border border-gray-300 rounded-r-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :placeholder="headerValuePlaceholder"
              >
            </div>
            <button 
              @click="addHeader" 
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {{ addHeaderButtonText }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Field Edit Modal -->
    <div v-if="showFieldModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">{{ editModalTitle }} {{ getComponentLabel(editingField.type) }}</h3>

        <div class="space-y-4">
          <div>
            <label for="field-label" class="block text-sm font-medium text-gray-700">{{ fieldLabelText }}</label>
            <input 
              type="text" 
              id="field-label" 
              v-model="editingField.label" 
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
          </div>

          <div style="display: block !important;">
            <label for="field-key" class="block text-sm font-medium text-gray-700">{{ fieldKeyText }}</label>
            <input 
              type="text" 
              id="field-key" 
              v-model="editingField.key" 
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :class="{ 'border-red-500': fieldErrors.key }"
              @input="keyManuallyEdited = true"
              data-testid="field-key-input"
            >
            <p v-if="fieldErrors.key" class="mt-1 text-sm text-red-600">{{ fieldErrors.key }}</p>
          </div>

          <div>
            <label for="field-placeholder" class="block text-sm font-medium text-gray-700">{{ fieldPlaceholderText }}</label>
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
            <label for="field-required" class="ml-2 block text-sm text-gray-900">{{ fieldRequiredText }}</label>
          </div>

          <!-- Field Width Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ fieldWidthText }}</label>
            <div class="flex space-x-4">
              <div class="flex items-center">
                <input 
                  type="radio" 
                  id="field-width-full" 
                  v-model="editingField.width" 
                  value="full" 
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                >
                <label for="field-width-full" class="ml-2 block text-sm text-gray-900">{{ fieldWidthFullText }}</label>
              </div>
              <div class="flex items-center">
                <input 
                  type="radio" 
                  id="field-width-half" 
                  v-model="editingField.width" 
                  value="half" 
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                >
                <label for="field-width-half" class="ml-2 block text-sm text-gray-900">{{ fieldWidthHalfText }}</label>
              </div>
            </div>
          </div>

          <!-- Validation Options -->
          <div v-if="['text', 'textarea', 'number', 'email', 'password'].includes(editingField.type)">
            <h4 class="text-sm font-medium text-gray-700 mb-2">{{ validationTitle }}</h4>

            <div v-if="['text', 'textarea', 'password'].includes(editingField.type)" class="grid grid-cols-2 gap-4">
              <div>
                <label for="field-min" class="block text-sm font-medium text-gray-700">{{ minLengthText }}</label>
                <input 
                  type="number" 
                  id="field-min" 
                  v-model="editingField.validation.min" 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
              </div>
              <div>
                <label for="field-max" class="block text-sm font-medium text-gray-700">{{ maxLengthText }}</label>
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
                <label for="field-min" class="block text-sm font-medium text-gray-700">{{ minValueText }}</label>
                <input 
                  type="number" 
                  id="field-min" 
                  v-model="editingField.validation.min" 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
              </div>
              <div>
                <label for="field-max" class="block text-sm font-medium text-gray-700">{{ maxValueText }}</label>
                <input 
                  type="number" 
                  id="field-max" 
                  v-model="editingField.validation.max" 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
              </div>
            </div>

            <div v-if="['text', 'email', 'password'].includes(editingField.type)">
              <label for="field-pattern" class="block text-sm font-medium text-gray-700 mt-4">{{ patternText }}</label>
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
            <h4 class="text-sm font-medium text-gray-700 mb-2">{{ optionsTitle }}</h4>

            <div v-for="(option, optionIndex) in editingField.options" :key="optionIndex" class="flex mb-2">
              <input 
                type="text" 
                v-model="option.value" 
                class="w-1/3 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :placeholder="optionValuePlaceholder"
              >
              <input 
                type="text" 
                v-model="option.label" 
                class="w-2/3 border border-gray-300 rounded-r-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :placeholder="optionLabelPlaceholder"
              >
              <button 
                @click="removeOption(optionIndex)" 
                class="ml-2 text-red-500 hover:text-red-700"
              >
                {{ removeOptionText }}
              </button>
            </div>

            <button 
              @click="addOption" 
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {{ addOptionText }}
            </button>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="closeFieldModal" 
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ cancelButtonText }}
          </button>
          <button 
            @click="saveField" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ saveButtonText }}
          </button>
        </div>
      </div>
    </div>

    <!-- Code Export Modal -->
    <div v-if="showExportModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">{{ exportModalTitle }}</h3>

        <div class="mb-4">
          <pre class="bg-gray-100 p-4 rounded-md overflow-auto max-h-96"><code>{{ exportedCode }}</code></pre>
        </div>

        <div class="flex justify-end">
          <button 
            @click="copyCode" 
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
          >
            {{ copyButtonText }}
          </button>
          <button 
            @click="closeExportModal" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ closeButtonText }}
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
/* eslint-disable no-useless-escape */
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import NotificationModal from "@/lib/components/NotificationModal.vue";

export default {
  name: 'FormBuilder',
  components: {NotificationModal},
  props: {
    // Form data
    initialForm: {
      type: Object,
      default: () => ({
        id: null,
        name: '',
        fields: [],
        endpoint: '',
        method: 'POST',
        headers: {}
      })
    },
    // Component configuration
    components: {
      type: Array,
      default: () => []
    },
    customFields: {
      type: Array,
      default: () => []
    },
    activeFieldKeys: {
      type: Array,
      default: () => []
    },
    // UI configuration
    showComponentSelector: {
      type: Boolean,
      default: true
    },
    showFormSettings: {
      type: Boolean,
      default: true
    },
    showFormName: {
      type: Boolean,
      default: true
    },
    showSaveButton: {
      type: Boolean,
      default: true
    },
    showExportButton: {
      type: Boolean,
      default: true
    },
    showHeaders: {
      type: Boolean,
      default: true
    },
    // Text customization
    componentSelectorTitle: {
      type: String,
      default: 'Components'
    },
    formSettingsTitle: {
      type: String,
      default: 'Form Settings'
    },
    exportFormatsTitle: {
      type: String,
      default: 'Export Format'
    },
    formNameLabel: {
      type: String,
      default: 'Form Name'
    },
    formNamePlaceholder: {
      type: String,
      default: 'Enter form name'
    },
    saveButtonText: {
      type: String,
      default: 'Save Form'
    },
    exportButtonText: {
      type: String,
      default: 'Export Code'
    },
    editButtonText: {
      type: String,
      default: 'Edit'
    },
    deleteButtonText: {
      type: String,
      default: 'Delete'
    },
    emptyFormText: {
      type: String,
      default: 'Drag and drop components here to build your form'
    },
    endpointLabel: {
      type: String,
      default: 'Endpoint'
    },
    endpointPlaceholder: {
      type: String,
      default: 'https://api.example.com/submit'
    },
    methodLabel: {
      type: String,
      default: 'HTTP Method'
    },
    headersLabel: {
      type: String,
      default: 'Headers'
    },
    headerKeyPlaceholder: {
      type: String,
      default: 'Key'
    },
    headerValuePlaceholder: {
      type: String,
      default: 'Value'
    },
    addHeaderButtonText: {
      type: String,
      default: 'Add Header'
    },
    editModalTitle: {
      type: String,
      default: 'Edit'
    },
    fieldLabelText: {
      type: String,
      default: 'Label'
    },
    fieldKeyText: {
      type: String,
      default: 'Key'
    },
    fieldPlaceholderText: {
      type: String,
      default: 'Placeholder'
    },
    fieldRequiredText: {
      type: String,
      default: 'Required'
    },
    fieldWidthText: {
      type: String,
      default: 'Field Width'
    },
    fieldWidthFullText: {
      type: String,
      default: 'Full Width'
    },
    fieldWidthHalfText: {
      type: String,
      default: 'Half Width'
    },
    validationTitle: {
      type: String,
      default: 'Validation'
    },
    minLengthText: {
      type: String,
      default: 'Min Length'
    },
    maxLengthText: {
      type: String,
      default: 'Max Length'
    },
    minValueText: {
      type: String,
      default: 'Min Value'
    },
    maxValueText: {
      type: String,
      default: 'Max Value'
    },
    patternText: {
      type: String,
      default: 'Pattern (Regex)'
    },
    optionsTitle: {
      type: String,
      default: 'Options'
    },
    optionValuePlaceholder: {
      type: String,
      default: 'Value'
    },
    optionLabelPlaceholder: {
      type: String,
      default: 'Label'
    },
    removeOptionText: {
      type: String,
      default: 'Remove'
    },
    addOptionText: {
      type: String,
      default: 'Add Option'
    },
    cancelButtonText: {
      type: String,
      default: 'Cancel'
    },
    exportModalTitle: {
      type: String,
      default: 'Export Form Code'
    },
    copyButtonText: {
      type: String,
      default: 'Copy to Clipboard'
    },
    closeButtonText: {
      type: String,
      default: 'Close'
    },
    // Other configuration
    httpMethods: {
      type: Array,
      default: () => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    },
    exportFormats: {
      type: Array,
      default: () => [
        { value: 'vue', label: 'Vue/Nuxt Component' },
        { value: 'json', label: 'JSON (Importable)' },
        { value: 'html', label: 'Embeddable HTML' }
      ]
    },
    storeModuleName: {
      type: String,
      default: 'formBuilder'
    },
    formNameId: {
      type: String,
      default: 'form-name'
    }
  },
  emits: [
    'save',
    'export',
    'field-added',
    'field-updated',
    'field-deleted',
    'form-updated',
    'get-form-code'
  ],
  setup(props, { emit }) {
    let store
    try {
      store = useStore()
    } catch (error) {
      console.warn('Vuex store not available:', error)
      // Continue without store
    }

    // Computed properties for store access with namespace
    const getStoreGetter = (getter) => {
      try {
        if (store && store.getters && store.getters[`${props.storeModuleName}/${getter}`] !== undefined) {
          return store.getters[`${props.storeModuleName}/${getter}`]
        }
        return null
      } catch (error) {
        console.warn(`Error accessing store getter ${getter}:`, error)
        return null
      }
    }

    const dispatchStoreAction = (action, payload) => {
      try {
        if (store && store.dispatch) {
          return store.dispatch(`${props.storeModuleName}/${action}`, payload)
        }
        return Promise.resolve()
      } catch (error) {
        console.warn(`Error dispatching store action ${action}:`, error)
        return Promise.resolve()
      }
    }

    // Form data
    const currentForm = ref({ ...props.initialForm })

    // Watch for changes to initialForm prop
    watch(() => props.initialForm, (newForm) => {
      currentForm.value = { ...newForm }
    })

    // Available components
    const availableComponents = computed(() => {
      let components = []

      if (props.components && props.components.length > 0) {
        components = [...props.components]
      } else {
        const storeComponents = getStoreGetter('getAvailableComponents')
        if (storeComponents) {
          components = [...storeComponents]
        } else {
          // Default components if store is not available
          components = [
            { type: 'text', label: 'Text Input', icon: 'text-fields' },
            { type: 'textarea', label: 'Text Area', icon: 'subject' },
            { type: 'number', label: 'Number', icon: 'filter-9-plus' },
            { type: 'select', label: 'Select', icon: 'arrow-drop-down-circle' },
            { type: 'radio', label: 'Radio', icon: 'radio-button-checked' },
            { type: 'checkbox', label: 'Checkbox', icon: 'check-box' },
            { type: 'date', label: 'Date', icon: 'date-range' },
            { type: 'email', label: 'Email', icon: 'email' },
            { type: 'password', label: 'Password', icon: 'vpn-key' }
          ]
        }
      }

      // Add custom fields
      if (props.customFields && props.customFields.length > 0) {
        components = [...components, ...props.customFields]
      }

      // Filter components based on activeFieldKeys if provided
      if (props.activeFieldKeys && props.activeFieldKeys.length > 0) {
        components = components.filter(component => 
          props.activeFieldKeys.includes(component.type)
        )
      }

      return components
    })

    // Computed class for main content based on sidebar visibility
    const mainContentClass = computed(() => {
      if (!props.showComponentSelector && !props.showFormSettings) {
        return 'md:col-span-4 bg-white shadow rounded-lg p-4'
      } else if (!props.showComponentSelector || !props.showFormSettings) {
        return 'md:col-span-3 bg-white shadow rounded-lg p-4'
      } else {
        return 'md:col-span-2 bg-white shadow rounded-lg p-4'
      }
    })

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
    const selectedExportFormat = ref('vue')

    // Notification modal
    const showNotification = ref(false)
    const notificationTitle = ref('Notification')
    const notificationMessage = ref('')
    const notificationButtonText = ref('OK')
    const notificationTimeout = ref(3000) // Auto-close after 3 seconds

    onMounted(() => {
      // Initialize headers
      Object.keys(currentForm.value.headers || {}).forEach(key => {
        headerKeys.value[key] = key
      })

      // If initialForm has an id, load it from store
      if (props.initialForm.id) {
        const getFormById = getStoreGetter('getFormById')
        if (getFormById && typeof getFormById === 'function') {
          const form = getFormById(props.initialForm.id)
          if (form) {
            currentForm.value = { ...form }
          }
        }
      }
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
      currentForm.value.fields.push(newField)
      emit('field-added', newField)
      emit('form-updated', currentForm.value)
    }

    const createDefaultField = (type) => {
      const componentLabel = getComponentLabel(type)
      // Generate key from label: convert to lowercase and remove spaces
      const generatedKey = componentLabel.toLowerCase().replace(/\s+/g, '')

      const field = {
        id: uuidv4(),
        key: generatedKey, // Key based on the field's label
        type,
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

      // Reset the key manually edited flag
      keyManuallyEdited.value = false

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
      currentForm.value.fields.splice(editingFieldIndex.value, 1, editingField.value)
      emit('field-updated', { index: editingFieldIndex.value, field: editingField.value })
      emit('form-updated', currentForm.value)
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
        currentForm.value.fields.splice(index, 1)
        emit('field-deleted', index)
        emit('form-updated', currentForm.value)
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

      currentForm.value.headers = formattedHeaders

      // Save to store if available
      try {
        dispatchStoreAction('saveForm', { form: currentForm.value })
      } catch (e) {
        console.warn('Store not available or error saving form:', e)
      }

      // Emit save event
      emit('save', currentForm.value)
    }

    // Generate form code
    const generateFormCode = () => {
      // Generate Vue component code for the form
      const formFields = currentForm.value.fields.map(field => {
        return generateFieldCode(field)
      }).join('\n      ')

      const validationRules = currentForm.value.fields.reduce((rules, field) => {
        if (field.required || field.validation) {
          rules[field.key || field.name || field.type + field.label.replace(/\s+/g, '')] = generateValidationRules(field)
        }
        return rules
      }, {})

      // Use string concatenation to avoid Vue parsing the template tags
      return '<template>\n' +
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
          const fieldName = field.key || field.name || field.type + field.label.replace(/\s+/g, '')
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
  '</' + 'script>'
    }

    // Get form code without displaying modal
    const getFormCode = () => {
      const code = generateFormCode()
      emit('get-form-code', code)
      return code
    }

    // Export form code
    const exportFormCode = () => {
      switch (selectedExportFormat.value) {
        case 'vue':
          exportedCode.value = generateFormCode()
          break
        case 'json':
          exportedCode.value = generateJsonCode()
          break
        case 'html':
          exportedCode.value = generateHtmlCode()
          break
        default:
          exportedCode.value = generateFormCode()
      }
      showExportModal.value = true
      emit('export', exportedCode.value)
    }

    // Generate JSON code for the form
    const generateJsonCode = () => {
      return JSON.stringify(currentForm.value, null, 2)
    }

    // Generate embeddable HTML code for the form
    const generateHtmlCode = () => {
      const formFields = currentForm.value.fields.map(field => {
        return generateHtmlFieldCode(field)
      }).join('\n      ')

      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentForm.value.name || 'Generated Form'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 1rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group-half {
      width: 48%;
      display: inline-block;
      vertical-align: top;
      margin-right: 2%;
    }
    .form-group-full {
      width: 100%;
      clear: both;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    input, select, textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
    }
    input[type="checkbox"], input[type="radio"] {
      width: auto;
      margin-right: 0.5rem;
    }
    .checkbox-label, .radio-label {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    button {
      background-color: #4f46e5;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
    }
    button:hover {
      background-color: #4338ca;
    }
    .error {
      color: #dc2626;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  </style>
</head>
<body>
  <form id="generatedForm" action="${currentForm.value.endpoint || ''}" method="${currentForm.value.method || 'POST'}">
    <h2>${currentForm.value.name || 'Generated Form'}</h2>

    ${formFields}

    <div class="form-group">
      <button type="submit">Submit</button>
    </div>
  </form>

  <script>
    document.getElementById('generatedForm').addEventListener('submit', function(e) {
      e.preventDefault();

      // Basic validation
      let isValid = true;
      const form = this;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(function(field) {
        const errorElement = document.getElementById(field.id + '-error');
        if (!field.value) {
          isValid = false;
          if (errorElement) {
            errorElement.textContent = 'This field is required';
          }
        } else if (errorElement) {
          errorElement.textContent = '';
        }
      });

      if (isValid) {
        // You can add AJAX submission here if needed
        form.submit();
      }
    });
  <\/script>
<\/body>
<\/html>`
    }

    // Generate HTML field code
    const generateHtmlFieldCode = (field) => {
      const fieldName = field.key || field.name || field.type + field.label.replace(/\s+/g, '')
      const requiredAttr = field.required ? ' required' : ''
      const errorDiv = `<div id="${fieldName}-error" class="error"></div>`
      const widthClass = field.width === 'half' ? 'form-group-half' : 'form-group-full'

      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
        case 'date':
          return `<div class="form-group ${widthClass}">
      <label for="${fieldName}">${field.label}${field.required ? ' *' : ''}</label>
      <input 
        type="${field.type}" 
        id="${fieldName}" 
        name="${fieldName}"
        placeholder="${field.placeholder || ''}"${requiredAttr}
      >
      ${errorDiv}
    </div>`

        case 'textarea':
          return `<div class="form-group ${widthClass}">
      <label for="${fieldName}">${field.label}${field.required ? ' *' : ''}</label>
      <textarea 
        id="${fieldName}" 
        name="${fieldName}"
        placeholder="${field.placeholder || ''}"${requiredAttr}
      ></textarea>
      ${errorDiv}
    </div>`

        case 'select':
          return `<div class="form-group ${widthClass}">
      <label for="${fieldName}">${field.label}${field.required ? ' *' : ''}</label>
      <select 
        id="${fieldName}" 
        name="${fieldName}"${requiredAttr}
      >
        <option value="" disabled selected>Select an option</option>
        ${field.options.map(option => `<option value="${option.value}">${option.label}</option>`).join('\n        ')}
      </select>
      ${errorDiv}
    </div>`

        case 'radio':
          return `<div class="form-group ${widthClass}">
      <label>${field.label}${field.required ? ' *' : ''}</label>
      ${field.options.map((option, index) => `
      <div class="radio-label">
        <input 
          type="radio" 
          id="${fieldName}_${index}" 
          name="${fieldName}" 
          value="${option.value}"${index === 0 && field.required ? requiredAttr : ''}
        >
        <label for="${fieldName}_${index}">${option.label}</label>
      </div>`).join('')}
      ${errorDiv}
    </div>`

        case 'checkbox':
          if (field.options && field.options.length > 1) {
            return `<div class="form-group ${widthClass}">
      <label>${field.label}${field.required ? ' *' : ''}</label>
      ${field.options.map((option, index) => `
      <div class="checkbox-label">
        <input 
          type="checkbox" 
          id="${fieldName}_${index}" 
          name="${fieldName}[]" 
          value="${option.value}"
        >
        <label for="${fieldName}_${index}">${option.label}</label>
      </div>`).join('')}
      ${errorDiv}
    </div>`
          } else {
            return `<div class="form-group checkbox-label ${widthClass}">
      <input 
        type="checkbox" 
        id="${fieldName}" 
        name="${fieldName}"${requiredAttr}
      >
      <label for="${fieldName}">${field.label}${field.required ? ' *' : ''}</label>
      ${errorDiv}
    </div>`
          }

        default:
          return `<div class="form-group ${widthClass}">
      <label for="${fieldName}">${field.label}${field.required ? ' *' : ''}</label>
      <input 
        type="text" 
        id="${fieldName}" 
        name="${fieldName}"
        placeholder="${field.placeholder || ''}"${requiredAttr}
      >
      ${errorDiv}
    </div>`
      }
    }

    const generateFieldCode = (field) => {
      const fieldName = field.key || field.name || field.type + field.label.replace(/\s+/g, '')
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
          // Check if it's a multi-checkbox (with options) or a single checkbox
          if (field && field.options && field.options.length > 1) {
            return '[]'
          } else {
            return 'false'
          }
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
      mainContentClass,
      headers,
      headerKeys,
      showFieldModal,
      editingField,
      showExportModal,
      exportedCode,
      selectedExportFormat,
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
      getFormCode,
      closeExportModal,
      copyCode
    }
  }
}
</script>
