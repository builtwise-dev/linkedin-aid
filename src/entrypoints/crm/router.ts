import { createRouter, createWebHashHistory } from 'vue-router';

const CrmHomePage = () => import('./pages/CrmHomePage.vue');
const CrmRecordsPage = () => import('./pages/CrmRecordsPage.vue');
const CrmActivityPage = () => import('./pages/CrmActivityPage.vue');
const CrmAiPage = () => import('./pages/CrmAiPage.vue');
const CrmSignalsPage = () => import('./pages/CrmSignalsPage.vue');
const CrmIntegrationsPage = () => import('./pages/CrmIntegrationsPage.vue');
const CrmWorkspacePage = () => import('./pages/CrmWorkspacePage.vue');
const CrmTasksPage = () => import('./pages/CrmTasksPage.vue');
const CrmSegmentsPage = () => import('./pages/CrmSegmentsPage.vue');

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'crm-home', component: CrmHomePage, meta: { title: 'Home' } },
    { path: '/records', redirect: '/leads' },
    { path: '/leads', name: 'crm-leads', component: CrmRecordsPage, props: { kind: 'leads' }, meta: { title: 'Leads' } },
    { path: '/accounts', name: 'crm-accounts', component: CrmRecordsPage, props: { kind: 'accounts' }, meta: { title: 'Accounts' } },
    { path: '/segments', name: 'crm-segments', component: CrmSegmentsPage, meta: { title: 'Segments' } },
    { path: '/tasks', name: 'crm-tasks', component: CrmTasksPage, meta: { title: 'Tasks' } },
    { path: '/calendar', name: 'crm-calendar', component: CrmWorkspacePage, props: { section: 'Calendar' }, meta: { title: 'Calendar' } },
    { path: '/messaging', name: 'crm-messaging', component: CrmWorkspacePage, props: { section: 'Messaging' }, meta: { title: 'Messaging' } },
    { path: '/sequences', name: 'crm-sequences', component: CrmWorkspacePage, props: { section: 'Sequences' }, meta: { title: 'Sequences' } },
    { path: '/workflows', name: 'crm-workflows', component: CrmWorkspacePage, props: { section: 'Workflows' }, meta: { title: 'Workflows' } },
    { path: '/actions', name: 'crm-actions', component: CrmWorkspacePage, props: { section: 'Actions' }, meta: { title: 'Actions' } },
    { path: '/deals', name: 'crm-deals', component: CrmWorkspacePage, props: { section: 'Deals' }, meta: { title: 'Deals' } },
    { path: '/activity', name: 'crm-activity', component: CrmActivityPage, meta: { title: 'Activity' } },
    { path: '/ai', name: 'crm-ai', component: CrmAiPage, meta: { title: 'AI' } },
    { path: '/signals', name: 'crm-signals', component: CrmSignalsPage, meta: { title: 'Signals' } },
    { path: '/integrations', name: 'crm-integrations', component: CrmIntegrationsPage, meta: { title: 'Integrations' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});
