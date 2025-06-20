import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import FormBuilder from '@/lib/components/FormBuilder.vue'
import { formBuilderStore } from '@/lib/store'

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
})