import { createApp } from 'vue';
import { apolloPlugin } from '@/plugins/apollo';
import './style.css';
import App from './App.vue';

createApp(App)
  .use(apolloPlugin)
  .mount('#app');
