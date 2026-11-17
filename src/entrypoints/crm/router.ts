import { createRouter, createWebHashHistory } from 'vue-router';

const CrmHomePage = () => import('./pages/CrmHomePage.vue');
const CrmRecordsPage = () => import('./pages/CrmRecordsPage.vue');
const CrmActivityPage = () => import('./pages/CrmActivityPage.vue');

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'crm-home', component: CrmHomePage, meta: { title: 'Overview' } },
    { path: '/records', name: 'crm-records', component: CrmRecordsPage, meta: { title: 'Leads & companies' } },
    { path: '/activity', name: 'crm-activity', component: CrmActivityPage, meta: { title: 'Activity' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});
