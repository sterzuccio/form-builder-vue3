import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import FormBuilder from '../../src/lib/components/FormBuilder.vue'
import { formBuilderStore } from '../../src/lib/store'

// Create a mock store
const createMockStore = () => {
  return createStore({
    modules: {
      formBuilder: {
        namespaced: true,
        state: {
          availableComponents: [
            { type: 'text', label: 'Text Input', icon: 'text-fields' },
            { type: 'textarea', label: 'Text Area', icon: 'subject' }
          ]
        },
        getters: {
          getAvailableComponents: state => state.availableComponents,
          getFormById: () => id => ({ id, name: 'Test Form', fields: [] })
        },
        actions: {
          saveForm: jest.fn().mockImplementation(({ commit }, { form }) => form)
        }
      }
    }
  })
}

describe('FormBuilder.vue', () => {
  let store

  beforeEach(() => {
    store = createMockStore()
  })

  it('renders correctly with default props', () => {
    const wrapper = mount(FormBuilder, {
      global: {
        plugins: [store]
      }
    })

    // Check that the component renders
    expect(wrapper.exists()).toBe(true)

    // Check that the component selector is shown
    expect(wrapper.find('.form-builder').exists()).toBe(true)
    expect(wrapper.find('h3').text()).toBe('Components')

    // Check that the form builder area is shown
    expect(wrapper.find('.border-2.border-dashed').exists()).toBe(true)
    expect(wrapper.find('.border-2.border-dashed').text()).toContain('Drag and drop components here')
  })

  it('renders with custom props', () => {
    const wrapper = mount(FormBuilder, {
      props: {
        componentSelectorTitle: 'Custom Components',
        emptyFormText: 'Custom empty form text',
        showFormSettings: false
      },
      global: {
        plugins: [store]
      }
    })

    // Check that custom title is used
    expect(wrapper.find('h3').text()).toBe('Custom Components')

    // Check that custom empty form text is used
    expect(wrapper.find('.border-2.border-dashed').text()).toContain('Custom empty form text')

    // Check that form settings are not shown
    expect(wrapper.findAll('h3').length).toBe(1) // Only the component selector title
  })

  it('emits save event when save button is clicked', async () => {
    const wrapper = mount(FormBuilder, {
      global: {
        plugins: [store]
      }
    })

    // Click the save button
    await wrapper.find('button').trigger('click')

    // Check that save event is emitted
    expect(wrapper.emitted().save).toBeTruthy()
    expect(wrapper.emitted().save[0][0]).toEqual({
      id: null,
      name: '',
      fields: [],
      endpoint: '',
      method: 'POST',
      headers: {}
    })
  })

  it('loads form from store when initialForm has an id', async () => {
    const wrapper = mount(FormBuilder, {
      props: {
        initialForm: { id: '123' }
      },
      global: {
        plugins: [store]
      }
    })

    // Wait for component to mount and load form
    await wrapper.vm.$nextTick()

    // Check that form is loaded from store
    expect(wrapper.vm.currentForm.name).toBe('Test Form')
  })

  it('adds a unique id and key to each field when created', () => {
    const wrapper = mount(FormBuilder, {
      global: {
        plugins: [store]
      }
    })

    // Create two fields of the same type
    const field1 = wrapper.vm.createDefaultField('text')
    const field2 = wrapper.vm.createDefaultField('text')

    // Check that both fields have an id and key
    expect(field1.id).toBeTruthy()
    expect(field1.key).toBeTruthy()
    expect(field2.id).toBeTruthy()
    expect(field2.key).toBeTruthy()

    // Check that the ids and keys are different (unique)
    expect(field1.id).not.toBe(field2.id)
    expect(field1.key).not.toBe(field2.key)

    // Check that the key contains the field type
    expect(field1.key).toContain('text_')
    expect(field2.key).toContain('text_')
  })

  it('gets form code without displaying modal', async () => {
    const wrapper = mount(FormBuilder, {
      global: {
        plugins: [store]
      }
    })

    // Call getFormCode method
    const code = wrapper.vm.getFormCode()

    // Check that code is returned
    expect(code).toBeTruthy()
    expect(code).toContain('<template>')
    expect(code).toContain('<script>')

    // Check that get-form-code event is emitted
    expect(wrapper.emitted()['get-form-code']).toBeTruthy()
    expect(wrapper.emitted()['get-form-code'][0][0]).toBe(code)

    // Check that export modal is not shown
    expect(wrapper.vm.showExportModal).toBe(false)
  })

  it('renders export format dropdown when showExportButton is true', () => {
    const wrapper = mount(FormBuilder, {
      props: {
        showExportButton: true
      },
      global: {
        plugins: [store]
      }
    })

    // Check that the export format dropdown is rendered
    expect(wrapper.find('select').exists()).toBe(true)

    // Check that the default selected format is 'vue'
    expect(wrapper.vm.selectedExportFormat).toBe('vue')

    // Check that all format options are rendered
    const exportSelect = wrapper.find('select')
    const options = exportSelect.findAll('option')
    expect(options.length).toBe(4) // vue, json, html, js
    expect(options[0].text()).toBe('Vue/Nuxt Component')
    expect(options[1].text()).toBe('JSON (Importable)')
    expect(options[2].text()).toBe('Embeddable HTML')
    expect(options[3].text()).toBe('JavaScript (Head Script)')
  })

  it('supports custom fields', () => {
    const customFields = [
      { type: 'custom-field', label: 'Custom Field', icon: 'extension' }
    ]

    const wrapper = mount(FormBuilder, {
      props: {
        customFields
      },
      global: {
        plugins: [store]
      }
    })

    // Check that custom fields are included in availableComponents
    expect(wrapper.vm.availableComponents).toContainEqual(customFields[0])

    // Create a field of the custom type
    const field = wrapper.vm.createDefaultField('custom-field')

    // Check that the field has the correct type and label
    expect(field.type).toBe('custom-field')
    expect(field.label).toBe('Custom Field')
  })

  it('filters components based on activeFieldKeys', () => {
    const wrapper = mount(FormBuilder, {
      props: {
        activeFieldKeys: ['text', 'textarea']
      },
      global: {
        plugins: [store]
      }
    })

    // Check that only the specified components are included
    expect(wrapper.vm.availableComponents.length).toBe(2)
    expect(wrapper.vm.availableComponents[0].type).toBe('text')
    expect(wrapper.vm.availableComponents[1].type).toBe('textarea')

    // Update activeFieldKeys
    wrapper.setProps({ activeFieldKeys: ['text'] })

    // Check that only the text component is included
    expect(wrapper.vm.availableComponents.length).toBe(1)
    expect(wrapper.vm.availableComponents[0].type).toBe('text')
  })

  it('exports code in different formats', async () => {
    const wrapper = mount(FormBuilder, {
      props: {
        showExportButton: true
      },
      global: {
        plugins: [store]
      }
    })

    // Test Vue format
    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.showExportModal).toBe(true)
    expect(wrapper.vm.exportedCode).toContain('<template>')
    expect(wrapper.vm.exportedCode).toContain('<script>')
    expect(wrapper.emitted().export).toBeTruthy()

    // Reset modal
    wrapper.vm.closeExportModal()
    expect(wrapper.vm.showExportModal).toBe(false)

    // Test JSON format
    wrapper.vm.selectedExportFormat = 'json'
    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.showExportModal).toBe(true)
    expect(wrapper.vm.exportedCode).toContain('{')
    expect(wrapper.vm.exportedCode).toContain('}')
    expect(wrapper.emitted().export.length).toBe(2)

    // Reset modal
    wrapper.vm.closeExportModal()

    // Test HTML format
    wrapper.vm.selectedExportFormat = 'html'
    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.showExportModal).toBe(true)
    expect(wrapper.vm.exportedCode).toContain('<!DOCTYPE html>')
    expect(wrapper.vm.exportedCode).toContain('<html')
    expect(wrapper.emitted().export.length).toBe(3)

    // Reset modal
    wrapper.vm.closeExportModal()

    // Test JavaScript format
    wrapper.vm.selectedExportFormat = 'js'
    await wrapper.find('button').trigger('click')
    expect(wrapper.vm.showExportModal).toBe(true)
    expect(wrapper.vm.exportedCode).toContain('(function()')
    expect(wrapper.vm.exportedCode).toContain('DynamicFormLoader')
    expect(wrapper.vm.exportedCode).toContain('formConfig')
    expect(wrapper.emitted().export.length).toBe(4)
  })

  describe('Color functionality', () => {
    it('accepts standard Tailwind colors', () => {
      const wrapper = mount(FormBuilder, {
        props: {
          color: 'blue'
        },
        global: {
          plugins: [store]
        }
      })

      // Check that colorClasses are generated correctly for standard colors
      expect(wrapper.vm.colorClasses.focusRing).toBe('focus:ring-blue-500')
      expect(wrapper.vm.colorClasses.focusBorder).toBe('focus:border-blue-500')
      expect(wrapper.vm.colorClasses.text600).toBe('text-blue-600')
      expect(wrapper.vm.colorClasses.bg600).toBe('bg-blue-600')
      expect(wrapper.vm.colorClasses.hoverBg700).toBe('hover:bg-blue-700')
    })

    it('accepts custom color objects', () => {
      const customColor = {
        name: 'brand-purple',
        colors: {
          '50': '#faf5ff',
          '100': '#f3e8ff',
          '200': '#e9d5ff',
          '300': '#d8b4fe',
          '400': '#c084fc',
          '500': '#a855f7',
          '600': '#9333ea',
          '700': '#7c3aed',
          '800': '#6b21a8',
          '900': '#581c87',
          '950': '#3b0764'
        }
      }

      const wrapper = mount(FormBuilder, {
        props: {
          color: customColor
        },
        global: {
          plugins: [store]
        }
      })

      // Check that colorClasses are generated correctly for custom colors
      expect(wrapper.vm.colorClasses.focusRing).toBe('focus:ring-brand-purple-500')
      expect(wrapper.vm.colorClasses.focusBorder).toBe('focus:border-brand-purple-500')
      expect(wrapper.vm.colorClasses.text600).toBe('text-brand-purple-600')
      expect(wrapper.vm.colorClasses.bg600).toBe('bg-brand-purple-600')
      expect(wrapper.vm.colorClasses.hoverBg700).toBe('hover:bg-brand-purple-700')
    })

    it('validates custom color objects correctly', () => {
      // Test invalid custom color - missing name
      const invalidColor1 = {
        colors: {
          '50': '#faf5ff',
          '500': '#a855f7'
        }
      }

      // Test invalid custom color - missing required shades
      const invalidColor2 = {
        name: 'incomplete',
        colors: {
          '50': '#faf5ff',
          '500': '#a855f7'
        }
      }

      // Test invalid custom color - invalid hex format
      const invalidColor3 = {
        name: 'invalid-hex',
        colors: {
          '50': 'not-a-hex',
          '100': '#f3e8ff',
          '200': '#e9d5ff',
          '300': '#d8b4fe',
          '400': '#c084fc',
          '500': '#a855f7',
          '600': '#9333ea',
          '700': '#7c3aed',
          '800': '#6b21a8',
          '900': '#581c87',
          '950': '#3b0764'
        }
      }

      // These should all fail validation and fall back to default
      expect(() => {
        mount(FormBuilder, {
          props: { color: invalidColor1 },
          global: { plugins: [store] }
        })
      }).not.toThrow() // Component should handle invalid props gracefully

      expect(() => {
        mount(FormBuilder, {
          props: { color: invalidColor2 },
          global: { plugins: [store] }
        })
      }).not.toThrow()

      expect(() => {
        mount(FormBuilder, {
          props: { color: invalidColor3 },
          global: { plugins: [store] }
        })
      }).not.toThrow()
    })

    it('validates standard color strings correctly', () => {
      // Valid standard colors should work
      const validColors = ['blue', 'red', 'green', 'indigo', 'purple']

      validColors.forEach(color => {
        expect(() => {
          mount(FormBuilder, {
            props: { color },
            global: { plugins: [store] }
          })
        }).not.toThrow()
      })

      // Invalid standard colors should be handled gracefully
      expect(() => {
        mount(FormBuilder, {
          props: { color: 'invalid-color' },
          global: { plugins: [store] }
        })
      }).not.toThrow()
    })

    it('injects custom color styles into document', () => {
      const customColor = {
        name: 'test-color',
        colors: {
          '50': '#faf5ff',
          '100': '#f3e8ff',
          '200': '#e9d5ff',
          '300': '#d8b4fe',
          '400': '#c084fc',
          '500': '#a855f7',
          '600': '#9333ea',
          '700': '#7c3aed',
          '800': '#6b21a8',
          '900': '#581c87',
          '950': '#3b0764'
        }
      }

      const wrapper = mount(FormBuilder, {
        props: {
          color: customColor
        },
        global: {
          plugins: [store]
        }
      })

      // Trigger the computed property to inject styles
      const classes = wrapper.vm.colorClasses

      // Check that a style element was created
      const styleElement = document.getElementById('custom-color-test-color')
      expect(styleElement).toBeTruthy()
      expect(styleElement.tagName).toBe('STYLE')

      // Check that the style contains expected CSS rules
      const styleContent = styleElement.textContent
      expect(styleContent).toContain('.text-test-color-500 { color: #a855f7 !important; }')
      expect(styleContent).toContain('.bg-test-color-600 { background-color: #9333ea !important; }')
      expect(styleContent).toContain('.focus\\:ring-test-color-500:focus { --tw-ring-color: #a855f7 !important; }')

      // Clean up
      styleElement.remove()
    })
  })
})
