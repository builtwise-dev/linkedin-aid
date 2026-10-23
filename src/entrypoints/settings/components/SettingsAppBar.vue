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
    <div v-if="user" class="d-flex align-center mr-5 ga-2">
      <v-avatar size="32" color="#0073b1">
        <v-img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName || 'User'" />
        <v-icon v-else icon="mdi-account" color="white" size="20" />
      </v-avatar>
      <span class="text-body-2 font-weight-medium mr-2">
        {{ user.displayName || user.email }}
      </span>
      <v-btn
        variant="text"
        color="error"
        size="small"
        icon="mdi-logout"
        title="Sign Out"
        @click="logout"
      />
    </div>
  </v-app-bar>
</template>

<style scoped>
.app-bar-title-text {
  color: #0073b1;
  font-weight: bold;
}
</style>
