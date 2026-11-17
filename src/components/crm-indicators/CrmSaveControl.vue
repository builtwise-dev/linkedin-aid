<script setup lang="ts">
interface Props {
  authenticated: boolean;
  authLoading: boolean;
  checking: boolean;
  saving: boolean;
  saved: boolean;
  removing?: boolean;
  statusError?: string;
  message?: string;
  messageError?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  statusError: '',
  message: '',
  messageError: false,
});

defineEmits<{ save: []; unsave: [] }>();
</script>

<template>
  <section class="crm-save" aria-live="polite">
    <button
      type="button"
      class="save-button"
      :class="{ saved: saved }"
      :disabled="!authenticated || authLoading || checking || saving || removing || saved"
      @click="$emit('save')"
    >
      <span v-if="saved" class="check-icon" aria-hidden="true">✓</span>
      <span v-else-if="checking || saving" class="spinner" aria-hidden="true" />
      {{ authLoading ? 'Checking sign-in…' : !authenticated ? 'Sign in to save' : saving ? 'Saving to CRM…' : removing ? 'Removing from CRM…' : checking ? 'Checking CRM…' : saved ? 'Saved to CRM' : 'Save to CRM' }}
    </button>

    <button v-if="saved" type="button" class="remove-button" :disabled="removing" @click="$emit('unsave')">
      {{ removing ? 'Removing…' : 'Remove from CRM' }}
    </button>

    <span v-if="!authenticated && !authLoading" class="status muted">Sign in from Settings to save this record.</span>
    <span v-else-if="saved" class="status success">This record is in your CRM.</span>
    <span v-else-if="statusError" class="status warning">Couldn’t check CRM status. Saving will update the existing record if it’s already there.</span>
    <span v-else-if="message" class="status" :class="{ error: messageError, success: !messageError }">{{ message }}</span>
  </section>
</template>

<style scoped>
.crm-save {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 0.8rem;
}

.save-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 34px;
  border: 1px solid #0a66c2;
  border-radius: 6px;
  background: #0a66c2;
  color: white;
  padding: 7px 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;
}

.save-button:hover:not(:disabled) { background: #004182; border-color: #004182; }
.save-button:focus-visible { outline: 2px solid #0a66c2; outline-offset: 2px; }
.save-button:disabled { opacity: 0.65; cursor: default; }
.save-button.saved { background: #e8f5ee; border-color: #a8d5b8; color: #17663a; }
.remove-button { border: 1px solid #cbd5e1; border-radius: 6px; background: white; color: #475569; padding: 7px 12px; font: inherit; cursor: pointer; }
.remove-button:hover:not(:disabled) { background: #f1f5f9; }
.remove-button:disabled { opacity: 0.65; cursor: default; }
.status { line-height: 1.4; }
.success { color: #17663a; }
.error { color: #b42318; }
.warning { color: #875900; }
.muted { color: #64748b; }
.check-icon { font-size: 1rem; line-height: 1; }

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .spinner { animation: none; border-right-color: currentColor; } }
</style>
