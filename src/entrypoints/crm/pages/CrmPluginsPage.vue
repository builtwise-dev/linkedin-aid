<script setup lang="ts">
import CrmPageHeading from '@/components/crm/CrmPageHeading.vue';

const plugins = [
  {
    id: 'attach-ai-chat-link',
    name: 'Attach AI chat link',
    description: 'Attach useful AI conversations and web pages to recent leads from the popup CRM tab.',
    icon: 'mdi-link-variant-plus',
    status: 'Preview',
  },
];
</script>

<template>
  <v-container>
    <CrmPageHeading
      eyebrow="WORKSPACE TOOLS"
      title="Plugins"
      description="Extend your CRM with focused tools for your daily workflow."
    />

    <div class="plugin-list">
      <v-card
        v-for="plugin in plugins"
        :key="plugin.id"
        :to="`/plugins/${plugin.id}`"
        class="plugin-card"
        rounded="xl"
        elevation="0"
        aria-label="Open Attach AI chat link plugin"
      >
        <v-card-text class="pa-5">
          <div class="d-flex align-start justify-space-between ga-3 mb-5">
            <v-avatar size="42" rounded="lg" class="plugin-icon">
              <v-icon :icon="plugin.icon" size="23" />
            </v-avatar>
            <v-chip size="x-small" variant="tonal" color="primary">{{ plugin.status }}</v-chip>
          </div>
          <h2 class="text-subtitle-1 font-weight-bold mb-1">{{ plugin.name }}</h2>
          <p class="plugin-description">{{ plugin.description }}</p>
          <div class="d-flex align-center text-primary text-body-2 font-weight-medium mt-5">
            View plugin <v-icon icon="mdi-arrow-right" size="16" class="ml-1" />
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<style scoped>
.plugin-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(240px, 1fr));
  gap: 12px;
}

.plugin-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface));
  text-decoration: none;
}

.plugin-icon {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
}

.plugin-description {
  color: rgba(var(--v-theme-on-surface), 0.68);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}
</style>
