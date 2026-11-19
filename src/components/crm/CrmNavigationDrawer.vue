<script setup lang="ts">
import AccountMenu from '@/components/common/layout/AccountMenu.vue';

const navigation = [
  {
    groupName: 'Workspace',
    items: [
      { title: 'Home', icon: 'mdi-home-outline', to: '/' },
      { title: 'Calendar', icon: 'mdi-calendar-month-outline', to: '/calendar' },
      { title: 'Tasks', icon: 'mdi-check-circle-outline', to: '/tasks' },
      { title: 'Actions', icon: 'mdi-lightning-bolt-outline', to: '/actions' },
      { title: 'Signals', icon: 'mdi-radar', to: '/signals' },
    ],
  },
  {
    groupName: 'Engage',
    items: [
      { title: 'Messaging', icon: 'mdi-message-outline', to: '/messaging' },
      { title: 'Sequences', icon: 'mdi-format-list-numbered', to: '/sequences' },
      { title: 'Workflows', icon: 'mdi-graph-outline', to: '/workflows' },
      { title: 'Activity', icon: 'mdi-timeline-text-outline', to: '/activity' },
    ],
  },
  {
    groupName: 'Data',
    items: [
      { title: 'Leads', icon: 'mdi-account-multiple-outline', to: '/leads' },
      { title: 'Accounts', icon: 'mdi-domain', to: '/accounts' },
      { title: 'Deals', icon: 'mdi-handshake-outline', to: '/deals' },
      { title: 'Segments', icon: 'mdi-tag-multiple-outline', to: '/segments' },
    ],
  },
  {
    groupName: 'Tools',
    items: [
      { title: 'AI', icon: 'mdi-auto-fix', to: '/ai' },
      { title: 'Integrations', icon: 'mdi-connection', to: '/integrations' },
    ],
  },
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

    <v-list
      v-for="group in navigation"
      :key="group.groupName"
      nav
      class="px-3"
    >
      <v-list-subheader>{{ group.groupName }}</v-list-subheader>
      <v-list-item
        v-for="item in group.items"
        :key="item.to"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        density="compact"
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
