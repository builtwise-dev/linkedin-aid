import type { App, Plugin } from 'vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { apolloClient } from '@/graphql/client';

export const apolloPlugin: Plugin = {
  install(app: App) {
    app.provide(DefaultApolloClient, apolloClient);
  },
};
