<script setup lang="ts">
import { computed, ref } from 'vue';
import CrmPageHeading from '@/components/crm/CrmPageHeading.vue';

type Signal = { title: string; detail: string; source: string; state: 'CRM foundation' | 'Integration needed' | 'Later phase' };
type SignalGroup = { title: string; icon: string; summary: string; signals: Signal[] };
const groups: SignalGroup[] = [
  { title: 'Career & profile', icon: 'mdi-account-arrow-up-outline', summary: 'Changes to a person’s role, company, or profile.', signals: [
    { title: 'Job or company change', detail: 'A contact leaves their company or joins a new organization.', source: 'LinkedIn profile history', state: 'Later phase' },
    { title: 'Promotion or title change', detail: 'A contact takes a more senior role or moves to a new department.', source: 'LinkedIn profile history', state: 'Later phase' },
    { title: 'Work anniversary', detail: 'A role milestone creates a natural reason to reconnect.', source: 'Profile start date', state: 'Later phase' },
    { title: 'Location change', detail: 'A contact moves to a city relevant to your plans.', source: 'LinkedIn profile', state: 'Later phase' },
    { title: 'Headline update', detail: 'A new focus, project, or advisory role appears in their profile.', source: 'LinkedIn profile history', state: 'Later phase' },
  ]},
  { title: 'Conversation & inbox', icon: 'mdi-message-alert-outline', summary: 'Open loops and changes in conversation momentum.', signals: [
    { title: 'Unanswered incoming message', detail: 'A message is waiting for your reply.', source: 'LinkedIn or email inbox', state: 'Integration needed' },
    { title: 'Open commitment', detail: 'You or a contact promised a specific follow-up or timeframe.', source: 'Message and notes context', state: 'Integration needed' },
    { title: 'Stalled thread', detail: 'An active conversation went quiet after your last message.', source: 'Message history', state: 'Integration needed' },
    { title: 'Meeting follow-up gap', detail: 'A meeting happened without a follow-up note or thank-you.', source: 'Calendar and CRM activity', state: 'Integration needed' },
  ]},
  { title: 'Relationship health', icon: 'mdi-heart-pulse', summary: 'Spot relationships that need attention based on your own CRM history.', signals: [
    { title: 'Relationship drift', detail: 'A high-value relationship has gone quiet beyond its preferred cadence.', source: 'CRM activity and relationship tier', state: 'CRM foundation' },
    { title: 'VIP silence', detail: 'A priority contact has had no touchpoints within your target window.', source: 'CRM activity and relationship tier', state: 'CRM foundation' },
    { title: 'One-sided communication', detail: 'Several outreach attempts have passed without a reply.', source: 'Message history', state: 'Integration needed' },
    { title: 'Post-project drop-off', detail: 'A completed engagement has not had a follow-up since wrap-up.', source: 'Deals and CRM activity', state: 'Later phase' },
  ]},
  { title: 'Engagement & intent', icon: 'mdi-thumb-up-outline', summary: 'Notice signs that a contact may be ready to reconnect.', signals: [
    { title: 'Social interaction', detail: 'A contact likes, comments on, or shares your post.', source: 'LinkedIn activity', state: 'Integration needed' },
    { title: 'Content engagement', detail: 'A contact registers for an event or engages with a resource.', source: 'Marketing platform', state: 'Integration needed' },
    { title: 'High reply responsiveness', detail: 'A quiet contact replies quickly or with renewed interest.', source: 'Message history', state: 'Integration needed' },
    { title: 'Referral or mention', detail: 'Someone recommends or references a contact in your network.', source: 'Notes and team context', state: 'Later phase' },
  ]},
  { title: 'Company & network', icon: 'mdi-domain', summary: 'Account changes and relationship paths that can open doors.', signals: [
    { title: 'Funding, M&A, or product news', detail: 'A target company raises funding, expands, launches, or is acquired.', source: 'Company news', state: 'Integration needed' },
    { title: 'Leadership or hiring change', detail: 'Leadership turnover, hiring surges, or restructuring shifts priorities.', source: 'Company news and hiring data', state: 'Integration needed' },
    { title: 'Warm introduction path', detail: 'A teammate or mutual contact has a strong path to your target.', source: 'Shared relationship graph', state: 'Later phase' },
    { title: 'Account coverage gap', detail: 'A target account has no recent relationship activity from your team.', source: 'Team CRM activity', state: 'Later phase' },
  ]},
];
const selectedGroup = ref('All signals');
const search = ref('');
const storageKey = 'crm-enabled-signals';
const enabledSignals = ref<string[]>([]);
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  enabledSignals.value = Array.isArray(saved) ? saved.filter((value): value is string => typeof value === 'string') : [];
} catch {
  enabledSignals.value = [];
}
function toggleSignal(title: string, enabled: boolean) {
  enabledSignals.value = enabled
    ? [...new Set([...enabledSignals.value, title])]
    : enabledSignals.value.filter(signal => signal !== title);
  try {
    localStorage.setItem(storageKey, JSON.stringify(enabledSignals.value));
  } catch {
    // Keep this control usable in browser contexts where storage is unavailable.
  }
}
const visibleGroups = computed(() => groups.filter(group => (selectedGroup.value === 'All signals' || group.title === selectedGroup.value)
  && (!search.value || group.title.toLowerCase().includes(search.value.toLowerCase()) || group.signals.some(signal => `${signal.title} ${signal.detail}`.toLowerCase().includes(search.value.toLowerCase())))));
