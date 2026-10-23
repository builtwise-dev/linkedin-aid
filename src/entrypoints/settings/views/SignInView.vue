<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';

const { signInWithGoogle, signInWithAnotherAccount, recentEmail } = useAuth();
const isSigningIn = ref<'recent' | 'another' | null>(null);
const errorMessage = ref<string | null>(null);

const runSignIn = async (
  account: 'recent' | 'another',
  signIn: () => Promise<unknown>,
) => {
  isSigningIn.value = account;
  errorMessage.value = null;

  try {
    await signIn();
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    console.error(err);
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      return;
    }
    errorMessage.value = error.message || 'Failed to sign in with Google. Please try again.';
  } finally {
    isSigningIn.value = null;
  }
};

const handleContinueAsRecent = () => runSignIn('recent', signInWithGoogle);
const handleSignInWithAnotherAccount = () => runSignIn('another', signInWithAnotherAccount);
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

      <template v-if="recentEmail">
        <v-btn
          color="#0073b1"
          size="large"
          block
          prepend-icon="mdi-google"
          :loading="isSigningIn === 'recent'"
          :disabled="isSigningIn !== null"
          @click="handleContinueAsRecent"
        >
          Continue as {{ recentEmail }}
        </v-btn>

        <v-btn
          class="mt-3"
          variant="outlined"
          size="large"
          block
          :loading="isSigningIn === 'another'"
          :disabled="isSigningIn !== null"
          @click="handleSignInWithAnotherAccount"
        >
          Sign in with another account
        </v-btn>
      </template>

      <v-btn
        v-else
        color="#0073b1"
        size="large"
        block
        prepend-icon="mdi-google"
        :loading="isSigningIn !== null"
        :disabled="isSigningIn !== null"
        @click="handleContinueAsRecent"
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
    </v-card>
  </v-container>
</template>
