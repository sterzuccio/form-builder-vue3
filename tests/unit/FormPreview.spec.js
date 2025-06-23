import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import FormPreview from '../../src/lib/components/FormPreview.vue'

// Create a mock store
const createMockStore = () => {
  return createStore({
    modules: {
      formBuilder: {
        namespaced: true,
        getters: {
          getFormById: () => id => ({
            id,
            name: 'Test Form',
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
              }
            ],
            endpoint: 'https://example.com/api',
            method: 'POST',
            headers: {}
          })
        }
      }
    }
  })
}

describe('FormPreview.vue', () => {
  let store

  beforeEach(() => {
    store = createMockStore()

    // Mock fetch API
    global.fetch = jest.fn().mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders correctly with provided form', () => {
    const form = {
      name: 'Test Form',
      fields: [
        {
          type: 'text',
          label: 'Name',
          placeholder: 'Enter your name',
          required: true
        }
      ]
    }

    const wrapper = mount(FormPreview, {
      props: {
        form
      },
      global: {
        plugins: [store]
      }
    })

    // Check that the component renders
    expect(wrapper.exists()).toBe(true)

    // Check that the form name is displayed
    expect(wrapper.find('h3').text()).toBe('Test Form')

    // Check that the field is rendered
    expect(wrapper.find('label').text()).toContain('Name')
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter your name')
    expect(wrapper.find('input').attributes('required')).toBe('')
  })

  it('loads form from store when formId is provided', async () => {
    const wrapper = mount(FormPreview, {
      props: {
        form: { fields: [] },
        formId: '123'
      },
      global: {
        plugins: [store]
      }
    })

    // Wait for component to mount and load form
    await wrapper.vm.$nextTick()

    // Check that the form is loaded from store
    expect(wrapper.find('h3').text()).toBe('Test Form')
    expect(wrapper.find('label').text()).toContain('Name')
  })

  it('validates form on submit', async () => {
    const form = {
      name: 'Test Form',
      fields: [
        {
          type: 'text',
          label: 'Name',
          required: true,
          validation: {
            min: 2
          }
        }
      ]
    }

    const wrapper = mount(FormPreview, {
      props: {
        form
      },
      global: {
        plugins: [store]
      }
    })

    // Submit the form without filling required field
    await wrapper.find('form').trigger('submit')

    // Check that validation error is emitted
    expect(wrapper.emitted()['validation-error']).toBeTruthy()

    // Check that error message is displayed
    expect(wrapper.find('.text-red-600').exists()).toBe(true)

    // Fill the field with invalid value (too short)
    await wrapper.find('input').setValue('a')
    await wrapper.find('form').trigger('submit')

    // Check that validation error is still emitted
    expect(wrapper.emitted()['validation-error'].length).toBe(2)

    // Fill the field with valid value
    await wrapper.find('input').setValue('John')
    await wrapper.find('form').trigger('submit')

    // Check that submit event is emitted
    expect(wrapper.emitted().submit).toBeTruthy()
    expect(wrapper.emitted().submit[0][0]).toEqual({ text_Name: 'John' })
  })

  it('submits form data to endpoint', async () => {
    const form = {
      name: 'Test Form',
      fields: [
        {
          type: 'text',
          label: 'Name',
          required: false
        }
      ],
      endpoint: 'https://example.com/api',
      method: 'POST',
      headers: { 'X-Custom-Header': 'test' }
    }

    const wrapper = mount(FormPreview, {
      props: {
        form
      },
      global: {
        plugins: [store]
      }
    })

    // Fill the field
    await wrapper.find('input').setValue('John')

    // Submit the form
    await wrapper.find('form').trigger('submit')

    // Check that fetch was called with correct arguments
    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/api',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-Custom-Header': 'test'
        }),
        body: JSON.stringify({ text_Name: 'John' })
      })
    )

    // Check that submit-success event is emitted
    expect(wrapper.emitted()['submit-success']).toBeTruthy()
  })

  it('shows custom text based on props', () => {
    const form = {
      name: '',
      fields: []
    }

    const wrapper = mount(FormPreview, {
      props: {
        form,
        untitledFormText: 'Custom Untitled',
        emptyFormText: 'Custom Empty Form',
        submitButtonText: 'Custom Submit'
      },
      global: {
        plugins: [store]
      }
    })

    // Check that custom texts are used
    expect(wrapper.find('h3').text()).toBe('Custom Untitled')
    expect(wrapper.find('.text-gray-500').text()).toBe('Custom Empty Form')
  })
})
