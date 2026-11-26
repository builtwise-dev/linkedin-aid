<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useHotkey } from 'vuetify';
import { useCrmCompanies, useCrmPeople } from '@/composables/useCrmData';

const router = useRouter();
const open = ref(false);
const search = ref('');
const selectedIndex = ref(0);
const resultList = ref<HTMLElement | null>(null);
const { records: people } = useCrmPeople();
const { records: companies } = useCrmCompanies();

const pages = [
  { title: 'Home', subtitle: 'CRM overview', icon: 'mdi-home-outline', to: '/' },
  { title: 'People', subtitle: 'Browse saved people', icon: 'mdi-account-multiple-outline', to: '/people' },
  { title: 'Companies', subtitle: 'Browse saved companies', icon: 'mdi-domain', to: '/companies' },
  { title: 'Tasks', subtitle: 'Follow-ups and reminders', icon: 'mdi-check-circle-outline', to: '/tasks' },
  { title: 'Calendar', subtitle: 'Workspace calendar', icon: 'mdi-calendar-month-outline', to: '/calendar' },
  { title: 'Actions', subtitle: 'CRM actions and signals', icon: 'mdi-lightning-bolt-outline', to: '/actions' },
  { title: 'Deals', subtitle: 'Revenue pipeline', icon: 'mdi-handshake-outline', to: '/deals' },
  { title: 'Activity', subtitle: 'Recent CRM activity', icon: 'mdi-timeline-text-outline', to: '/activity' },
  { title: 'Integrations', subtitle: 'Connected tools', icon: 'mdi-connection', to: '/integrations' },
  { title: 'Plugins', subtitle: 'CRM extensions', icon: 'mdi-puzzle-outline', to: '/plugins' },
];

const results = computed(() => {
  const term = search.value.trim().toLowerCase();
  const pageResults = pages
    .filter((item) => !term || `${item.title} ${item.subtitle}`.toLowerCase().includes(term))
    .map((item) => ({ ...item, type: 'Page' }));
  const personResults = people.value
    .map((person) => ({
      title: [person.firstName, person.lastName].filter(Boolean).join(' ') || person.linkedinUrn,
      subtitle: [person.currentTitle || person.headline, person.currentCompanyName].filter(Boolean).join(' · ') || 'Saved person',
      icon: 'mdi-account-outline', to: '/people', type: 'Person',
    }))
    .filter((item) => !term || `${item.title} ${item.subtitle}`.toLowerCase().includes(term));
  const companyResults = companies.value
    .map((company) => ({
      title: company.name,
      subtitle: [company.industry, company.location].filter(Boolean).join(' · ') || 'Saved company',
      icon: 'mdi-domain', to: '/companies', type: 'Company',
    }))
    .filter((item) => !term || `${item.title} ${item.subtitle}`.toLowerCase().includes(term));
  return [...pageResults, ...personResults, ...companyResults].slice(0, 50);
});

watch([open, search], () => { selectedIndex.value = 0; });
watch(selectedIndex, async () => {
  await nextTick();
  resultList.value
    ?.querySelector<HTMLElement>(`[data-command-index="${selectedIndex.value}"]`)
    ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
});

function selectResult(to: string) {
  open.value = false;
  search.value = '';
  void router.push(to);
}

useHotkey('cmd+k', () => { open.value = !open.value; });
for (const [shortcut, destination] of [['g-h', '/'], ['g-p', '/people'], ['g-c', '/companies'], ['g-t', '/tasks'], ['g-d', '/deals'], ['g-a', '/activity']]) {
  useHotkey(shortcut, () => { void router.push(destination); });
}
useHotkey('arrowdown', () => {
  if (open.value && results.value.length) selectedIndex.value = (selectedIndex.value + 1) % results.value.length;
}, { inputs: true, preventDefault: computed(() => open.value && results.value.length > 0) });
useHotkey('arrowup', () => {
  if (open.value && results.value.length) selectedIndex.value = (selectedIndex.value - 1 + results.value.length) % results.value.length;
}, { inputs: true, preventDefault: computed(() => open.value && results.value.length > 0) });
useHotkey('enter', () => {
  if (open.value && results.value.length) selectResult(results.value[selectedIndex.value].to);
}, { inputs: true, preventDefault: computed(() => open.value && results.value.length > 0) });

function openPalette() {
  open.value = true;
}

defineExpose({ openPalette });
</script>

<template>
  <v-dialog v-model="open" max-width="640" scrim="rgba(10, 18, 32, 0.48)">
    <v-card rounded="xl" class="command-palette">
      <v-text-field
        v-model="search"
        autofocus
        prepend-inner-icon="mdi-magnify"
        placeholder="Search pages, people, and companies…"
        variant="plain"
        hide-details
        class="px-5 pt-3"
        aria-label="Search CRM"
      >
        <template #append-inner><v-hotkey keys="escape" display-mode="symbol" platform="auto" /></template>
      </v-text-field>
      <v-divider />
      <div v-if="results.length" ref="resultList">
        <v-list class="py-2" max-height="440" nav>
          <v-list-item
            v-for="(item, index) in results"
            :key="`${item.type}-${item.title}-${index}`"
            :active="selectedIndex === index"
            :prepend-icon="item.icon"
            :title="item.title"
            :subtitle="item.subtitle"
            :data-command-index="index"
            rounded="lg"
            class="mx-2"
            @mousemove="selectedIndex = index"
            @click="selectResult(item.to)"
          >
            <template #append><span class="text-caption text-medium-emphasis">{{ item.type }}</span></template>
          </v-list-item>
        </v-list>
      </div>
      <v-card-text v-else class="text-medium-emphasis text-center py-8">No matching pages or records.</v-card-text>
      <v-divider />
      <div class="palette-hint px-5 py-3 text-caption text-medium-emphasis">
        <span><v-hotkey keys="arrowup" display-mode="symbol" platform="auto" /> <v-hotkey keys="arrowdown" display-mode="symbol" platform="auto" /> to navigate</span>
        <span><v-hotkey keys="enter" display-mode="symbol" platform="auto" /> to open</span>
        <span><v-hotkey keys="escape" display-mode="symbol" platform="auto" /> to close</span>
        <span><v-hotkey keys="cmd+k" display-mode="symbol" platform="auto" /> to open</span>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.command-palette { overflow: hidden; }
.palette-hint { display: flex; justify-content: flex-end; gap: 16px; }
[data-command-index] { scroll-margin-block: 56px; }
</style>
