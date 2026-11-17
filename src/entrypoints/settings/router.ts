import {
  createRouter,
  createWebHashHistory,
} from 'vue-router';

// Root pages
const SettingsGeneralPage = () => import('@/entrypoints/settings/pages/SettingsGeneralPage.vue');
const SettingsCapturedEntitiesPage = () => import('@/entrypoints/settings/pages/SettingsCapturedEntitiesPage.vue');
const SettingsSessionsPage = () => import('@/entrypoints/settings/pages/SettingsSessionsPage.vue');
const SettingsTitlesPage = () => import('@/entrypoints/settings/pages/SettingsTitlesPage.vue');
const SettingsCopyPage = () => import('@/entrypoints/settings/pages/SettingsCopyPage.vue');
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: SettingsGeneralPage },
    { path: '/captured-entities', component: SettingsCapturedEntitiesPage },
    { path: '/sessions', component: SettingsSessionsPage },
    { path: '/titles', component: SettingsTitlesPage },
    { path: '/copy', component: SettingsCopyPage },
  ],
});
