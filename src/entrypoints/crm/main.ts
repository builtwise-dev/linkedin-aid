import { createApp } from 'vue';
import { apolloPlugin } from '@/plugins/apollo';
import { vuetify } from '@/plugins/vuetify';
import { router } from './router';
import App from './App.vue';

createApp(App)
  .use(apolloPlugin)
  .use(router)
  .use(vuetify)
  .mount('#app');
