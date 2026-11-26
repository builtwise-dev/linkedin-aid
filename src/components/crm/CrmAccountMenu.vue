<script setup lang="ts">
import AccountMenu from '@/components/common/layout/AccountMenu.vue';

defineProps<{ showHotkeys: boolean }>();
const emit = defineEmits<{ 'update:showHotkeys': [value: boolean] }>();
</script>

<template>
  <AccountMenu location="end" list-min-width="250">
    <template #activator="{ props, user }">
      <v-list-item v-bind="props" rounded="lg">
        <template #prepend>
          <v-avatar size="32" color="primary" variant="tonal">
            <v-img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName || 'User'" />
            <span v-else class="text-caption">{{ (user.displayName || user.email || 'U').slice(0, 1).toUpperCase() }}</span>
          </v-avatar>
        </template>
        <v-list-item-title>{{ user.displayName || 'Your workspace' }}</v-list-item-title>
        <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
      </v-list-item>
    </template>

    <template #list-prepend>
      <v-list-item prepend-icon="mdi-cog-outline" append-icon="mdi-open-in-new" title="Settings" href="settings.html" />
      <v-divider class="my-2" />
      <v-list-item title="Show keybindings">
        <template #append>
          <v-switch
            :model-value="showHotkeys"
            color="primary"
            hide-details
            density="compact"
            aria-label="Show keyboard shortcuts"
            @update:model-value="emit('update:showHotkeys', Boolean($event))"
          />
        </template>
      </v-list-item>
      <v-divider class="mt-2" />
    </template>
  </AccountMenu>
</template>
