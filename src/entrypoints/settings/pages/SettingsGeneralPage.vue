<script lang="ts" setup>
import { browser } from 'wxt/browser';
import { useAuth } from '@/composables/useAuth';
import DeleteAccountDialog from '@/entrypoints/settings/components/DeleteAccountDialog.vue';

const { user } = useAuth();

const resetSettings = async () => {
  if (confirm('Are you sure you want to reset all settings?')) {
    await browser.storage.local.remove(['copyLeadSettings', 'bulkCopyLeadSettings', 'capturedEntitiesTTL', 'theme']);
    alert('Settings reset.');
  }
};
</script>

<template>
  <div>
    <v-card title="Profile" class="mb-4">
      <v-card-text>
        <template v-if="user">
          <div class="d-flex align-center justify-space-between flex-wrap ga-4">
            <div class="d-flex align-center ga-3">
              <v-avatar size="44" color="#0073b1">
                <v-img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName || 'User'" />
                <v-icon v-else icon="mdi-account" color="white" size="28" />
              </v-avatar>
              <div>
                <div class="text-subtitle-1 font-weight-medium">
                  {{ user.displayName || 'Authorized User' }}
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  {{ user.email }}
                </div>
              </div>
            </div>
            <DeleteAccountDialog>
              <template #activator="{ props }">
                <v-btn v-bind="props" variant="outlined" color="error" prepend-icon="mdi-account-remove">
                  Delete account
                </v-btn>
              </template>
            </DeleteAccountDialog>
          </div>
        </template>
        <div v-else class="placeholder-content">
          Profile settings will be available here soon.
        </div>
      </v-card-text>
    </v-card>

    <v-card title="Subscription" class="mb-4">
      <v-card-text>
        <div class="placeholder-content">
          Subscription management will be available here soon.
        </div>
      </v-card-text>
    </v-card>

    <v-card title="Maintenance">
      <v-card-text>
        <v-btn
          color="error"
          @click="resetSettings"
        >
          Reset All Settings
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.placeholder-content {
  color: #64748b;
  font-size: 0.85rem;
  font-style: italic;
}
</style>
