import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/tailwind.css'
import FormBuilderPlugin from './lib'

createApp(App)
  .use(store)
  .use(router)
  .use(FormBuilderPlugin)
  .mount('#app')
