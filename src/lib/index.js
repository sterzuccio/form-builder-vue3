// Main entry point for the form-builder-vue3 library
import { createStore } from 'vuex'
import FormBuilder from './components/FormBuilder.vue'
import FormPreview from './components/FormPreview.vue'
import { formBuilderStore } from './store'

// Create a plugin that installs the components and store
const FormBuilderPlugin = {
  install(app, options = {}) {
    // Register components
    app.component('FormBuilder', FormBuilder)
    app.component('FormPreview', FormPreview)

    // Setup store if Vuex is available and not disabled
    if (!options.disableStore) {
      try {
        if (app.config.globalProperties.$store) {
          // Register the form builder module in the existing store
          app.config.globalProperties.$store.registerModule(
            options.storeModuleName || 'formBuilder', 
            formBuilderStore
          )
        } else {
          // Create a new store instance
          const store = createStore({
            modules: {
              formBuilder: formBuilderStore
            }
          })
          app.use(store)
        }
      } catch (error) {
        console.warn('Error setting up form builder store:', error)
        // Continue without store
      }
    }
  }
}

// Export components individually for à la carte usage
export { FormBuilder, FormPreview, formBuilderStore }

// Export the plugin as default
export default FormBuilderPlugin
