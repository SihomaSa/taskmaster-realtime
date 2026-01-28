import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { DefaultApolloClient } from '@vue/apollo-composable'
import App from './App.vue'
import router from './router'
import { apolloClient } from './apollo'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.provide(DefaultApolloClient, apolloClient)
app.use(pinia)
app.use(router)

app.mount('#app')