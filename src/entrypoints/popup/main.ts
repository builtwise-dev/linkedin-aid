import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { apolloPlugin } from '@/plugins/apollo';
import './style.css';
import App from './App.vue';

createApp(App)
  .use(createPinia())
  .use(apolloPlugin)
  .mount('#app');
