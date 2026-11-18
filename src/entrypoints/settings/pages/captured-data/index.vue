<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <v-app-bar flat class="border-b">
    <v-app-bar-title>Captured data</v-app-bar-title>

    <template #append>
      <v-tabs
        :model-value="route.path"
        color="#0073b1"
        class="mr-3"
      >
        <v-tab to="/captured-data/permanent" value="permanent" prepend-icon="mdi-database">Permanent</v-tab>
        <v-tab to="/captured-data/sessions" value="sessions" prepend-icon="mdi-clock-outline">Session</v-tab>
      </v-tabs>
    </template>
  </v-app-bar>

  <div>
    <router-view />
  </div>
</template>
