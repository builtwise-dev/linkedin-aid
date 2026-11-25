<script setup lang="ts">
import CrmPageHeading from '@/components/crm/CrmPageHeading.vue';
import CrmEntitiesPage from './CrmEntitiesPage.vue';
withDefaults(defineProps<{ kind?: 'people' | 'companies' }>(), { kind: 'people' });
</script>

<template>
  <v-container>
    <CrmPageHeading :eyebrow="kind === 'people' ? 'PEOPLE' : 'ORGANIZATIONS'" :title="kind === 'people' ? 'People' : 'Companies'" :description="kind === 'people' ? 'Track lifecycle, LinkedIn connection, and outreach separately for each person.' : 'Track company lifecycle separately from target, active account, or partner classification.'" />
    <CrmEntitiesPage :kind="kind" />
  </v-container>
</template>
