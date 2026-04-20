import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from '@/router'

import Nav from '@/components/NAV.vue'
import { useUserStore } from '@/stores/user'



const app = createApp(App)

app.component('AppNav', Nav)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// 初始化用户状态
const userStore = useUserStore()
userStore.loadUser()

app.mount('#app')
