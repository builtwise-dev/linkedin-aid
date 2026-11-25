import { createRouter, createWebHashHistory } from 'vue-router';

const CrmHomePage = () => import('./pages/CrmHomePage.vue');
const CrmRecordsPage = () => import('./pages/CrmRecordsPage.vue');
const CrmActivityPage = () => import('./pages/CrmActivityPage.vue');
const CrmAiPage = () => import('./pages/CrmAiPage.vue');
const CrmActionsPage = () => import('./pages/CrmActionsPage.vue');
const CrmSignalsPage = () => import('./pages/CrmSignalsPage.vue');
const CrmIntegrationsPage = () => import('./pages/CrmIntegrationsPage.vue');
const CrmPluginsPage = () => import('./pages/CrmPluginsPage.vue');
const CrmPluginDetailPage = () => import('./pages/CrmPluginDetailPage.vue');
const CrmWorkspacePage = () => import('./pages/CrmWorkspacePage.vue');
const CrmTasksPage = () => import('./pages/CrmTasksPage.vue');
const CrmSegmentsPage = () => import('./pages/CrmSegmentsPage.vue');
const CrmDealsPage = () => import('./pages/CrmDealsPage.vue');

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'crm-home', component: CrmHomePage, meta: { title: 'Home' } },
    { path: '/people', name: 'crm-people', component: CrmRecordsPage, props: { kind: 'people' }, meta: { title: 'People' } },
    { path: '/companies', name: 'crm-companies', component: CrmRecordsPage, props: { kind: 'companies' }, meta: { title: 'Companies' } },
    { path: '/segments', name: 'crm-segments', component: CrmSegmentsPage, meta: { title: 'Segments' } },
    { path: '/tasks', name: 'crm-tasks', component: CrmTasksPage, meta: { title: 'Tasks' } },
    { path: '/calendar', name: 'crm-calendar', component: CrmWorkspacePage, props: { section: 'Calendar' }, meta: { title: 'Calendar' } },
    { path: '/messaging', name: 'crm-messaging', component: CrmWorkspacePage, props: { section: 'Messaging' }, meta: { title: 'Messaging' } },
    { path: '/sequences', name: 'crm-sequences', component: CrmWorkspacePage, props: { section: 'Sequences' }, meta: { title: 'Sequences' } },
    { path: '/workflows', name: 'crm-workflows', component: CrmWorkspacePage, props: { section: 'Workflows' }, meta: { title: 'Workflows' } },
    { path: '/actions', name: 'crm-actions', component: CrmActionsPage, meta: { title: 'Actions' } },
    { path: '/actions/signals', name: 'crm-action-signals', component: CrmSignalsPage, meta: { title: 'Signals' } },
    { path: '/deals', name: 'crm-deals', component: CrmDealsPage, meta: { title: 'Deals' } },
    { path: '/activity', name: 'crm-activity', component: CrmActivityPage, meta: { title: 'Activity' } },
    { path: '/ai', name: 'crm-ai', component: CrmAiPage, meta: { title: 'AI' } },
    { path: '/integrations', name: 'crm-integrations', component: CrmIntegrationsPage, meta: { title: 'Integrations' } },
    { path: '/plugins', name: 'crm-plugins', component: CrmPluginsPage, meta: { title: 'Plugins' } },
    { path: '/plugins/:id', name: 'crm-plugin-detail', component: CrmPluginDetailPage, props: true, meta: { title: 'Plugin' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});
