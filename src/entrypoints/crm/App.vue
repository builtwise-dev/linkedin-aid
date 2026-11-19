<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import SignInView from '@/components/common/views/SignInView.vue';
import CrmNavigationDrawer from '@/components/crm/CrmNavigationDrawer.vue';
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
    <v-container v-if="loading || !isLoaded" class="crm-loading" fluid><v-progress-circular indeterminate color="primary" /></v-container>
    <SignInView v-else-if="!user" />
    <template v-else>
      <CrmNavigationDrawer />
      <v-main>
        <v-container class="crm-content" fluid>
          <router-view />
        </v-container>
      </v-main>
    </template>
  </v-app>
</template>

<style>
.crm-content { max-width: 1440px; padding: 36px 40px 56px; }
.crm-loading { min-height: 100vh; display: flex; align-items: center; justify-content: center; }

@media (max-width: 900px) {
  .crm-content {
    padding: 24px 20px 40px;
  }
}
</style>
