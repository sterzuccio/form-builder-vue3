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
          :class="`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${colorClasses.bg600} ${colorClasses.hoverBg700} focus:outline-none ${colorClasses.ring} ${colorClasses.ringOffset} ${colorClasses.ringColor}`"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'

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
    },
    // Color customization
    color: {
      type: String,
      default: 'indigo',
      validator: (value) => {
        // Common Tailwind colors
        const validColors = [
          'slate', 'gray', 'zinc', 'neutral', 'stone',
          'red', 'orange', 'amber', 'yellow', 'lime', 'green',
          'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo',
          'violet', 'purple', 'fuchsia', 'pink', 'rose'
        ]
        return validColors.includes(value)
      }
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

    // Color computed properties
    const colorClasses = computed(() => {
      const color = props.color
      return {
        // Background colors
        bg600: `bg-${color}-600`,
        bg700: `bg-${color}-700`,

        // Hover background colors
        hoverBg700: `hover:bg-${color}-700`,

        // Ring colors for focus states
        ringOffset: `focus:ring-offset-2`,
        ring: `focus:ring-2`,
        ringColor: `focus:ring-${color}-500`
      }
    })

    return {
      show,
      close,
      colorClasses
    }
  }
}
</script>
