<script lang="ts" setup>
import CrmPageHeading from '@/components/crm/CrmPageHeading.vue';
</script>

<template>
  <v-container>
    <CrmPageHeading eyebrow="WORKSPACE TOOLS" title="AI" description="Configure how AI can support your CRM workflow." />
    <v-card title="AI Configuration" class="mb-4">
      <v-card-text>
        <div class="placeholder-content">
          AI assistant configuration and features will be available here soon.
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.placeholder-content {
  color: #64748b;
  font-size: 0.85rem;
  font-style: italic;
}
</style>
