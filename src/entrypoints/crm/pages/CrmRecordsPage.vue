<script setup lang="ts">
import CrmPageHeading from '@/components/crm/CrmPageHeading.vue';
import CrmEntitiesPage from './CrmEntitiesPage.vue';
withDefaults(defineProps<{ kind?: 'leads' | 'accounts' }>(), { kind: 'leads' });
</script>

<template>
  <v-container>
    <CrmPageHeading :eyebrow="kind === 'leads' ? 'PEOPLE' : 'ORGANIZATIONS'" :title="kind === 'leads' ? 'Leads' : 'Accounts'" :description="kind === 'leads' ? 'Manage your saved people and their relationship status.' : 'Manage the companies connected to your CRM relationships.'" />
    <CrmEntitiesPage :kind="kind" />
  </v-container>
</template>
