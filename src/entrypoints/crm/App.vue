<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { VLoadingIndicator } from 'vuetify/labs/VLoadingIndicator';
import SignInView from '@/components/common/views/SignInView.vue';
import CrmNavigationDrawer from '@/components/crm/CrmNavigationDrawer.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import AppSnackbarQueue from '@/components/common/AppSnackbarQueue.vue';
import { useDataStore } from '@/store/data-store';
import { useAppTheme } from '@/composables/useTheme';

const { user, loading } = useAuth();
const { isLoaded, loadData } = useDataStore();
const { initTheme } = useAppTheme();

void loadData();
initTheme();
</script>

<template>
  <v-app class="crm-app">
    <v-container v-if="loading || !isLoaded" class="crm-loading" fluid>
      <v-progress
        details-position="bottom"
        hide-value
        indeterminate
      >
        <v-loading-indicator
          aria-hidden="true"
          color="primary"
          shape-size="58%"
          size="70"
          contained
        />
        <template #label>
          <span class="text-body-large mt-3">Loading...</span>
        </template>
      </v-progress>
    </v-container>

    <SignInView v-else-if="!user" />

    <template v-else>
      <CrmNavigationDrawer />
      <v-main>
        <router-view />
      </v-main>
    </template>
    <ConfirmDialog />
    <AppSnackbarQueue />
  </v-app>
</template>

<style>
.crm-loading { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
</style>
