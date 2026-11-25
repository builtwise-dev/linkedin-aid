<script setup lang="ts">
import { useSnackbar } from '@/composables/useSnackbar';

const { queue } = useSnackbar();
</script>

<template>
  <v-snackbar-queue v-model="queue" closable location="bottom right" timeout="4000" />
</template>
