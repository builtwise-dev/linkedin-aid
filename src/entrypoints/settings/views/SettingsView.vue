<script lang="ts" setup>
import { ref } from 'vue';
import { browser } from 'wxt/browser';

interface TabItem {
  title: string;
  value: string;
  route: string;
}

const tabs = ref<TabItem[]>([
  { title: 'General', value: 'general', route: '/' },
  { title: 'Captured data', value: 'captured_entities', route: '/captured-data' },
  { title: 'Titles', value: 'titles', route: '/titles' },
  { title: 'Copy', value: 'copy', route: '/copy' },
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
