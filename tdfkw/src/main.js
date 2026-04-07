import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import Nav from '@/components/NAV.vue'



const app = createApp(App)

app.component('AppNav', Nav)

app.use(createPinia())
app.use(router)

app.mount('#app')
