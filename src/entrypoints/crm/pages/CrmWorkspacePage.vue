<script setup lang="ts">
import CrmPageHeading from '@/components/crm/CrmPageHeading.vue';
const props = defineProps<{ section: string }>();
const descriptions: Record<string, string> = {
  Calendar: 'See your meetings and follow-ups in one place.',
  Messaging: 'Manage conversations with your LinkedIn relationships.',
  Sequences: 'Plan and manage multi-step outreach.',
  Workflows: 'Automate the repeatable parts of your sales process.',
  Actions: 'Recommended next steps for your most important relationships.',
  Deals: 'Track opportunities as they move through your pipeline.',
};
</script>
<template>
  <v-container>
    <CrmPageHeading eyebrow="CRM WORKSPACE" :title="section" :description="descriptions[section]" />
    <v-card rounded="xl" elevation="0" border>
      <v-card-text class="pa-8 text-center">
        <v-avatar color="primary" variant="tonal" size="52" class="mb-4"><v-icon icon="mdi-sparkles" /></v-avatar>
        <div class="text-h6 mb-2">{{ section }} is coming soon</div>
        <div class="text-body-2 text-medium-emphasis">This space is ready for the tools and views that will support your {{ section.toLowerCase() }} workflow.</div>
      </v-card-text>
    </v-card>
  </v-container>
</template>
