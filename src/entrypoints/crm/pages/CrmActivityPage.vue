<script setup lang="ts">
import SettingsCrmInteractionsTab from '@/entrypoints/settings/pages/crm/SettingsCrmInteractionsTab.vue';
import CrmPageHeading from '@/components/crm/CrmPageHeading.vue';
</script>

<template>
  <v-container class="pa-0" fluid>
    <CrmPageHeading eyebrow="FOLLOW-UPS" title="Activity" description="Review your interactions, tasks, and notes." />
    <SettingsCrmInteractionsTab />
  </v-container>
</template>
