<script setup lang="ts">
import { useCrmData } from '@/composables/useCrmData';

const { counts, loading, error, refetch } = useCrmData();
const summary = [
  { key: 'leads', label: 'Saved leads' },
  { key: 'companies', label: 'Companies' },
  { key: 'notes', label: 'Notes' },
  { key: 'tags', label: 'Tags' },
  { key: 'tasks', label: 'Tasks' },
  { key: 'interactions', label: 'Interactions' },
] as const;
</script>

<template>
  <v-card title="CRM overview" class="mb-4">
    <v-card-text>
      <v-progress-linear v-if="loading" indeterminate color="#0073b1" />
      <v-alert v-else-if="error" type="error" variant="tonal" class="mb-4">
        Could not load CRM data: {{ error.message }}
        <v-btn size="small" variant="text" @click="refetch()">Retry</v-btn>
      </v-alert>
      <v-row v-else>
        <v-col v-for="item in summary" :key="item.key" cols="6" sm="4">
          <v-card variant="tonal" class="pa-3">
            <div class="text-h5">{{ counts[item.key] }}</div>
            <div class="text-medium-emphasis">{{ item.label }}</div>
          </v-card>
        </v-col>
      </v-row>
      <div class="text-caption text-medium-emphasis mt-3">Read-only data from your CRM API.</div>
    </v-card-text>
  </v-card>
</template>
