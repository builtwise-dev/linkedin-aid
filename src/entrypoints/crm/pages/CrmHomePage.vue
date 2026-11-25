<script setup lang="ts">
import { computed } from 'vue';
import { useCrmPeople, useCrmCompanies, useCrmTasks } from '@/composables/useCrmData';
import CrmPageHeading from '@/components/crm/CrmPageHeading.vue';
import CrmStatCard from '@/components/crm/CrmStatCard.vue';
import CrmRecentPeople from '@/components/crm/CrmRecentPeople.vue';

const people = useCrmPeople();
const companies = useCrmCompanies();
const tasks = useCrmTasks();
const loading = computed(() => people.loading.value || companies.loading.value || tasks.loading.value);
const cards = computed(() => [
  { title: 'People', value: people.records.value.length, icon: 'mdi-account-multiple-outline', color: 'primary', to: '/people' },
  { title: 'Companies', value: companies.records.value.length, icon: 'mdi-domain', color: 'indigo', to: '/companies' },
  { title: 'Open tasks', value: tasks.records.value.filter((task) => task.status.toLowerCase() !== 'completed').length, icon: 'mdi-checkbox-marked-circle-outline', color: 'teal', to: '/tasks' },
]);
const recentPeople = computed(() => [...people.records.value].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5));
</script>

<template>
  <v-container>
    <CrmPageHeading eyebrow="YOUR PIPELINE" title="Home" description="Keep your people and companies and follow-ups in one place.">
      <template #actions><v-btn color="primary" prepend-icon="mdi-account-multiple-outline" to="/people" rounded="lg">Browse people</v-btn></template>
    </CrmPageHeading>
    <v-alert v-if="people.error.value || companies.error.value || tasks.error.value" type="warning" variant="tonal" rounded="lg" class="mb-5">Some CRM totals could not be loaded. Open records or activity to retry those sections.</v-alert>
    <v-row class="mb-5">
      <v-col v-for="card in cards" :key="card.title" cols="12" sm="6" lg="4">
        <v-card v-if="loading" rounded="xl" class="pa-5 h-100" elevation="0" border>
          <div class="d-flex align-center ga-3">
            <v-skeleton-loader type="avatar" />
            <v-skeleton-loader type="text" class="flex-grow-1" />
          </div>
          <v-skeleton-loader type="heading" class="mt-4" />
        </v-card>
        <CrmStatCard v-else v-bind="card" />
      </v-col>
    </v-row>
    <CrmRecentPeople :people="recentPeople" :loading="loading" />
  </v-container>
</template>
