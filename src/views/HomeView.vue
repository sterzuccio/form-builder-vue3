<template>
  <div class="home">
    <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">Your Forms</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Create, edit, and manage your forms</p>
        </div>
        <router-link 
          to="/builder" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="createNewForm"
        >
          Create New Form
        </router-link>
      </div>
      <div class="border-t border-gray-200">
        <div v-if="forms.length === 0" class="p-6 text-center text-gray-500">
          No forms created yet. Click "Create New Form" to get started.
        </div>
        <ul v-else class="divide-y divide-gray-200">
          <li v-for="form in forms" :key="form.id" class="px-4 py-4 sm:px-6 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-lg font-medium text-indigo-600">{{ form.name || 'Untitled Form' }}</h4>
                <p class="text-sm text-gray-500">{{ form.fields.length }} fields • {{ form.method }} {{ form.endpoint }}</p>
              </div>
              <div class="flex space-x-2">
                <router-link 
                  :to="`/builder?id=${form.id}`" 
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  @click="editForm(form)"
                >
                  Edit
                </router-link>
                <router-link 
                  :to="`/preview?id=${form.id}`" 
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Preview
                </router-link>
                <button 
                  @click="deleteForm(form.id)" 
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'HomeView',
  setup() {
    const store = useStore()
    const router = useRouter()

    onMounted(() => {
      store.dispatch('loadForms')
    })

    const forms = computed(() => store.getters.getForms)

    const createNewForm = () => {
      store.dispatch('setCurrentForm', {
        id: null,
        name: '',
        fields: [],
        endpoint: '',
        method: 'POST',
        headers: {}
      })
    }

    const editForm = (form) => {
      store.dispatch('setCurrentForm', { ...form })
    }

    const deleteForm = (formId) => {
      if (confirm('Are you sure you want to delete this form?')) {
        store.dispatch('deleteForm', formId)
      }
    }

    return {
      forms,
      createNewForm,
      editForm,
      deleteForm
    }
  }
}
</script>