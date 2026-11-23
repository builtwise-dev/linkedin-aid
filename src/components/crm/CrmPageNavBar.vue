<script lang="ts" setup>
interface Props {
  title: string;
  description?: string;
  icon?: string;
  backTo?: string;
}
defineProps<Props>();
</script>

<template>
  <v-app-bar flat color="surface" class="border-b">
    <template #prepend>
      <slot name="prepend"></slot>
    </template>

    <template v-if="backTo">
      <v-btn
        :to="backTo"
        icon="mdi-arrow-left"
        variant="text"
        aria-label="Go back"
        class="ml-3"
      />
      <v-divider vertical inset class="ml-3" />
    </template>

    <v-app-bar-title>
      <div class="d-flex align-center">
        <v-icon v-if="icon" size="large" class="mr-2">{{ icon }}</v-icon>
        <div>
          <h1 class="font-weight-bold text-title-large ma-0">{{ title }}</h1>
          <div
            v-if="description"
            class="text-body-medium text-caption text-medium-emphasis"
          >
            {{ description }}
          </div>
        </div>
      </div>
    </v-app-bar-title>

    <template #append>
      <slot name="append"></slot>
    </template>
  </v-app-bar>
</template>
