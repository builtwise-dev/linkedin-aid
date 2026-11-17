<script setup lang="ts">
import CrmPageHeading from '@/components/crm/CrmPageHeading.vue';
</script>

<template>
  <v-container class="pa-0" fluid>
    <CrmPageHeading eyebrow="WORKSPACE TOOLS" title="Signals" description="Choose the buying signals you want to follow." />
    <v-card title="Signals Configuration" class="mb-4">
      <v-card-text>
        <div class="placeholder-content">
          Signals monitoring and trigger settings will be available here soon. B2B Sales & Buying Signals and more
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
