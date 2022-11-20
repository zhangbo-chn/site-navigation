import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import { getImgSrc } from './assets/js/util'

const app = createApp(App)

app.config.globalProperties.$getImgSrc = getImgSrc

app.use(createPinia())
app.use(router)

app.mount('#app')
