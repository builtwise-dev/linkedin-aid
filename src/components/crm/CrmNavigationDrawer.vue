<script setup lang="ts">
import { ref, watch } from 'vue';
import CrmAccountMenu from '@/components/crm/CrmAccountMenu.vue';

const emit = defineEmits<{ openCommandPalette: [] }>();
const hotkeysStorageKey = 'crm.showHotkeys';
const showHotkeys = ref(localStorage.getItem(hotkeysStorageKey) !== 'false');

watch(showHotkeys, (value) => localStorage.setItem(hotkeysStorageKey, String(value)));

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
        :variant="$vuetify.theme.current.dark ? 'tonal' : undefined"
        :class="{ 'justify-space-between': showHotkeys }"
        @click="emit('openCommandPalette')"
      >
        Search CRM
        <template #append>
          <v-hotkey v-if="showHotkeys" keys="cmd+k" display-mode="icon" platform="auto" />
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
        <template v-if="item.hotkey && showHotkeys" #append>
          <v-hotkey :keys="item.hotkey" display-mode="icon" platform="auto" />
        </template>
      </v-list-item>
    </v-list>

    <template #append>
      <v-divider />
      <v-list nav>
        <CrmAccountMenu v-model:show-hotkeys="showHotkeys" />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>
