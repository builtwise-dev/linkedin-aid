<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';

const { signInWithGoogle } = useAuth();
const isSigningIn = ref(false);
const errorMessage = ref<string | null>(null);

const handleSignIn = async () => {
  isSigningIn.value = true;
  errorMessage.value = null;

  try {
    await signInWithGoogle();
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    console.error(err);
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      return;
    }
    errorMessage.value = error.message || 'Failed to sign in with Google. Please try again.';
  } finally {
    isSigningIn.value = false;
  }
};
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-8 text-center" max-width="480" width="100%" rounded="lg" elevation="2">
      <v-avatar size="64" class="mb-4" color="#e8f4f9">
        <v-icon size="36" color="#0073b1">mdi-account-lock</v-icon>
      </v-avatar>

      <v-card-title class="text-h5 font-weight-bold mb-2">
        Sign in to LinkedIn AID
      </v-card-title>

      <v-card-text class="text-body-1 text-medium-emphasis mb-6">
        Authorization is required to access Settings and manage your preferences and captured data.
      </v-card-text>

      <v-btn
        color="#0073b1"
        size="large"
        block
        prepend-icon="mdi-google"
        :loading="isSigningIn"
        :disabled="isSigningIn"
        @click="handleSignIn"
      >
        Sign in with Google
      </v-btn>

      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        class="mt-4 text-start"
        closable
        @click:close="errorMessage = null"
      >
        {{ errorMessage }}
      </v-alert>

      <div class="text-caption text-medium-emphasis mt-6">
        Only Google account authorization is currently supported.
      </div>
    </v-card>
  </v-container>
</template>
