// Simplified version of the library for building
import { createStore } from 'vuex'
import { h } from 'vue'

// Create a plugin that installs the components and store
const FormBuilderPlugin = {
  install(app, options = {}) {
    // This is a simplified version of the library
    console.log('FormBuilderPlugin installed')
  }
}

// Export the plugin as default
export default FormBuilderPlugin

// Export simplified components
export const FormBuilder = {
  name: 'FormBuilder',
  render() {
    return h('div', 'Form Builder Placeholder')
  }
}

export const FormPreview = {
  name: 'FormPreview',
  render() {
    return h('div', 'Form Preview Placeholder')
  }
}

// Export simplified store
export const formBuilderStore = {
  namespaced: true,
  state: () => ({
    forms: []
  }),
  mutations: {},
  actions: {},
  getters: {}
}
