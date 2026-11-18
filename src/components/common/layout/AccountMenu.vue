<script setup lang="ts">
import { computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useDataStore } from '@/store/data-store';
import { storageService } from '@/services/storage-service';

const { user, logout } = useAuth();
const { theme } = useDataStore();

const selectedTheme = computed({
  get: () => theme.value,
  set: (value: 'light' | 'dark' | 'system') => storageService.setLocal({ theme: value }),
});

const themeOptions = [
  { label: 'Light', value: 'light', icon: 'mdi-white-balance-sunny' },
  { label: 'Dark', value: 'dark', icon: 'mdi-moon-waning-crescent' },
  { label: 'System', value: 'system', icon: 'mdi-monitor' },
];
</script>

<template>
  <v-menu v-if="user" :close-on-content-click="false">
    <template #activator="{ props }">
      <slot name="activator" :props="props" :user="user">
        <v-btn v-bind="props" variant="text" size="large" rounded class="text-none" aria-label="Open profile menu">
          <v-avatar size="32" color="primary" class="mr-2">
            <v-img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName || 'User'" />
            <v-icon v-else icon="mdi-account" color="white" size="20" />
          </v-avatar>
          <span class="text-body-2 font-weight-medium">{{ user.displayName || user.email }}</span>
          <v-icon end icon="mdi-chevron-down" />
        </v-btn>
      </slot>
    </template>
    <v-list min-width="250">
      <v-list-subheader>Theme</v-list-subheader>
      <v-btn-toggle
        v-model="selectedTheme"
        mandatory
        divided
        color="primary"
        variant="outlined"
        class="d-flex px-2 pb-2"
        aria-label="Choose theme"
      >
        <v-btn v-for="option in themeOptions" :key="option.value" :value="option.value" :title="option.label" :aria-label="option.label" size="small" class="flex-grow-1">
          <v-icon>{{ option.icon }}</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-divider class="my-2" />
      <v-list-item base-color="error" prepend-icon="mdi-logout" title="Sign out" @click="logout" />
    </v-list>
  </v-menu>
</template>
