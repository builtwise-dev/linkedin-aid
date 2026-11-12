<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCrmInteractions, useCrmNotes, useCrmTasks, formatCrmDate } from '@/composables/useCrmData';

const activeTab = ref('interactions');
const interactionsQuery = useCrmInteractions(computed(() => activeTab.value === 'interactions'));
const tasksQuery = useCrmTasks(computed(() => activeTab.value === 'tasks'));
const notesQuery = useCrmNotes(computed(() => activeTab.value === 'notes'));
const tabs = computed(() => [
  { value: 'interactions', title: `Interactions (${interactionsQuery.records.value.length})` },
  { value: 'tasks', title: `Tasks (${tasksQuery.records.value.length})` },
  { value: 'notes', title: `Notes (${notesQuery.records.value.length})` },
]);
const loading = computed(() => interactionsQuery.loading.value || tasksQuery.loading.value || notesQuery.loading.value);
</script>

<template>
  <div>
    <v-progress-linear v-if="loading" indeterminate color="#0073b1" class="mb-4" />

    <v-btn-toggle v-model="activeTab" mandatory divided color="#0073b1" class="mb-4 d-flex">
      <v-btn v-for="tab in tabs" :key="tab.value" :value="tab.value"
        :variant="$vuetify.theme.current.dark ? undefined : 'outlined'" style="width: calc(100% / 3)">
        {{ tab.title }}
      </v-btn>
    </v-btn-toggle>

    <v-card v-if="activeTab === 'interactions'" title="Interactions">
      <v-alert v-if="interactionsQuery.error.value" type="error" variant="tonal" class="ma-4">Could not load interactions: {{ interactionsQuery.error.value.message }} <v-btn size="small" variant="text" @click="interactionsQuery.refetch()">Retry</v-btn></v-alert>
      <v-list v-else-if="interactionsQuery.records.value.length" lines="two">
        <v-list-item v-for="item in interactionsQuery.records.value" :key="item.id">
          <v-list-item-title>{{ item.summary || item.kind }}</v-list-item-title>
          <v-list-item-subtitle>{{ [item.kind, item.channel, item.outcome].filter(Boolean).join(' · ') }}</v-list-item-subtitle>
          <template #append><span class="text-caption text-medium-emphasis">{{ formatCrmDate(item.occurredAt) }}</span></template>
        </v-list-item>
      </v-list>
      <v-card-text v-else-if="!interactionsQuery.loading.value" class="text-medium-emphasis">No interactions yet.</v-card-text>
    </v-card>

    <v-card v-else-if="activeTab === 'tasks'" title="Tasks">
      <v-alert v-if="tasksQuery.error.value" type="error" variant="tonal" class="ma-4">Could not load tasks: {{ tasksQuery.error.value.message }} <v-btn size="small" variant="text" @click="tasksQuery.refetch()">Retry</v-btn></v-alert>
      <v-list v-else-if="tasksQuery.records.value.length" lines="two">
        <v-list-item v-for="task in tasksQuery.records.value" :key="task.id">
          <v-list-item-title>{{ task.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ task.description || task.status }}</v-list-item-subtitle>
          <template #append><span class="text-caption text-medium-emphasis">{{ task.status }}<template v-if="task.dueAt"> · due {{ formatCrmDate(task.dueAt) }}</template></span></template>
        </v-list-item>
      </v-list>
      <v-card-text v-else-if="!tasksQuery.loading.value" class="text-medium-emphasis">No tasks yet.</v-card-text>
    </v-card>

    <v-card v-else title="Notes">
      <v-alert v-if="notesQuery.error.value" type="error" variant="tonal" class="ma-4">Could not load notes: {{ notesQuery.error.value.message }} <v-btn size="small" variant="text" @click="notesQuery.refetch()">Retry</v-btn></v-alert>
      <v-list v-else-if="notesQuery.records.value.length" lines="two">
        <v-list-item v-for="note in notesQuery.records.value" :key="note.id">
          <v-list-item-title>{{ note.body }}</v-list-item-title>
          <v-list-item-subtitle>{{ note.savedLeadId ? 'Lead' : note.companyId ? 'Company' : 'Unlinked' }} · {{ formatCrmDate(note.createdAt) }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-card-text v-else-if="!notesQuery.loading.value" class="text-medium-emphasis">No notes yet.</v-card-text>
    </v-card>
  </div>
</template>
