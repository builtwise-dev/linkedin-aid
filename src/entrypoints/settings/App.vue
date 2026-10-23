<script lang="ts" setup>
import { useAuth } from '@/composables/useAuth';
import { useDataStore } from '@/store/data-store';
import { useAppTheme } from '@/composables/useTheme';
import SettingsView from '@/entrypoints/settings/views/SettingsView.vue';
import SignInView from '@/entrypoints/settings/views/SignInView.vue';
import SettingsAppBar from '@/entrypoints/settings/components/SettingsAppBar.vue';

const { user, loading: loadingAuth } = useAuth();

const { isLoaded, loadData } = useDataStore();
const { initTheme } = useAppTheme();

loadData();
initTheme();
</script>

<template>
  <v-app id="settings-app">
    <div v-if="!isLoaded || loadingAuth" class="loading">
      Loading Settings...
    </div>
    <template v-else>
      <SettingsAppBar />

      <v-main>
        <SettingsView v-if="user" />
        <SignInView v-else />
      </v-main>
    </template>
  </v-app>
</template>

<style>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
}
</style>

