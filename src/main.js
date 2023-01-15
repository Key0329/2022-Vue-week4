import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

// import './style.css'
import './assets/all.scss'
import 'bootstrap/dist/js/bootstrap.js'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(VueAxios, axios)

app.mount('#app')
