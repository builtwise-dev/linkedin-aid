import { defineConfig } from 'wxt';
import { loadEnv } from 'vite';

const isDev = process.env.NODE_ENV === 'development';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  manifest:({ mode }) => {
    const env = loadEnv(mode, process.cwd(), 'WXT_');

    return {
      name: 'LinkedIn AID' + (isDev ? ' (dev)' : ''),
      description: 'LinkedIn SN data interceptor & assistant',
      permissions: ['scripting', 'storage', 'tabs', 'identity'],
      host_permissions: [
        '*://*.linkedin.com/*',
        'https://*.builtwise.dev/*',
      ],
      options_ui: {
        page: 'settings.html',
        open_in_tab: true,
      },
      oauth2: {
        client_id: env.WXT_APP_CLIENT_ID,
        scopes: [
          'openid',
          'email',
          'profile',
        ],
      },
    };
  },
  modules: ['@wxt-dev/module-vue'],
});
