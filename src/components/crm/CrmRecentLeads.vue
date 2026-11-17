<script setup lang="ts">
import type { CrmLead } from '@/composables/useCrmData';

defineProps<{
  leads: CrmLead[];
  loading: boolean;
}>();
</script>

<template>
  <v-card rounded="xl" elevation="0" border>
    <v-card-item class="px-6 py-4">
      <v-card-title class="text-h6 font-weight-bold">Recently updated leads</v-card-title>
      <v-card-subtitle>The latest people saved from LinkedIn</v-card-subtitle>
      <template #append><v-btn variant="text" color="primary" append-icon="mdi-arrow-right" to="/records">View all</v-btn></template>
    </v-card-item>
    <v-divider />
    <v-list v-if="leads.length" lines="two" class="py-0">
      <v-list-item v-for="lead in leads" :key="lead.id" :title="[lead.firstName, lead.lastName].filter(Boolean).join(' ') || lead.linkedinUrn" :subtitle="[lead.currentTitle || lead.headline, lead.currentCompanyName].filter(Boolean).join(' · ') || 'No role details available'">
        <template #prepend><v-avatar color="primary" variant="tonal" class="mr-3"><v-icon icon="mdi-account-outline" /></v-avatar></template>
        <template #append><v-chip size="small" variant="tonal" color="primary">{{ lead.status }}</v-chip></template>
      </v-list-item>
    </v-list>
    <v-empty-state
      v-else-if="!loading"
      icon="mdi-account-search-outline"
      title="No saved leads yet"
      text="Save a lead from LinkedIn and it will show up here."
    />
    <v-skeleton-loader v-else type="list-item-avatar-two-line, list-item-avatar-two-line" />
  </v-card>
</template>
