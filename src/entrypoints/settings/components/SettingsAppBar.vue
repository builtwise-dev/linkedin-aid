<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';

const { user, logout } = useAuth();
</script>

<template>
  <v-app-bar>
    <v-avatar :rounded="false" size="32" class="ml-5">
      <v-img src="/logo.svg" />
    </v-avatar>
    <v-app-bar-title tag="h1" class="app-bar-title-text">
      LinkedIn AID Settings
    </v-app-bar-title>

    <v-spacer />

    <v-menu v-if="user">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          variant="text"
          size="large"
          rounded
          class="mr-5 text-none"
          aria-label="Open profile menu"
        >
          <v-avatar size="32" color="#0073b1" class="mr-2">
            <v-img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName || 'User'" />
            <v-icon v-else icon="mdi-account" color="white" size="20" />
          </v-avatar>
          <span class="text-body-2 font-weight-medium">
            {{ user.displayName || user.email }}
          </span>
          <v-icon end icon="mdi-chevron-down" />
        </v-btn>
      </template>

      <v-list density="compact">
        <v-list-subheader>Profile</v-list-subheader>
        <v-list-item base-color="error" prepend-icon="mdi-logout" title="Sign out" @click="logout" />
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<style scoped>
.app-bar-title-text {
  color: #0073b1;
  font-weight: bold;
}
</style>
