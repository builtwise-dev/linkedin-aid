import { createRouter, createWebHashHistory } from 'vue-router';

const CrmHomePage = () => import('./pages/CrmHomePage.vue');
const CrmRecordsPage = () => import('./pages/CrmRecordsPage.vue');
const CrmActivityPage = () => import('./pages/CrmActivityPage.vue');
const CrmAiPage = () => import('./pages/CrmAiPage.vue');
const CrmSignalsPage = () => import('./pages/CrmSignalsPage.vue');
const CrmIntegrationsPage = () => import('./pages/CrmIntegrationsPage.vue');

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'crm-home', component: CrmHomePage, meta: { title: 'Overview' } },
    { path: '/records', name: 'crm-records', component: CrmRecordsPage, meta: { title: 'Leads & companies' } },
    { path: '/activity', name: 'crm-activity', component: CrmActivityPage, meta: { title: 'Activity' } },
    { path: '/ai', name: 'crm-ai', component: CrmAiPage, meta: { title: 'AI' } },
    { path: '/signals', name: 'crm-signals', component: CrmSignalsPage, meta: { title: 'Signals' } },
    { path: '/integrations', name: 'crm-integrations', component: CrmIntegrationsPage, meta: { title: 'Integrations' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});
