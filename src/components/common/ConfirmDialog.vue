<script setup lang="ts">
import { useConfirmDialog } from '@/composables/useConfirmDialog';

const { state, settle } = useConfirmDialog();

const onOpenChange = (open: boolean) => {
  if (!open) settle(false);
};
</script>

<template>
  <v-dialog :model-value="state.open" max-width="440" @update:model-value="onOpenChange">
    <v-card>
      <v-card-title class="text-h6 text-wrap">{{ state.title }}</v-card-title>
      <v-card-text v-if="state.message">{{ state.message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="settle(false)">{{ state.cancelText }}</v-btn>
        <v-btn :color="state.color" variant="flat" @click="settle(true)">
          {{ state.confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
