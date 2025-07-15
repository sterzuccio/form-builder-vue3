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
      type: [String, Object],
      default: 'indigo',
      validator: (value) => {
        // If it's a string, validate against common Tailwind colors
        if (typeof value === 'string') {
          const validColors = [
            'slate', 'gray', 'zinc', 'neutral', 'stone',
            'red', 'orange', 'amber', 'yellow', 'lime', 'green',
            'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo',
            'violet', 'purple', 'fuchsia', 'pink', 'rose'
          ]
          return validColors.includes(value)
        }

        // If it's an object, validate it has the required structure for custom colors
        if (typeof value === 'object' && value !== null) {
          // Must have a name property
          if (!value.name || typeof value.name !== 'string') {
            return false
          }

          // Must have a colors property with the required shades
          if (!value.colors || typeof value.colors !== 'object') {
            return false
          }

          // Check that all required shades are present and are valid hex colors
          const requiredShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
          const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

          for (const shade of requiredShades) {
            if (!value.colors[shade] || !hexColorRegex.test(value.colors[shade])) {
              return false
            }
          }

          return true
        }

        return false
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

    // Function to inject custom color styles into the document
    const injectCustomColorStyles = (customColor) => {
      const styleId = `custom-color-${customColor.name}`

      // Remove existing style if it exists
      const existingStyle = document.getElementById(styleId)
      if (existingStyle) {
        existingStyle.remove()
      }

      // Create CSS rules for all shades and states
      const cssRules = []

      // Generate CSS for each shade
      Object.entries(customColor.colors).forEach(([shade, hexColor]) => {
        // Text colors
        cssRules.push(`.text-${customColor.name}-${shade} { color: ${hexColor} !important; }`)

        // Background colors
        cssRules.push(`.bg-${customColor.name}-${shade} { background-color: ${hexColor} !important; }`)

        // Border colors
        cssRules.push(`.border-${customColor.name}-${shade} { border-color: ${hexColor} !important; }`)

        // Focus states
        cssRules.push(`.focus\\:ring-${customColor.name}-${shade}:focus { --tw-ring-color: ${hexColor} !important; }`)
        cssRules.push(`.focus\\:border-${customColor.name}-${shade}:focus { border-color: ${hexColor} !important; }`)

        // Hover states
        cssRules.push(`.hover\\:bg-${customColor.name}-${shade}:hover { background-color: ${hexColor} !important; }`)
        cssRules.push(`.hover\\:text-${customColor.name}-${shade}:hover { color: ${hexColor} !important; }`)
      })

      // Create and inject the style element
      const styleElement = document.createElement('style')
      styleElement.id = styleId
      styleElement.textContent = cssRules.join('\n')
      document.head.appendChild(styleElement)
    }

    // Color computed properties
    const colorClasses = computed(() => {
      const color = props.color
      let colorName

      // Handle both string (standard colors) and object (custom colors)
      if (typeof color === 'string') {
        colorName = color
      } else if (typeof color === 'object' && color.name) {
        colorName = color.name
        // Inject custom color definitions into the document
        injectCustomColorStyles(color)
      }

      return {
        // Background colors
        bg600: `bg-${colorName}-600`,
        bg700: `bg-${colorName}-700`,

        // Hover background colors
        hoverBg700: `hover:bg-${colorName}-700`,

        // Ring colors for focus states
        ringOffset: `focus:ring-offset-2`,
        ring: `focus:ring-2`,
        ringColor: `focus:ring-${colorName}-500`
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
