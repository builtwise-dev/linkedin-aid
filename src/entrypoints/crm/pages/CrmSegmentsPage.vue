<script setup lang="ts">
import CrmPageHeading from '@/components/crm/CrmPageHeading.vue';
import { useCrmTags } from '@/composables/useCrmData';
const { records: tags, loading, error, refetch } = useCrmTags();
</script>
<template>
  <v-container class="pa-0" fluid>
    <CrmPageHeading eyebrow="ORGANIZE" title="Segments" description="Group and find your CRM records. Tags are shown here for now." />
    <v-card title="Tags" rounded="xl" elevation="0" border>
      <v-alert v-if="error" type="error" variant="tonal" class="ma-4">Could not load tags: {{ error.message }} <v-btn size="small" variant="text" @click="refetch()">Retry</v-btn></v-alert>
      <v-card-text v-else-if="loading"><v-skeleton-loader type="chip, chip, chip" /></v-card-text>
      <v-card-text v-else-if="tags.length" class="d-flex flex-wrap ga-2"><v-chip v-for="tag in tags" :key="tag.id" size="small">{{ tag.name }}</v-chip></v-card-text>
      <v-card-text v-else class="text-medium-emphasis">No tags yet.</v-card-text>
    </v-card>
  </v-container>
</template>
