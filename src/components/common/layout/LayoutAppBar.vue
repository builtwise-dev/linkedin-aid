<script setup lang="ts">
import AccountMenu from '@/components/common/layout/AccountMenu.vue';

defineProps<{
  titleSuffix?: string;
}>();

</script>

<template>
  <v-app-bar>
    <v-avatar :rounded="false" size="32" class="ml-5">
      <v-img src="/logo.svg" />
    </v-avatar>
    <v-app-bar-title tag="h1" class="app-bar-title-text">
      LinkedIn AID <slot name="title-suffix">{{ titleSuffix }}</slot>
    </v-app-bar-title>

    <v-spacer />

    <AccountMenu>
      <template #activator="{ props, user }">
        <v-btn v-bind="props" variant="text" size="large" rounded class="mr-5 text-none" aria-label="Open profile menu">
          <v-avatar size="32" color="primary" class="mr-2">
            <v-img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName || 'User'" />
            <v-icon v-else icon="mdi-account" color="white" size="20" />
          </v-avatar>
          <span class="text-body-2 font-weight-medium">{{ user.displayName || user.email }}</span>
          <v-icon end icon="mdi-chevron-down" />
        </v-btn>
      </template>
    </AccountMenu>
  </v-app-bar>
</template>

<style scoped>
.app-bar-title-text {
  color: #0073b1;
  font-weight: bold;
}
</style>
