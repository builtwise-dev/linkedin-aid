<script setup lang="ts">
import AccountMenu from '@/components/common/layout/AccountMenu.vue';

const emit = defineEmits<{ openCommandPalette: [] }>();

const navigation = [
  {
    groupName: 'Workspace',
    items: [
      { title: 'Home', icon: 'mdi-home-outline', to: '/', hotkey: 'g-h' },
      { title: 'Calendar', icon: 'mdi-calendar-month-outline', to: '/calendar' },
      { title: 'Tasks', icon: 'mdi-check-circle-outline', to: '/tasks', hotkey: 'g-t' },
      { title: 'Actions', icon: 'mdi-lightning-bolt-outline', to: '/actions' },
    ],
  },
  {
    groupName: 'Engage',
    items: [
      { title: 'Messaging', icon: 'mdi-message-outline', to: '/messaging' },
      { title: 'Sequences', icon: 'mdi-format-list-numbered', to: '/sequences' },
      { title: 'Workflows', icon: 'mdi-graph-outline', to: '/workflows' },
      { title: 'Activity', icon: 'mdi-timeline-text-outline', to: '/activity', hotkey: 'g-a' },
    ],
  },
  {
    groupName: 'Data',
    items: [
      { title: 'People', icon: 'mdi-account-multiple-outline', to: '/people', hotkey: 'g-p' },
      { title: 'Companies', icon: 'mdi-domain', to: '/companies', hotkey: 'g-c' },
      { title: 'Deals', icon: 'mdi-handshake-outline', to: '/deals', hotkey: 'g-d' },
      { title: 'Segments', icon: 'mdi-tag-multiple-outline', to: '/segments' },
    ],
  },
  {
    groupName: 'Tools',
    items: [
      { title: 'AI', icon: 'mdi-auto-fix', to: '/ai' },
      { title: 'Plugins', icon: 'mdi-puzzle-outline', to: '/plugins' },
      { title: 'Integrations', icon: 'mdi-connection', to: '/integrations' },
    ],
  },
];
</script>

<template>
  <v-navigation-drawer width="264" color="surface">
    <v-list-item class="px-6 py-4">
      <template #prepend>
        <v-avatar color="primary" rounded="lg" size="40"><v-icon icon="mdi-linkedin" color="white" /></v-avatar>
      </template>
      <v-list-item-title class="text-subtitle-1 font-weight-bold">LinkedIn AID</v-list-item-title>
      <v-list-item-subtitle>CRM workspace</v-list-item-subtitle>
    </v-list-item>

    <v-divider />

    <div class="px-3 pt-3 pb-2">
      <v-btn
        block
        prepend-icon="mdi-magnify"
        class="justify-space-between"
        @click="emit('openCommandPalette')"
      >
        Search CRM
        <template #append>
          <v-hotkey keys="cmd+k" display-mode="icon" platform="auto" />
        </template>
      </v-btn>
    </div>

    <v-list
      v-for="group in navigation"
      :key="group.groupName"
      nav
    >
      <v-list-subheader>{{ group.groupName }}</v-list-subheader>
      <v-list-item
        v-for="item in group.items"
        :key="item.to"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        :lines="false"
        density="comfortable"
        color="primary"
      >
        <template v-if="item.hotkey" #append>
          <v-hotkey :keys="item.hotkey" display-mode="icon" platform="auto" />
        </template>
      </v-list-item>
    </v-list>

    <template #append>
      <v-divider />
      <v-list nav>
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
            <v-divider class="mt-1" />
          </template>
        </AccountMenu>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>
