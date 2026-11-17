<script setup lang="ts">
defineProps<{
  eyebrow: string;
  title: string;
  description: string;
}>();
</script>

<template>
  <v-row align="end" justify="space-between" class="mb-8" no-gutters>
    <v-col cols="12" md="8">
      <div class="text-overline text-primary">{{ eyebrow }}</div>
      <h1 class="text-h4 font-weight-bold mt-1">{{ title }}</h1>
      <p class="text-body-1 text-medium-emphasis mt-2">{{ description }}</p>
    </v-col>
    <v-col v-if="$slots.actions" cols="12" md="auto" class="mt-4 mt-md-0">
      <slot name="actions" />
    </v-col>
  </v-row>
</template>
