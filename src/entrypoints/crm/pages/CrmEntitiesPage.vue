<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CrmPerson } from '@/composables/useCrmData';

defineProps<{ kind: 'people' | 'companies' }>();
import { useCrmSave } from '@/composables/useCrmSave';
import { useCrmCompanies, useCrmPeople, formatCrmDate } from '@/composables/useCrmData';

const { records: people, loading: peopleLoading, error: peopleError, refetch: refetchPeople } = useCrmPeople();
const { records: companies, loading: companiesLoading, error: companiesError, refetch: refetchCompanies } = useCrmCompanies();
const {
  deletePerson, deleteCompany, removingPerson, removingCompany,
  updatePersonStatus, updateCompanyStatus, linkPersonToCompany, unlinkPersonFromCompany,
} = useCrmSave();
const companyDialogOpen = ref(false);
const selectedPerson = ref<CrmPerson | null>(null);
const selectedCompanyId = ref<string | null>(null);
const roleTitle = ref('');
const relationshipIsCurrent = ref(false);
const availableCompanies = computed(() => {
  const linkedIds = new Set(selectedPerson.value?.companyRelationships.map((relationship) => relationship.companyId) ?? []);
  return companies.value.filter((company) => !linkedIds.has(company.id));
});

const openCompanyDialog = (person: CrmPerson) => {
  selectedPerson.value = person;
  selectedCompanyId.value = null;
  roleTitle.value = '';
  relationshipIsCurrent.value = false;
  companyDialogOpen.value = true;
};

const refreshSelectedPerson = async () => {
  await refetchPeople();
  selectedPerson.value = people.value.find((person) => person.id === selectedPerson.value?.id) ?? null;
};

const addCompanyRelationship = async () => {
  if (!selectedPerson.value || !selectedCompanyId.value) return;
  await linkPersonToCompany({
    variables: {
      personId: selectedPerson.value.id,
      companyId: selectedCompanyId.value,
      roleTitle: roleTitle.value || undefined,
      isCurrent: relationshipIsCurrent.value,
    },
  });
  selectedCompanyId.value = null;
  roleTitle.value = '';
  await refreshSelectedPerson();
};

const removeCompanyRelationship = async (companyId: string) => {
  if (!selectedPerson.value) return;
  await unlinkPersonFromCompany({ variables: { personId: selectedPerson.value.id, companyId } });
  await refreshSelectedPerson();
};

const removePerson = async (personId: string) => {
  if (!confirm('Remove this person from your CRM?')) return;
  await deletePerson({ variables: { personId } });
  await refetchPeople();
};

const setPersonLifecycle = async (personId: string, lifecycleStage: string) => {
  await updatePersonStatus({ variables: { personId, lifecycleStage } });
  await refetchPeople();
};
const setPersonConnection = async (personId: string, connectionStatus: string) => {
  await updatePersonStatus({ variables: { personId, connectionStatus } });
  await refetchPeople();
};
const setPersonOutreach = async (personId: string, outreachStatus: string) => {
  await updatePersonStatus({ variables: { personId, outreachStatus } });
  await refetchPeople();
};
const setCompanyLifecycle = async (companyId: string, lifecycleStage: string) => {
  await updateCompanyStatus({ variables: { companyId, lifecycleStage } });
  await refetchCompanies();
};
const setCompanyClassification = async (companyId: string, accountClassification: string) => {
  await updateCompanyStatus({ variables: { companyId, accountClassification } });
  await refetchCompanies();
};

const personLifecycleOptions = [
  { title: 'Lead', value: 'lead' },
  { title: 'Qualified', value: 'qualified' },
  { title: 'Customer', value: 'customer' },
];
const connectionOptions = [
  { title: 'Not connected', value: 'not_connected' },
  { title: 'Request sent', value: 'connection_requested' },
  { title: 'Connected', value: 'connected' },
];
const outreachOptions = [
  { title: 'Not contacted', value: 'not_contacted' },
  { title: 'Contacted', value: 'contacted' },
  { title: 'Replied', value: 'replied' },
];
const companyLifecycleOptions = [
  { title: 'Prospect', value: 'prospect' },
  { title: 'Customer', value: 'customer' },
  { title: 'Former customer', value: 'former_customer' },
];
const companyClassificationOptions = [
  { title: 'Target', value: 'target' },
  { title: 'Active account', value: 'active_account' },
  { title: 'Partner', value: 'partner' },
];

const removeCompany = async (companyId: string) => {
  if (!confirm('Remove this company from your CRM?')) return;
  await deleteCompany({ variables: { companyId } });
  await refetchCompanies();
};
</script>

