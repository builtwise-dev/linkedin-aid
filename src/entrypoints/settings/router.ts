import {
  createRouter,
  createWebHashHistory,
} from 'vue-router';

// Root pages
const SettingsGeneralPage = () => import('@/entrypoints/settings/pages/SettingsGeneralPage.vue');
const SettingsCapturedDataPage = () => import('@/entrypoints/settings/pages/captured-data/index.vue');
const CapturedDataPermanentPage = () => import('@/entrypoints/settings/pages/captured-data/CapturedDataPermanentPage.vue');
const CapturedDataSessionsPage = () => import('@/entrypoints/settings/pages/captured-data/CapturedDataSessionsPage.vue');
const SettingsTitlesPage = () => import('@/entrypoints/settings/pages/SettingsTitlesPage.vue');
const SettingsCopyPage = () => import('@/entrypoints/settings/pages/SettingsCopyPage.vue');

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: SettingsGeneralPage },
    {
      path: '/captured-data',
      redirect: '/captured-data/permanent',
      component: SettingsCapturedDataPage,
      children: [
        {
          path: 'permanent',
          component: CapturedDataPermanentPage,
        },
        {
          path: 'sessions',
          component: CapturedDataSessionsPage,
        },
      ],
    },
    { path: '/titles', component: SettingsTitlesPage },
    { path: '/copy', component: SettingsCopyPage },
  ],
});
