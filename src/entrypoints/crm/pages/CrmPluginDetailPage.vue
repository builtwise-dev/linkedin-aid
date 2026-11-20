<script setup lang="ts">
import { ref } from 'vue';
import CrmPageHeading from '@/components/crm/CrmPageHeading.vue';

defineProps<{ id: string }>();

const enabled = ref(false);
const domains = ref(['chatgpt.com', 'claude.ai', 'gemini.google.com']);
const domainInput = ref('');
const domainError = ref('');

function addDomain() {
  const value = domainInput.value.trim().replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();
  if (!value) return;
  if (!/^(\*\.)?[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(value)) {
    domainError.value = 'Enter a valid domain, such as example.com.';
    return;
  }
  if (!domains.value.includes(value)) domains.value.push(value);
  domainInput.value = '';
  domainError.value = '';
}

function removeDomain(domain: string) {
  domains.value = domains.value.filter(item => item !== domain);
}
</script>

<template>
  <v-container v-if="id === 'attach-ai-chat-link'">
    <CrmPageHeading
      eyebrow="WORKSPACE TOOLS"
      title="Attach AI chat link"
      description="Keep useful AI conversations connected to the people in your CRM."
    >
      <template #actions>
        <v-btn to="/plugins" variant="text" prepend-icon="mdi-arrow-left">All plugins</v-btn>
      </template>
    </CrmPageHeading>

    <v-alert class="prototype-note mb-6" type="info" variant="tonal" rounded="lg" density="comfortable">
      Plugin settings are a preview. Your changes are not saved yet.
    </v-alert>

    <v-card class="plugin-card mb-6" rounded="xl" elevation="0">
      <v-card-text class="pa-0">
        <div class="plugin-header pa-6">
          <div class="d-flex align-start ga-4">
            <v-avatar size="52" rounded="xl" class="plugin-avatar">
              <v-icon icon="mdi-link-variant-plus" size="27" />
            </v-avatar>
            <div class="flex-grow-1">
              <div class="d-flex align-center flex-wrap ga-2 mb-1">
                <h2 class="text-h6 font-weight-bold">Attach AI chat link</h2>
                <v-chip size="x-small" variant="tonal" color="primary">CRM plugin</v-chip>
              </div>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Keep useful AI conversations connected to the people in your CRM.
              </p>
            </div>
            <v-switch
              v-model="enabled"
              color="primary"
              hide-details
              inset
              :label="enabled ? 'Enabled' : 'Disabled'"
              class="plugin-switch"
              aria-label="Enable Attach AI chat link plugin"
            />
          </div>
        </div>

        <v-divider />

        <div class="pa-6">
          <div class="text-subtitle-2 font-weight-bold mb-3">What this plugin adds</div>
          <div class="feature-list">
            <div class="feature-row">
              <v-icon icon="mdi-dock-window" color="primary" size="20" />
              <span>New content and functionality in the popup CRM tab.</span>
            </div>
            <div class="feature-row">
              <v-icon icon="mdi-link-plus" color="primary" size="20" />
              <span>On supported sites, attach the current chat or page link to a recent lead.</span>
            </div>
            <div class="feature-row">
              <v-icon icon="mdi-form-textbox" color="primary" size="20" />
              <span>Automatically add the lead fields needed to store attached links.</span>
            </div>
          </div>

          <v-card class="domains-card mt-6" rounded="lg" variant="tonal">
            <v-card-text class="pa-5">
              <div class="d-flex align-start justify-space-between flex-wrap ga-3 mb-1">
                <div>
                  <div class="text-subtitle-2 font-weight-bold">Supported websites</div>
                  <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
                    Choose where the attach link action appears. Add any custom domain.
                  </p>
                </div>
                <v-chip size="small" variant="outlined">{{ domains.length }} domains</v-chip>
              </div>

              <div class="domain-chips mt-4" aria-label="Supported domains">
                <v-chip
                  v-for="domain in domains"
                  :key="domain"
                  closable
                  size="small"
                  variant="outlined"
                  @click:close="removeDomain(domain)"
                >
                  {{ domain }}
                </v-chip>
                <span v-if="domains.length === 0" class="text-body-2 text-medium-emphasis">No domains added yet.</span>
              </div>

              <v-form class="add-domain-form mt-4" @submit.prevent="addDomain">
                <v-text-field
                  v-model="domainInput"
                  label="Custom domain"
                  placeholder="example.com"
                  prepend-inner-icon="mdi-web"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  :error-messages="domainError"
                />
                <v-btn type="submit" color="primary" variant="tonal" height="48" prepend-icon="mdi-plus">
                  Add domain
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>

          <div class="fields-preview mt-6">
            <div class="text-subtitle-2 font-weight-bold mb-1">Lead fields added by this plugin</div>
            <p class="text-body-2 text-medium-emphasis mb-3">These fields will appear on a lead when the plugin is installed.</p>
            <div class="field-row">
              <span class="text-body-2">AI chat links</span>
              <v-chip size="x-small" variant="tonal">Link list</v-chip>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <div class="text-caption text-medium-emphasis">
      The plugin controls are a UI prototype; enabling and domain changes currently stay in this page session.
    </div>
  </v-container>
  <v-container v-else>
    <CrmPageHeading eyebrow="WORKSPACE TOOLS" title="Plugin not found" description="This plugin is not available." />
    <v-btn to="/plugins" variant="text" prepend-icon="mdi-arrow-left">All plugins</v-btn>
  </v-container>
</template>

<style scoped>
.prototype-note {
  max-width: 760px;
}

.plugin-card {
  max-width: 760px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface));
}

.plugin-header {
  background: rgba(var(--v-theme-primary), 0.035);
}

.plugin-avatar {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
}

.plugin-switch {
  flex: 0 0 auto;
}

.feature-list {
  display: grid;
  gap: 14px;
}

.feature-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: rgba(var(--v-theme-on-surface), 0.82);
  font-size: 0.9rem;
  line-height: 1.5;
}

.feature-row .v-icon {
  flex: 0 0 auto;
  margin-top: 1px;
}

.domains-card {
  background: rgba(var(--v-theme-on-surface), 0.035);
}

.domain-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.add-domain-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 10px;
}

.field-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 10px;
  padding: 12px 14px;
}

@media (max-width: 600px) {
  .plugin-header :deep(.v-card-text) {
    padding: 20px !important;
  }

  .plugin-switch {
    margin-right: -8px;
  }

  .add-domain-form {
    grid-template-columns: 1fr;
  }
}
</style>
