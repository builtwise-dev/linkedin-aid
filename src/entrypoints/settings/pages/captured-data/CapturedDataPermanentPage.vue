<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useDataStore } from '@/store/data-store';
import { db } from '@/db/schema';
import { useConfirmDialog } from '@/composables/useConfirmDialog';
import { useSnackbar } from '@/composables/useSnackbar';
import LeadPreviewList from '@/components/leads/LeadPreviewList.vue';
import CompanyPreview from '@/components/companies/CompanyPreview.vue';
import SearchSessionPreview from '@/components/search-sessions/SearchSessionPreview.vue';
import EntityDetailModal from '@/components/settings/dialogs/EntityDetailModal.vue';
import LeadPositionRelationModal from '@/components/settings/dialogs/LeadPositionRelationModal.vue';
import CapturedDataRetentionSettings from '@/components/settings/CapturedDataRetentionSettings.vue';
import { matchesLead, matchesCompany, matchesSearchSession } from '@/helpers/entity-search-helper';
import type { Lead } from '@/types/lead/lead';
import type { Company } from '@/types/company/company';
import type { SearchSession } from '@/types/search/search';
import type { CompaniesMap } from '@/store/data-store';

const { leadsMap, companiesMap, searchSessionsMap, leadPositionRelationsMap } = useDataStore();

const PAGE_SIZE = 50;

const searchQuery = ref('');

const leads = computed(() => {
  const all = Object.values(leadsMap.value).sort((a, b) => b.updatedAt - a.updatedAt);
  return all.filter(lead => matchesLead(lead as Lead, searchQuery.value, leadPositionRelationsMap.value, companiesMap.value as CompaniesMap));
});

const companies = computed(() => {
  const all = Object.values(companiesMap.value).sort((a, b) => b.updatedAt - a.updatedAt);
  return all.filter(company => matchesCompany(company as Company, searchQuery.value));
});

const searchSessions = computed(() => {
  const all = Object.values(searchSessionsMap.value).sort((a, b) => b.updatedAt - a.updatedAt);
  return all.filter(searchSession => matchesSearchSession(searchSession as SearchSession, searchQuery.value));
});

const leadsCount = computed(() => leads.value.length);
const companiesCount = computed(() => companies.value.length);
const searchSessionsCount = computed(() => searchSessions.value.length);

const leadsPage = ref(1);
const companiesPage = ref(1);
const searchSessionsPage = ref(1);

const paginatedLeads = computed(() => {
  const start = (leadsPage.value - 1) * PAGE_SIZE;
  return leads.value.slice(start, start + PAGE_SIZE);
});

const paginatedCompanies = computed(() => {
  const start = (companiesPage.value - 1) * PAGE_SIZE;
  return companies.value.slice(start, start + PAGE_SIZE);
});

const paginatedSearchSessions = computed(() => {
  const start = (searchSessionsPage.value - 1) * PAGE_SIZE;
  return searchSessions.value.slice(start, start + PAGE_SIZE);
});

watch(leadsCount, (newCount) => {
  const maxPage = Math.max(1, Math.ceil(newCount / PAGE_SIZE));
  if (leadsPage.value > maxPage) {
    leadsPage.value = maxPage;
  }
});

watch(companiesCount, (newCount) => {
  const maxPage = Math.max(1, Math.ceil(newCount / PAGE_SIZE));
  if (companiesPage.value > maxPage) {
    companiesPage.value = maxPage;
  }
});

watch(searchSessionsCount, (newCount) => {
  const maxPage = Math.max(1, Math.ceil(newCount / PAGE_SIZE));
  if (searchSessionsPage.value > maxPage) {
    searchSessionsPage.value = maxPage;
  }
});

watch(searchQuery, () => {
  leadsPage.value = 1;
  companiesPage.value = 1;
  searchSessionsPage.value = 1;
});

const activeTab = ref('leads');
const tabs = computed(() => [
  { value: 'leads', title: `Leads (${ leadsCount.value })` },
  { value: 'companies', title: `Companies (${ companiesCount.value })` },
  { value: 'searchSessions', title: `Search Sessions (${ searchSessionsCount.value })` },
  { value: 'connection_requests', title: `Connection requests`, badge: 'dev' },
]);

const selectedLeadUrns = ref(new Set<string>());
const selectedCompanyUrns = ref(new Set<string>());
const selectedSearchSessionIds = ref(new Set<string>());

const isCompaniesDense = ref(true);

const companyViewMode = computed({
  get: () => isCompaniesDense.value ? 'dense' : 'detailed',
  set: (val) => isCompaniesDense.value = val === 'dense'
});

