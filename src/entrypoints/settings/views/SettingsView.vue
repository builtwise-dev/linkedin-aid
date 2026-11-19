<script lang="ts" setup>
import { ref } from 'vue';
import { browser } from 'wxt/browser';

interface TabItem {
  title: string;
  value: string;
  route: string;
  icon: string;
}

const tabs = ref<TabItem[]>([
  { title: 'General', value: 'general', route: '/', icon: 'mdi-cog-outline' },
  { title: 'Captured data', value: 'captured_entities', route: '/captured-data', icon: 'mdi-database-outline' },
  { title: 'Titles', value: 'titles', route: '/titles', icon: 'mdi-format-title' },
  { title: 'Copy', value: 'copy', route: '/copy', icon: 'mdi-content-copy' },
]);

const version = browser.runtime.getManifest().version;
</script>

<template>
  <v-container>
    <v-navigation-drawer permanent>
      <v-list nav color="#0073b1" variant="elevated">
        <v-list-item
          href="crm.html"
          title="Open CRM"
          append-icon="mdi-open-in-new"
        />
      </v-list>

      <v-divider />

      <v-list nav color="#0073b1">
        <v-list-item
          v-for="tab in tabs"
          :key="tab.value"
          :to="tab.route"
          :value="tab.value"
          :title="tab.title"
          :prepend-icon="tab.icon"
        />
      </v-list>

      <template #append>
        <v-divider />
        <v-footer>
          LinkedIn AID v{{ version }}
        </v-footer>
      </template>
    </v-navigation-drawer>

    <router-view></router-view>
  </v-container>
</template>