<template>
  <div>
    <v-card v-if="kind === 'people'" title="People" class="mb-4">
      <v-alert v-if="peopleError" type="error" variant="tonal" class="ma-4">Could not load people: {{ peopleError.message }} <v-btn size="small" variant="text" @click="refetchPeople()">Retry</v-btn></v-alert>
      <v-skeleton-loader v-else-if="peopleLoading" type="list-item-two-line, list-item-two-line, list-item-two-line" />
      <v-list v-else-if="people.length" lines="two">
        <v-list-item v-for="person in people" :key="person.id">
          <v-list-item-title>{{ [person.firstName, person.lastName].filter(Boolean).join(' ') || person.linkedinUrn }}</v-list-item-title>
          <v-list-item-subtitle>{{ person.currentTitle || person.headline || 'No title' }} · {{ person.companyRelationships.map((relationship) => relationship.company.name).join(', ') || person.currentCompanyName || 'No company linked' }}</v-list-item-subtitle>
          <template #append>
            <div class="d-flex align-center ga-3">
              <div class="person-status-grid">
                <v-select :model-value="person.lifecycleStage" :items="personLifecycleOptions" label="Lifecycle" density="compact" variant="outlined" hide-details @update:model-value="setPersonLifecycle(person.id, $event)" />
                <v-select :model-value="person.connectionStatus" :items="connectionOptions" label="LinkedIn" density="compact" variant="outlined" hide-details @update:model-value="setPersonConnection(person.id, $event)" />
                <v-select :model-value="person.outreachStatus" :items="outreachOptions" label="Outreach" density="compact" variant="outlined" hide-details @update:model-value="setPersonOutreach(person.id, $event)" />
              </div>
              <v-btn size="small" variant="outlined" prepend-icon="mdi-domain" @click="openCompanyDialog(person)">Companies ({{ person.companyRelationships.length }})</v-btn>
              <div class="text-caption text-medium-emphasis">{{ formatCrmDate(person.updatedAt) }}</div>
              <v-btn size="small" variant="text" color="error" :loading="removingPerson" aria-label="Remove person from CRM" @click="removePerson(person.id)">Remove</v-btn>
            </div>
          </template>
        </v-list-item>
      </v-list>
      <v-card-text v-else-if="!peopleLoading" class="text-medium-emphasis">No people yet. Save a profile from LinkedIn to add it here.</v-card-text>
    </v-card>

    <v-card v-if="kind === 'companies'" title="Companies" class="mb-4">
      <v-alert v-if="companiesError" type="error" variant="tonal" class="ma-4">Could not load companies: {{ companiesError.message }} <v-btn size="small" variant="text" @click="refetchCompanies()">Retry</v-btn></v-alert>
      <v-skeleton-loader v-else-if="companiesLoading" type="list-item-two-line, list-item-two-line, list-item-two-line" />
      <v-list v-else-if="companies.length" lines="two">
        <v-list-item v-for="company in companies" :key="company.id">
          <v-list-item-title>{{ company.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ [company.industry, company.location].filter(Boolean).join(' · ') || company.linkedinUrn }} · {{ company.peopleCount ?? 0 }} people</v-list-item-subtitle>
          <template #append>
            <div class="d-flex align-center ga-3">
              <div class="company-status-grid">
                <v-select :model-value="company.lifecycleStage" :items="companyLifecycleOptions" label="Lifecycle" density="compact" variant="outlined" hide-details @update:model-value="setCompanyLifecycle(company.id, $event)" />
                <v-select :model-value="company.accountClassification" :items="companyClassificationOptions" label="Classification" density="compact" variant="outlined" hide-details @update:model-value="setCompanyClassification(company.id, $event)" />
              </div>
              <div class="text-caption text-medium-emphasis">{{ formatCrmDate(company.updatedAt) }}</div>
              <v-btn size="small" variant="text" color="error" :loading="removingCompany" aria-label="Remove company from CRM" @click="removeCompany(company.id)">Remove</v-btn>
            </div>
          </template>
        </v-list-item>
      </v-list>
      <v-card-text v-else-if="!companiesLoading" class="text-medium-emphasis">No companies yet.</v-card-text>
    </v-card>

    <v-dialog v-model="companyDialogOpen" max-width="560">
      <v-card v-if="selectedPerson" title="Company relationships">
        <v-card-subtitle>{{ [selectedPerson.firstName, selectedPerson.lastName].filter(Boolean).join(' ') || selectedPerson.linkedinUrn }}</v-card-subtitle>
        <v-card-text>
          <div v-if="selectedPerson.companyRelationships.length" class="d-flex flex-wrap ga-2 mb-5">
            <v-chip
              v-for="relationship in selectedPerson.companyRelationships"
              :key="relationship.companyId"
              closable
              @click:close="removeCompanyRelationship(relationship.companyId)"
            >
              {{ relationship.company.name }}<template v-if="relationship.roleTitle"> · {{ relationship.roleTitle }}</template>
              <v-icon v-if="relationship.isCurrent" icon="mdi-check-circle" size="small" class="ml-1" />
            </v-chip>
          </div>
          <div v-else class="text-medium-emphasis mb-4">No company relationships linked yet.</div>
          <v-select
            v-model="selectedCompanyId"
            :items="availableCompanies"
            item-title="name"
            item-value="id"
            label="Add company"
            variant="outlined"
            density="comfortable"
            hide-details
            class="mb-3"
          />
          <v-text-field v-model="roleTitle" label="Role or relationship" variant="outlined" density="comfortable" hide-details class="mb-2" />
          <v-switch v-model="relationshipIsCurrent" label="Current company relationship" color="primary" hide-details />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="companyDialogOpen = false">Close</v-btn>
          <v-btn color="primary" :disabled="!selectedCompanyId" @click="addCompanyRelationship">Link company</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.person-status-grid { display: grid; grid-template-columns: repeat(3, 140px); gap: 8px; }
.company-status-grid { display: grid; grid-template-columns: repeat(2, 150px); gap: 8px; }
@media (max-width: 1100px) { .person-status-grid { grid-template-columns: 1fr; } .company-status-grid { grid-template-columns: 1fr; } }
</style>
