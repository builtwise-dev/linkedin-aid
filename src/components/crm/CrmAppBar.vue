<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbs = computed(() => [
  { title: 'Workspace' },
  { title: String(route.meta.title || 'CRM'), disabled: true },
]);
</script>

<template>
  <v-app-bar flat color="surface" class="crm-app-bar">
    <v-breadcrumbs :items="breadcrumbs" />
    <v-spacer />
    <v-btn icon="mdi-open-in-new" variant="text" href="https://www.linkedin.com" target="_blank" aria-label="Open LinkedIn" class="mr-2" />
  </v-app-bar>
</template>

<style scoped>
.crm-app-bar { border-bottom: 1px solid #e8edf3; }
</style>
