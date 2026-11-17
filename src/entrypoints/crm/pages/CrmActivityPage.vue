<script setup lang="ts">
import CrmPageHeading from '@/components/crm/CrmPageHeading.vue';
import CrmInteractionsPage from './CrmInteractionsPage.vue';
</script>

<template>
  <v-container class="pa-0" fluid>
    <CrmPageHeading eyebrow="FOLLOW-UPS" title="Activity" description="Review your interactions, tasks, and notes." />
    <CrmInteractionsPage />
  </v-container>
</template>
