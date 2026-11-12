<script setup lang="ts">
import { computed } from 'vue';
import { useCrmSave } from '@/composables/useCrmSave';
import { useCrmCompanies, useCrmLeads, useCrmTags, formatCrmDate } from '@/composables/useCrmData';

const { records: leads, loading: leadsLoading, error: leadsError, refetch: refetchLeads } = useCrmLeads();
const { records: companies, loading: companiesLoading, error: companiesError, refetch: refetchCompanies } = useCrmCompanies();
const { records: tags, loading: tagsLoading, error: tagsError, refetch: refetchTags } = useCrmTags();
const loading = computed(() => leadsLoading.value || companiesLoading.value || tagsLoading.value);
const { unsaveLead, deleteCompany, removingLead, removingCompany } = useCrmSave();

const removeLead = async (leadId: string) => {
  if (!confirm('Remove this lead from your CRM?')) return;
  await unsaveLead({ variables: { leadId } });
  await refetchLeads();
};

const removeCompany = async (companyId: string) => {
  if (!confirm('Remove this company from your CRM?')) return;
  await deleteCompany({ variables: { companyId } });
  await refetchCompanies();
};
</script>

<template>
  <div>
    <v-progress-linear v-if="loading" indeterminate color="#0073b1" class="mb-4" />

    <v-card title="Saved leads" class="mb-4">
      <v-alert v-if="leadsError" type="error" variant="tonal" class="ma-4">Could not load saved leads: {{ leadsError.message }} <v-btn size="small" variant="text" @click="refetchLeads()">Retry</v-btn></v-alert>
      <v-list v-else-if="leads.length" lines="two">
        <v-list-item v-for="lead in leads" :key="lead.id">
          <v-list-item-title>{{ [lead.firstName, lead.lastName].filter(Boolean).join(' ') || lead.linkedinUrn }}</v-list-item-title>
          <v-list-item-subtitle>{{ lead.currentTitle || lead.headline || 'No title' }}<template v-if="lead.currentCompanyName"> · {{ lead.currentCompanyName }}</template></v-list-item-subtitle>
          <template #append>
            <div class="d-flex align-center ga-2">
              <div class="text-caption text-medium-emphasis">{{ lead.status }} · {{ formatCrmDate(lead.updatedAt) }}</div>
              <v-btn size="small" variant="text" color="error" :loading="removingLead" aria-label="Remove saved lead from CRM" @click="removeLead(lead.id)">Remove</v-btn>
            </div>
          </template>
        </v-list-item>
      </v-list>
      <v-card-text v-else-if="!leadsLoading" class="text-medium-emphasis">No saved leads yet.</v-card-text>
    </v-card>

    <v-card title="Companies" class="mb-4">
      <v-alert v-if="companiesError" type="error" variant="tonal" class="ma-4">Could not load companies: {{ companiesError.message }} <v-btn size="small" variant="text" @click="refetchCompanies()">Retry</v-btn></v-alert>
      <v-list v-else-if="companies.length" lines="two">
        <v-list-item v-for="company in companies" :key="company.id">
          <v-list-item-title>{{ company.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ [company.industry, company.location].filter(Boolean).join(' · ') || company.linkedinUrn }}</v-list-item-subtitle>
          <template #append>
            <div class="d-flex align-center ga-2">
              <div class="text-caption text-medium-emphasis">{{ company.status }} · {{ formatCrmDate(company.updatedAt) }}</div>
              <v-btn size="small" variant="text" color="error" :loading="removingCompany" aria-label="Remove company from CRM" @click="removeCompany(company.id)">Remove</v-btn>
            </div>
          </template>
        </v-list-item>
      </v-list>
      <v-card-text v-else-if="!companiesLoading" class="text-medium-emphasis">No companies yet.</v-card-text>
    </v-card>

    <v-card title="Tags">
      <v-alert v-if="tagsError" type="error" variant="tonal" class="ma-4">Could not load tags: {{ tagsError.message }} <v-btn size="small" variant="text" @click="refetchTags()">Retry</v-btn></v-alert>
      <v-card-text v-else-if="tags.length" class="d-flex flex-wrap ga-2">
        <v-chip v-for="tag in tags" :key="tag.id" size="small">{{ tag.name }}</v-chip>
      </v-card-text>
      <v-card-text v-else-if="!tagsLoading" class="text-medium-emphasis">No tags yet.</v-card-text>
    </v-card>
  </div>
</template>
