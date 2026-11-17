<script setup lang="ts">
import SettingsCrmEntitiesPage from '@/entrypoints/settings/pages/crm/SettingsCrmEntitiesPage.vue';
import CrmPageHeading from '@/components/crm/CrmPageHeading.vue';
</script>

<template>
  <v-container class="pa-0" fluid>
    <CrmPageHeading eyebrow="PEOPLE & ORGANIZATIONS" title="Leads & companies" description="Your saved LinkedIn leads, companies, and CRM tags." />
    <SettingsCrmEntitiesPage />
  </v-container>
</template>
