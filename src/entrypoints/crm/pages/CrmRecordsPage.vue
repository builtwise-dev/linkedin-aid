<script setup lang="ts">
import CrmPageHeading from '@/components/crm/CrmPageHeading.vue';
import CrmEntitiesPage from './CrmEntitiesPage.vue';
</script>

<template>
  <v-container class="pa-0" fluid>
    <CrmPageHeading eyebrow="PEOPLE & ORGANIZATIONS" title="Leads & companies" description="Your saved LinkedIn leads, companies, and CRM tags." />
    <CrmEntitiesPage />
  </v-container>
</template>