const enabledCount = computed(() => enabledSignals.value.length);
const stateColor = (state: Signal['state']) => state === 'CRM foundation' ? 'success' : state === 'Integration needed' ? 'warning' : 'default';
</script>

<template>
  <v-container>
    <CrmPageHeading eyebrow="ACTIONS · CONFIGURATION" title="Signals" description="Choose which changes should trigger recommended actions." >
      <template #actions><v-btn variant="text" prepend-icon="mdi-arrow-left" to="/actions" exact>Back to actions</v-btn></template>
    </CrmPageHeading>
    <section id="signals">
      <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-4">
        <div><div class="text-h6">Signal settings</div><div class="text-body-2 text-medium-emphasis">Choose which changes you want to monitor.</div></div>
        <v-chip color="primary" variant="tonal">{{ enabledCount }} selected</v-chip>
      </div>
      <v-alert type="info" variant="tonal" rounded="lg" class="mb-5" icon="mdi-information-outline">
        Your selections are saved in this browser. Detection will begin when the required data sources are connected.
      </v-alert>
      <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-4">
        <v-chip-group v-model="selectedGroup" selected-class="text-primary" mandatory>
          <v-chip value="All signals" filter variant="outlined">All signals</v-chip>
          <v-chip v-for="group in groups" :key="group.title" :value="group.title" filter variant="outlined">{{ group.title }}</v-chip>
        </v-chip-group>
        <v-text-field v-model="search" label="Find a signal" prepend-inner-icon="mdi-magnify" density="compact" variant="outlined" hide-details clearable style="max-width: 260px" />
      </div>
      <v-row>
        <v-col v-for="group in visibleGroups" :key="group.title" cols="12" xl="6">
          <v-card rounded="xl" elevation="0" border class="h-100">
            <v-card-item>
              <template #prepend><v-avatar color="primary" variant="tonal" rounded="lg"><v-icon :icon="group.icon" /></v-avatar></template>
              <v-card-title>{{ group.title }}</v-card-title><v-card-subtitle>{{ group.summary }}</v-card-subtitle>
              <template #append><v-chip size="small" variant="tonal">{{ group.signals.length }}</v-chip></template>
            </v-card-item>
            <v-divider />
            <v-list lines="two" class="py-0">
              <v-list-item v-for="signal in group.signals" :key="signal.title" class="py-2">
                <v-list-item-title class="text-body-2 font-weight-medium">{{ signal.title }}</v-list-item-title>
                <v-list-item-subtitle class="text-wrap mt-1">{{ signal.detail }}</v-list-item-subtitle>
                <template #append><div class="d-flex align-center ga-3"><div class="d-flex flex-column align-end ga-1"><v-chip size="x-small" :color="stateColor(signal.state)" variant="tonal">{{ signal.state }}</v-chip><span class="text-caption text-medium-emphasis">{{ signal.source }}</span></div><v-switch :model-value="enabledSignals.includes(signal.title)" color="primary" density="compact" hide-details :aria-label="`Monitor ${signal.title}`" @update:model-value="toggleSignal(signal.title, !!$event)" /></div></template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col v-if="visibleGroups.length === 0" cols="12"><v-card border rounded="xl" elevation="0"><v-card-text class="text-medium-emphasis">No signals match “{{ search }}”. Try another search.</v-card-text></v-card></v-col>
      </v-row>
    </section>
  </v-container>
</template>