const toggleLeadSelection = (urn: string, selected: boolean) => {
  const next = new Set(selectedLeadUrns.value);
  if (selected) {
    next.add(urn);
  } else {
    next.delete(urn);
  }
  selectedLeadUrns.value = next;
};

const toggleCompanySelection = (urn: string, selected: boolean) => {
  const next = new Set(selectedCompanyUrns.value);
  if (selected) {
    next.add(urn);
  } else {
    next.delete(urn);
  }
  selectedCompanyUrns.value = next;
};

const toggleSearchSessionSelection = (id: string, selected: boolean) => {
  const next = new Set(selectedSearchSessionIds.value);
  if (selected) {
    next.add(id);
  } else {
    next.delete(id);
  }
  selectedSearchSessionIds.value = next;
};

const allLeadsSelected = computed({
  get: () => leadsCount.value > 0 && leads.value.every(l => selectedLeadUrns.value.has(l.entityUrn)),
  set: (val) => {
    const next = new Set(selectedLeadUrns.value);
    if (val) {
      leads.value.forEach(l => next.add(l.entityUrn));
    } else {
      leads.value.forEach(l => next.delete(l.entityUrn));
    }
    selectedLeadUrns.value = next;
  }
});

const allCompaniesSelected = computed({
  get: () => companiesCount.value > 0 && companies.value.every(c => selectedCompanyUrns.value.has(c.entityUrn)),
  set: (val) => {
    const next = new Set(selectedCompanyUrns.value);
    if (val) {
      companies.value.forEach(c => next.add(c.entityUrn));
    } else {
      companies.value.forEach(c => next.delete(c.entityUrn));
    }
    selectedCompanyUrns.value = next;
  }
});

const allSearchSessionsSelected = computed({
  get: () => searchSessionsCount.value > 0 && searchSessions.value.every(s => selectedSearchSessionIds.value.has(s.id)),
  set: (val) => {
    const next = new Set(selectedSearchSessionIds.value);
    if (val) {
      searchSessions.value.forEach(s => next.add(s.id));
    } else {
      searchSessions.value.forEach(s => next.delete(s.id));
    }
    selectedSearchSessionIds.value = next;
  }
});

const { confirmAction } = useConfirmDialog();
const { notifySuccess } = useSnackbar();

const clearLeads = async () => {
  if (await confirmAction({ title: 'Clear all stored leads?', confirmText: 'Clear' })) {
    await db.transaction('rw', db.leads, db.leadPositionRelations, async () => {
      await db.leads.clear();
      await db.leadPositionRelations.clear();
    });
    selectedLeadUrns.value = new Set();
    notifySuccess('Leads cleared.');
  }
};

const clearSelectedLeads = async () => {
  const urns = Array.from(selectedLeadUrns.value);
  if (urns.length === 0) return;
  if (await confirmAction({ title: `Clear ${urns.length} selected leads?`, confirmText: 'Clear' })) {
    await db.transaction('rw', db.leads, db.leadPositionRelations, async () => {
      await db.leads.bulkDelete(urns);
      await db.leadPositionRelations.where('leadUrn').anyOf(urns).delete();
    });
    selectedLeadUrns.value = new Set();
    notifySuccess(`${urns.length} leads cleared.`);
  }
};

const clearCompanies = async () => {
  if (await confirmAction({ title: 'Clear all stored companies?', confirmText: 'Clear' })) {
    await db.companies.clear();
    selectedCompanyUrns.value = new Set();
    notifySuccess('Companies cleared.');
  }
};

const clearSelectedCompanies = async () => {
  const urns = Array.from(selectedCompanyUrns.value);
  if (urns.length === 0) return;
  if (await confirmAction({ title: `Clear ${urns.length} selected companies?`, confirmText: 'Clear' })) {
    await db.companies.bulkDelete(urns);
    selectedCompanyUrns.value = new Set();
    notifySuccess(`${urns.length} companies cleared.`);
  }
};

const clearSearchSessions = async () => {
  if (await confirmAction({ title: 'Clear all stored search sessions?', confirmText: 'Clear' })) {
    await db.searchSessions.clear();
    selectedSearchSessionIds.value = new Set();
    notifySuccess('Search sessions cleared.');
  }
};

const clearSelectedSearchSessions = async () => {
  const ids = Array.from(selectedSearchSessionIds.value);
  if (ids.length === 0) return;
  if (await confirmAction({ title: `Clear ${ids.length} selected search sessions?`, confirmText: 'Clear' })) {
    await db.searchSessions.bulkDelete(ids);
    selectedSearchSessionIds.value = new Set();
    notifySuccess(`${ids.length} search sessions cleared.`);
  }
};

const showDetailModal = ref(false);
const selectedEntity = ref<Lead | Company | SearchSession | null>(null);

