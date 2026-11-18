<script setup lang="ts">
import AccountMenu from '@/components/common/layout/AccountMenu.vue';

const navigation = [
  { title: 'Overview', icon: 'mdi-view-dashboard-outline', to: '/' },
  { title: 'Leads & companies', icon: 'mdi-account-multiple-outline', to: '/records' },
  { title: 'Activity', icon: 'mdi-timeline-text-outline', to: '/activity' },
  { title: 'AI', icon: 'mdi-auto-fix', to: '/ai' },
  { title: 'Signals', icon: 'mdi-radar', to: '/signals' },
];
</script>

<template>
  <v-navigation-drawer width="264" color="surface">
    <v-list-item class="px-6 py-5" height="82">
      <template #prepend>
        <v-avatar color="primary" rounded="lg" size="40"><v-icon icon="mdi-linkedin" color="white" /></v-avatar>
      </template>
      <v-list-item-title class="text-subtitle-1 font-weight-bold">LinkedIn AID</v-list-item-title>
      <v-list-item-subtitle>CRM workspace</v-list-item-subtitle>
    </v-list-item>
    <v-divider />
    <v-list-subheader class="px-6 mt-3">Workspace</v-list-subheader>
    <v-list nav class="px-3 crm-nav">
      <v-list-item
        v-for="item in navigation"
        :key="item.to"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        rounded="lg"
        color="primary"
      />
    </v-list>

    <template #append>
      <v-list nav>
        <v-list-item prepend-icon="mdi-cog-outline" append-icon="mdi-open-in-new" title="Settings" href="settings.html" />
        <v-divider class="mt-1" />
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
        </AccountMenu>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.crm-nav .v-list-item { margin-bottom: 4px; min-height: 46px; }
</style>
