<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useHotkey } from 'vuetify';
import { VCommandPalette } from 'vuetify/labs/VCommandPalette';
import { useCrmCompanies, useCrmPeople } from '@/composables/useCrmData';

const router = useRouter();
const open = ref(false);
const search = ref('');
const { records: people } = useCrmPeople();
const { records: companies } = useCrmCompanies();

const pages = [
  { title: 'Home', subtitle: 'CRM overview', prependIcon: 'mdi-home-outline', to: '/' },
  { title: 'People', subtitle: 'Browse saved people', prependIcon: 'mdi-account-multiple-outline', to: '/people' },
  { title: 'Companies', subtitle: 'Browse saved companies', prependIcon: 'mdi-domain', to: '/companies' },
  { title: 'Tasks', subtitle: 'Follow-ups and reminders', prependIcon: 'mdi-check-circle-outline', to: '/tasks' },
  { title: 'Calendar', subtitle: 'Workspace calendar', prependIcon: 'mdi-calendar-month-outline', to: '/calendar' },
  { title: 'Actions', subtitle: 'CRM actions and signals', prependIcon: 'mdi-lightning-bolt-outline', to: '/actions' },
  { title: 'Deals', subtitle: 'Revenue pipeline', prependIcon: 'mdi-handshake-outline', to: '/deals' },
  { title: 'Activity', subtitle: 'Recent CRM activity', prependIcon: 'mdi-timeline-text-outline', to: '/activity' },
  { title: 'Integrations', subtitle: 'Connected tools', prependIcon: 'mdi-connection', to: '/integrations' },
  { title: 'Plugins', subtitle: 'CRM extensions', prependIcon: 'mdi-puzzle-outline', to: '/plugins' },
].map((item) => ({ ...item, value: `page:${item.to}` }));

const items = computed(() => {
  const term = search.value.trim().toLowerCase();
  const matches = (title: string, subtitle: string) => !term || `${title} ${subtitle}`.toLowerCase().includes(term);
  const pageItems = pages
    .filter((item) => matches(item.title, item.subtitle))
    .map((item) => ({ ...item, subtitle: `Page · ${item.subtitle}`, onClick: () => selectResult(item.to) }));
  const personItems = people.value
    .map((person) => {
      const title = [person.firstName, person.lastName].filter(Boolean).join(' ') || person.linkedinUrn;
      const detail = [person.currentTitle || person.headline, person.currentCompanyName].filter(Boolean).join(' · ') || 'Saved person';
      return { title, subtitle: `Person · ${detail}`, prependIcon: 'mdi-account-outline', to: '/people', value: `person:${person.id}` };
    })
    .filter((item) => matches(item.title, item.subtitle))
    .map((item) => ({ ...item, onClick: () => selectResult(item.to) }));
  const companyItems = companies.value
    .map((company) => ({
      title: company.name,
      subtitle: `Company · ${[company.industry, company.location].filter(Boolean).join(' · ') || 'Saved company'}`,
      prependIcon: 'mdi-domain', to: '/companies', value: `company:${company.id}`,
    }))
    .filter((item) => matches(item.title, item.subtitle))
    .map((item) => ({ ...item, onClick: () => selectResult(item.to) }));
  return [...pageItems, ...personItems, ...companyItems].slice(0, 50);
});

function selectResult(to: string) {
  open.value = false;
  search.value = '';
  void router.push(to);
}

const pageShortcuts = [
  ['g-h', '/'],
  ['g-p', '/people'],
  ['g-c', '/companies'],
  ['g-t', '/tasks'],
  ['g-d', '/deals'],
  ['g-a', '/activity'],
];
for (const [shortcut, destination] of pageShortcuts) {
  useHotkey(shortcut, () => { void router.push(destination); });
}

function openPalette() {
  open.value = true;
}

defineExpose({ openPalette });
</script>

<template>
  <VCommandPalette
    v-model="open"
    v-model:search="search"
    :items="items"
    hotkey="cmd+k"
    placeholder="Search pages, people, and companies…"
    no-data-text="No matching pages or records."
    max-width="640"
    scrim="rgba(10, 18, 32, 0.48)"
    class="command-palette"
    :list-props="{ maxHeight: 440 }"
  >
    <template #item="{ props }">
      <v-list-item v-bind="props" class="command-palette-item" />
    </template>
    <template #append>
      <v-divider />
      <div class="d-flex justify-end justify-items-center ga-4 px-5 py-3 text-caption text-medium-emphasis">
        <span><v-hotkey keys="arrowup" display-mode="symbol" platform="auto" /> <v-hotkey keys="arrowdown" display-mode="symbol" platform="auto" /> to navigate</span>
        <span><v-hotkey keys="enter" display-mode="symbol" platform="auto" /> to open</span>
        <span><v-hotkey keys="escape" display-mode="symbol" platform="auto" /> to close</span>
        <span><v-hotkey keys="cmd+k" display-mode="symbol" platform="auto" /> to open</span>
      </div>
    </template>
  </VCommandPalette>
</template>

<style scoped>
:deep(.v-command-palette) { overflow: hidden; border-radius: 16px; }
.command-palette-item { scroll-margin-block: 56px; }
</style>
