import { ref } from 'vue';
import type { SnackbarQueueMessage as SnackbarMessage } from 'vuetify';

type SnackbarOptions = Exclude<SnackbarMessage, string>;

const queue = ref<SnackbarMessage[]>([]);

const errorText = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

export function useSnackbar() {
  const notify = (message: SnackbarMessage) => {
    queue.value.push(message);
  };

  const notifySuccess = (text: string, options: SnackbarOptions = {}) =>
    notify({ text, color: 'success', ...options });

  const notifyError = (text: string, options: SnackbarOptions = {}) =>
    notify({ text, color: 'error', timeout: 6000, ...options });

  const notifyInfo = (text: string, options: SnackbarOptions = {}) =>
    notify({ text, ...options });

  return { queue, notify, notifySuccess, notifyError, notifyInfo, errorText };
}
