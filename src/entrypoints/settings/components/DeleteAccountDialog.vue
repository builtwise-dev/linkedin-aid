<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';

const { deleteAccount } = useAuth();
const isOpen = ref(false);
const isDeleting = ref(false);
const confirmation = ref('');
const errorMessage = ref<string | null>(null);

const closeDialog = () => {
  if (isDeleting.value) return;
  isOpen.value = false;
  confirmation.value = '';
  errorMessage.value = null;
};

const handleDelete = async () => {
  if (confirmation.value !== 'DELETE') return;

  isDeleting.value = true;
  errorMessage.value = null;
  try {
    await deleteAccount();
    isOpen.value = false;
    confirmation.value = '';
  } catch (error) {
    const authError = error as { code?: string; message?: string };
    if (authError.code === 'auth/requires-recent-login') {
      errorMessage.value = 'For your security, sign out and sign in again before deleting your account.';
    } else {
      errorMessage.value = authError.message || 'Could not delete your account. Please try again.';
    }
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <v-dialog v-model="isOpen" max-width="480" persistent>
    <template #activator="{ props }">
      <slot name="activator" :props="props" />
    </template>

    <v-card>
      <v-card-title class="text-h6">Delete account?</v-card-title>
      <v-card-text>
        <p class="mb-3">
          This permanently deletes your LinkedIn AID sign-in account. Your locally stored captured data and settings will remain on this device.
        </p>
        <p class="mb-4">Type <strong>DELETE</strong> to confirm.</p>
        <v-text-field
          v-model="confirmation"
          label="Type DELETE"
          autocomplete="off"
          autofocus
          :disabled="isDeleting"
          @keydown.enter="handleDelete"
        />
        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-3">
          {{ errorMessage }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn :disabled="isDeleting" @click="closeDialog">Cancel</v-btn>
        <v-btn
          color="error"
          variant="flat"
          :loading="isDeleting"
          :disabled="confirmation !== 'DELETE' || isDeleting"
          @click="handleDelete"
        >
          Delete account
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