const openDetail = (entity: Lead | Company | SearchSession) => {
  selectedEntity.value = entity;
  showDetailModal.value = true;
};

const showRelationModal = ref(false);
const selectedLeadForRelation = ref<Lead | null>(null);

const openRelationModal = (lead: Lead) => {
  selectedLeadForRelation.value = lead;
  showRelationModal.value = true;
};
</script>

<template>
  <div>
    <CapturedDataRetentionSettings />

    <v-btn-toggle
      v-model="activeTab"
      mandatory
      divided
      color="#0073b1"
      class="mb-4 d-flex"
    >
      <v-btn
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :variant="$vuetify.theme.current.dark ? undefined : 'outlined'"
        :style="`width: calc(100% / ${tabs.length})`"
      >
        {{ tab.title }}
        <template #append>
          <v-badge v-if="tab.badge" :content="tab.badge" color="primary" class="ml-3"></v-badge>
        </template>
      </v-btn>
    </v-btn-toggle>

    <v-card>
      <div class="px-4 py-3">
        <v-text-field
          v-model="searchQuery"
          label="Search by name, title, company, etc."
          rounded
          flat
          variant="solo-filled"
          autocomplete="none"
          clearable
          prepend-inner-icon="mdi-magnify"
          hide-details
        />
      </div>

      <v-divider></v-divider>

      <v-card-text>
        <div v-if="activeTab === 'leads'" class="nested-tab-content">
          <div class="actions mb-3">
            <v-checkbox v-model="allLeadsSelected" label="Select All" hide-details density="compact" color="#0073b1" />
            <div class="flex-spacer"></div>
            <v-btn
              color="error"
              variant="outlined"
              size="small"
              class="mr-2"
              :disabled="selectedLeadUrns.size === 0"
              @click="clearSelectedLeads"
            >
              Clear Selected ({{ selectedLeadUrns.size }})
            </v-btn>
            <v-btn
              color="error"
              size="small"
              :disabled="leadsCount === 0"
              @click="clearLeads"
            >
              Clear All
            </v-btn>
          </div>

          <div v-if="leads.length > 0" class="entity-list">
            <LeadPreviewList
              :leads="paginatedLeads"
              :selected-urns="selectedLeadUrns"
              show-expiration
              @update:selected="toggleLeadSelection"
            >
              <template #actions="{ lead }">
                <v-menu
                  transition="scale-transition"
                  contained
                  @click.stop
                >
                  <template #activator="{ props }">
                    <v-btn
                      icon="mdi-dots-vertical"
                      density="comfortable"
                      v-bind="props"
                      variant="text"
                    />
                  </template>

                  <v-list density="compact">
                    <v-list-item
                      prepend-icon="mdi-note-text-outline"
                      @click.stop="openDetail(lead as Lead)"
                    >
                      <v-list-item-title>View full info</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      prepend-icon="mdi-link-edit"
                      @click.stop="openRelationModal(lead as Lead)"
                    >
                      <v-list-item-title>Edit relations</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </LeadPreviewList>

            <v-pagination
              v-model="leadsPage"
              :length="Math.ceil(leadsCount / PAGE_SIZE)"
              :total-visible="5"
              density="compact"
              class="mt-4"
            ></v-pagination>
          </div>
          <div v-else class="empty-state">
            No leads stored.
          </div>
        </div>

        <div v-else-if="activeTab === 'companies'" class="nested-tab-content">
          <div class="actions mb-3">
            <v-checkbox v-model="allCompaniesSelected" label="Select All" hide-details density="compact" color="#0073b1" />

            <div class="view-options">
              <span class="view-label mr-2">View:</span>
              <v-btn-toggle
                v-model="companyViewMode"
                mandatory
                density="compact"
                variant="outlined"
                color="#0073b1"
              >
                <v-btn value="dense" size="x-small">Compact</v-btn>
                <v-btn value="detailed" size="x-small">Detailed</v-btn>
              </v-btn-toggle>
            </div>

            <div class="flex-spacer"></div>
            <v-btn
              color="error"
              variant="outlined"
              size="small"
              class="mr-2"
              :disabled="selectedCompanyUrns.size === 0"
              @click="clearSelectedCompanies"
            >
              Clear Selected ({{ selectedCompanyUrns.size }})
            </v-btn>
            <v-btn
              color="error"
              size="small"
              :disabled="companiesCount === 0"
              @click="clearCompanies"
            >
              Clear All
            </v-btn>
          </div>

          <div v-if="companies.length > 0" class="entity-list">
            <div class="company-list">
              <template v-for="(company, index) in paginatedCompanies" :key="company.entityUrn">
                <CompanyPreview
                  :company="company"
                  selectable
                  :dense="isCompaniesDense"
                  :selected="selectedCompanyUrns.has(company.entityUrn)"
                  show-expiration
                  @update:selected="(val) => toggleCompanySelection(company.entityUrn, val)"
                >
                  <template #actions="{ company: slotCompany }">
                    <v-menu
                      transition="scale-transition"
                      contained
                      @click.stop
                    >
                      <template #activator="{ props }">
                        <v-btn
                          icon="mdi-dots-vertical"
                          density="comfortable"
                          v-bind="props"
                          variant="text"
                        />
                      </template>

                      <v-list density="compact">
                        <v-list-item
                          prepend-icon="mdi-note-text-outline"
                          @click.stop="openDetail(slotCompany as Company)"
                        >
                          <v-list-item-title>View full info</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </template>
                </CompanyPreview>

                <template v-if="index < paginatedCompanies.length - 1">
                  <div v-if="isCompaniesDense" class="pt-2"></div>
                  <v-divider v-else class="my-1" />
                </template>
              </template>
            </div>

            <v-pagination
              v-model="companiesPage"
              :length="Math.ceil(companiesCount / PAGE_SIZE)"
              :total-visible="5"
              density="compact"
              class="mt-4"
            ></v-pagination>
          </div>
          <div v-else class="empty-state">
            No companies stored.
          </div>
        </div>

        <div v-else-if="activeTab === 'searchSessions'" class="nested-tab-content">
          <div class="actions mb-3">
            <v-checkbox v-model="allSearchSessionsSelected" label="Select All" hide-details density="compact" color="#0073b1" />
            <div class="flex-spacer"></div>
            <v-btn
              color="error"
              variant="outlined"
              size="small"
              class="mr-2"
              :disabled="selectedSearchSessionIds.size === 0"
              @click="clearSelectedSearchSessions"
            >
              Clear Selected ({{ selectedSearchSessionIds.size }})
            </v-btn>
            <v-btn
              color="error"
              size="small"
              :disabled="searchSessionsCount === 0"
              @click="clearSearchSessions"
            >
              Clear All
            </v-btn>
          </div>

          <div v-if="searchSessions.length > 0" class="entity-list">
            <div class="search-session-list">
              <template v-for="(searchSession, index) in paginatedSearchSessions" :key="searchSession.id">
                <SearchSessionPreview
                  :search-session="searchSession"
                  selectable
                  :selected="selectedSearchSessionIds.has(searchSession.id)"
                  show-expiration
                  @update:selected="(val) => toggleSearchSessionSelection(searchSession.id, val)"
                >
                  <template #actions="{ searchSession: slotSearchSession }">
                    <v-btn
                      density="comfortable"
                      icon="mdi-note-text-outline"
                      variant="text"
                      title="View full info"
                      @click.stop="openDetail(slotSearchSession as SearchSession)"
                    />
                  </template>
                </SearchSessionPreview>
                <v-divider v-if="index < paginatedSearchSessions.length - 1" class="my-1" />
              </template>
            </div>

            <v-pagination
              v-model="searchSessionsPage"
              :length="Math.ceil(searchSessionsCount / PAGE_SIZE)"
              :total-visible="5"
              density="compact"
              class="mt-4"
            ></v-pagination>
          </div>
          <div v-else class="empty-state">
            No search sessions stored.
          </div>
        </div>

        <div v-else-if="activeTab === 'connection_requests'" class="nested-tab-content">
          <v-row>
            <v-col>
              <v-list>
                <v-list-subheader>Connection requests</v-list-subheader>
              </v-list>
            </v-col>
            <v-divider vertical />
            <v-col>
              <v-switch
                label="Autosave to CRM on connection request captured"
              />
              <v-switch
                label="Change status in CRM on connection request accepted"
                persistent-hint
                messages="visible"
              >
                <template #message>
                  Only changes status from <b>Request sent</b> to <b>Accepted</b>
                </template>
              </v-switch>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>

    <EntityDetailModal
      v-model="showDetailModal"
      :entity="selectedEntity"
      show-expiration
    />

    <LeadPositionRelationModal
      v-model="showRelationModal"
      :lead="selectedLeadForRelation"
    />
  </div>
</template>

<style scoped>
.nested-tab-content {
  display: flex;
  flex-direction: column;
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.flex-spacer {
  flex: 1;
}

.view-options {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-left: 12px;
  border-left: 1px solid #eee;
}

.view-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}

.company-list,
.search-session-list {
  display: flex;
  flex-direction: column;
}

.empty-state {
  text-align: center;
  padding: 24px;
  color: #999;
  background: #fafafa;
  border-radius: 4px;
}
</style>
