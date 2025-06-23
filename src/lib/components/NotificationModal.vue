<template>
  <div v-if="show" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">{{ title }}</h3>
      
      <div class="mb-6">
        <p class="text-gray-700">{{ message }}</p>
      </div>
      
      <div class="flex justify-end">
        <button 
          @click="close" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'NotificationModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Notification'
    },
    message: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      default: 'OK'
    },
    timeout: {
      type: Number,
      default: 0 // 0 means no auto-close
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const show = ref(props.modelValue)
    
    watch(() => props.modelValue, (newValue) => {
      show.value = newValue
      
      // Auto-close after timeout if specified
      if (newValue && props.timeout > 0) {
        setTimeout(() => {
          close()
        }, props.timeout)
      }
    })
    
    const close = () => {
      show.value = false
      emit('update:modelValue', false)
    }
    
    return {
      show,
      close
    }
  }
}
</script>