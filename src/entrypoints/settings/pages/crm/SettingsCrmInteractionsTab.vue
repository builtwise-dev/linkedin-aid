<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCrmData, formatCrmDate } from '@/composables/useCrmData';

const { data, loading, error, refetch } = useCrmData();
const activeTab = ref('interactions');
const tabs = computed(() => [
  { value: 'interactions', title: `Interactions (${data.value?.crmInteractions.length ?? 0})` },
  { value: 'tasks', title: `Tasks (${data.value?.crmTasks.length ?? 0})` },
  { value: 'notes', title: `Notes (${data.value?.crmNotes.length ?? 0})` },
]);
</script>

<template>
  <div>
    <v-progress-linear v-if="loading" indeterminate color="#0073b1" class="mb-4" />
    <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
      Could not load CRM activity: {{ error.message }}
      <v-btn size="small" variant="text" @click="refetch()">Retry</v-btn>
    </v-alert>

    <v-btn-toggle v-model="activeTab" mandatory divided color="#0073b1" class="mb-4 d-flex">
      <v-btn v-for="tab in tabs" :key="tab.value" :value="tab.value"
        :variant="$vuetify.theme.current.dark ? undefined : 'outlined'" style="width: calc(100% / 3)">
        {{ tab.title }}
      </v-btn>
    </v-btn-toggle>

    <v-card v-if="activeTab === 'interactions'" title="Interactions">
      <v-list v-if="data?.crmInteractions.length" lines="two">
        <v-list-item v-for="item in data.crmInteractions" :key="item.id">
          <v-list-item-title>{{ item.summary || item.kind }}</v-list-item-title>
          <v-list-item-subtitle>{{ [item.kind, item.channel, item.outcome].filter(Boolean).join(' · ') }}</v-list-item-subtitle>
          <template #append><span class="text-caption text-medium-emphasis">{{ formatCrmDate(item.occurredAt) }}</span></template>
        </v-list-item>
      </v-list>
      <v-card-text v-else-if="!loading && !error" class="text-medium-emphasis">No interactions yet.</v-card-text>
    </v-card>

    <v-card v-else-if="activeTab === 'tasks'" title="Tasks">
      <v-list v-if="data?.crmTasks.length" lines="two">
        <v-list-item v-for="task in data.crmTasks" :key="task.id">
          <v-list-item-title>{{ task.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ task.description || task.status }}</v-list-item-subtitle>
          <template #append><span class="text-caption text-medium-emphasis">{{ task.status }}<template v-if="task.dueAt"> · due {{ formatCrmDate(task.dueAt) }}</template></span></template>
        </v-list-item>
      </v-list>
      <v-card-text v-else-if="!loading && !error" class="text-medium-emphasis">No tasks yet.</v-card-text>
    </v-card>

    <v-card v-else title="Notes">
      <v-list v-if="data?.crmNotes.length" lines="two">
        <v-list-item v-for="note in data.crmNotes" :key="note.id">
          <v-list-item-title>{{ note.body }}</v-list-item-title>
          <v-list-item-subtitle>{{ note.savedLeadId ? 'Lead' : note.companyId ? 'Company' : 'Unlinked' }} · {{ formatCrmDate(note.createdAt) }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-card-text v-else-if="!loading && !error" class="text-medium-emphasis">No notes yet.</v-card-text>
    </v-card>
  </div>
</template>
