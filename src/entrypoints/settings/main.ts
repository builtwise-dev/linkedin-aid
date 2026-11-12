import { createApp } from 'vue';
import { apolloPlugin } from '@/plugins/apollo';
import { router } from './router';
import { vuetify } from '@/plugins/vuetify';
import App from './App.vue';

createApp(App)
  .use(apolloPlugin)
  .use(router)
  .use(vuetify)
  .mount('#app');
