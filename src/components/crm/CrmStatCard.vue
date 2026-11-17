<script setup lang="ts">
defineProps<{
  title: string;
  value: number;
  icon: string;
  color: string;
  to: string;
}>();
</script>

<template>
  <v-card :to="to" rounded="xl" class="pa-5 h-100" elevation="0" border>
    <v-card-item class="pa-0">
      <template #prepend><v-avatar :color="color" variant="tonal" rounded="lg"><v-icon :icon="icon" /></v-avatar></template>
      <v-card-title class="text-body-2 text-medium-emphasis">{{ title }}</v-card-title>
      <v-card-subtitle class="text-h3 font-weight-bold mt-4">{{ value }}</v-card-subtitle>
    </v-card-item>
  </v-card>
</template>
