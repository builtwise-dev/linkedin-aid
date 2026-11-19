<script setup lang="ts">
import CrmPageHeading from '@/components/crm/CrmPageHeading.vue';
import { useCrmTasks, formatCrmDate } from '@/composables/useCrmData';
const { records, loading, error, refetch } = useCrmTasks();
</script>
<template>
  <v-container class="pa-0" fluid>
    <CrmPageHeading eyebrow="FOLLOW-UPS" title="Tasks" description="Keep track of the next steps you need to take." />
    <v-card title="All tasks" rounded="xl" elevation="0" border>
      <v-alert v-if="error" type="error" variant="tonal" class="ma-4">Could not load tasks: {{ error.message }} <v-btn size="small" variant="text" @click="refetch()">Retry</v-btn></v-alert>
      <v-skeleton-loader v-else-if="loading" type="list-item-two-line, list-item-two-line, list-item-two-line" />
      <v-list v-else-if="records.length" lines="two">
        <v-list-item v-for="task in records" :key="task.id">
          <v-list-item-title>{{ task.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ task.description || task.status }}</v-list-item-subtitle>
          <template #append><span class="text-caption text-medium-emphasis">{{ task.status }}<template v-if="task.dueAt"> · due {{ formatCrmDate(task.dueAt) }}</template></span></template>
        </v-list-item>
      </v-list>
      <v-card-text v-else class="text-medium-emphasis">No tasks yet.</v-card-text>
    </v-card>
  </v-container>
</template>
