<script setup lang="ts">
import { useCrmData, formatCrmDate } from '@/composables/useCrmData';

const { data, loading, error, refetch } = useCrmData();
</script>

<template>
  <div>
    <v-progress-linear v-if="loading" indeterminate color="#0073b1" class="mb-4" />
    <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
      Could not load CRM records: {{ error.message }}
      <v-btn size="small" variant="text" @click="refetch()">Retry</v-btn>
    </v-alert>

    <v-card title="Saved leads" class="mb-4">
      <v-list v-if="data?.savedLeads.length" lines="two">
        <v-list-item v-for="lead in data.savedLeads" :key="lead.id">
          <v-list-item-title>{{ [lead.firstName, lead.lastName].filter(Boolean).join(' ') || lead.linkedinUrn }}</v-list-item-title>
          <v-list-item-subtitle>{{ lead.currentTitle || lead.headline || 'No title' }}<template v-if="lead.currentCompanyName"> · {{ lead.currentCompanyName }}</template></v-list-item-subtitle>
          <template #append>
            <div class="text-caption text-medium-emphasis">{{ lead.status }} · {{ formatCrmDate(lead.updatedAt) }}</div>
          </template>
        </v-list-item>
      </v-list>
      <v-card-text v-else-if="!loading && !error" class="text-medium-emphasis">No saved leads yet.</v-card-text>
    </v-card>

    <v-card title="Companies" class="mb-4">
      <v-list v-if="data?.companies.length" lines="two">
        <v-list-item v-for="company in data.companies" :key="company.id">
          <v-list-item-title>{{ company.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ [company.industry, company.location].filter(Boolean).join(' · ') || company.linkedinUrn }}</v-list-item-subtitle>
          <template #append>
            <div class="text-caption text-medium-emphasis">{{ company.status }} · {{ formatCrmDate(company.updatedAt) }}</div>
          </template>
        </v-list-item>
      </v-list>
      <v-card-text v-else-if="!loading && !error" class="text-medium-emphasis">No companies yet.</v-card-text>
    </v-card>

    <v-card title="Tags">
      <v-card-text v-if="data?.crmTags.length" class="d-flex flex-wrap ga-2">
        <v-chip v-for="tag in data.crmTags" :key="tag.id" size="small">{{ tag.name }}</v-chip>
      </v-card-text>
      <v-card-text v-else-if="!loading && !error" class="text-medium-emphasis">No tags yet.</v-card-text>
    </v-card>
  </div>
</template>
