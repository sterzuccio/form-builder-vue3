import { createStore } from 'vuex'

export default createStore({
  state: {
    forms: [],
    currentForm: {
      id: null,
      name: '',
      fields: [],
      endpoint: '',
      method: 'POST',
      headers: {}
    },
    availableComponents: [
      { type: 'text', label: 'Text Input', icon: 'text-fields' },
      { type: 'textarea', label: 'Text Area', icon: 'subject' },
      { type: 'number', label: 'Number', icon: 'filter-9-plus' },
      { type: 'select', label: 'Select', icon: 'arrow-drop-down-circle' },
      { type: 'radio', label: 'Radio', icon: 'radio-button-checked' },
      { type: 'checkbox', label: 'Checkbox', icon: 'check-box' },
      { type: 'date', label: 'Date', icon: 'date-range' },
      { type: 'email', label: 'Email', icon: 'email' },
      { type: 'password', label: 'Password', icon: 'vpn-key' }
    ],
    selectedComponents: []
  },
  getters: {
    getForms: state => state.forms,
    getCurrentForm: state => state.currentForm,
    getAvailableComponents: state => state.availableComponents,
    getSelectedComponents: state => state.selectedComponents
  },
  mutations: {
    SET_FORMS(state, forms) {
      state.forms = forms
    },
    ADD_FORM(state, form) {
      state.forms.push(form)
    },
    UPDATE_FORM(state, form) {
      const index = state.forms.findIndex(f => f.id === form.id)
      if (index !== -1) {
        state.forms.splice(index, 1, form)
      }
    },
    DELETE_FORM(state, formId) {
      state.forms = state.forms.filter(form => form.id !== formId)
    },
    SET_CURRENT_FORM(state, form) {
      state.currentForm = form
    },
    ADD_FIELD(state, field) {
      state.currentForm.fields.push(field)
    },
    UPDATE_FIELD(state, { index, field }) {
      state.currentForm.fields.splice(index, 1, field)
    },
    DELETE_FIELD(state, index) {
      state.currentForm.fields.splice(index, 1)
    },
    REORDER_FIELDS(state, fields) {
      state.currentForm.fields = fields
    },
    UPDATE_FORM_SETTINGS(state, { endpoint, method, headers }) {
      state.currentForm.endpoint = endpoint || state.currentForm.endpoint
      state.currentForm.method = method || state.currentForm.method
      state.currentForm.headers = headers || state.currentForm.headers
    },
    SET_SELECTED_COMPONENTS(state, components) {
      state.selectedComponents = components
    }
  },
  actions: {
    loadForms({ commit }) {
      // In a real app, this would be an API call
      const savedForms = localStorage.getItem('forms')
      if (savedForms) {
        commit('SET_FORMS', JSON.parse(savedForms))
      }
    },
    saveForm({ commit, state }, form) {
      // In a real app, this would be an API call
      const formToSave = form || state.currentForm
      if (!formToSave.id) {
        formToSave.id = Date.now().toString()
        commit('ADD_FORM', formToSave)
      } else {
        commit('UPDATE_FORM', formToSave)
      }
      localStorage.setItem('forms', JSON.stringify(state.forms))
      return formToSave
    },
    deleteForm({ commit, state }, formId) {
      commit('DELETE_FORM', formId)
      localStorage.setItem('forms', JSON.stringify(state.forms))
    },
    setCurrentForm({ commit }, form) {
      commit('SET_CURRENT_FORM', form)
    },
    addField({ commit }, field) {
      commit('ADD_FIELD', field)
    },
    updateField({ commit }, payload) {
      commit('UPDATE_FIELD', payload)
    },
    deleteField({ commit }, index) {
      commit('DELETE_FIELD', index)
    },
    reorderFields({ commit }, fields) {
      commit('REORDER_FIELDS', fields)
    },
    updateFormSettings({ commit }, settings) {
      commit('UPDATE_FORM_SETTINGS', settings)
    },
    selectComponents({ commit }, components) {
      commit('SET_SELECTED_COMPONENTS', components)
    }
  },
  modules: {
  }
})