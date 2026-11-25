import { reactive } from 'vue';

export interface ConfirmDialogOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  color?: string;
}

interface ConfirmDialogState extends Required<Omit<ConfirmDialogOptions, 'message'>> {
  open: boolean;
  message: string;
}

const state = reactive<ConfirmDialogState>({
  open: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  color: 'error',
});

let resolver: ((confirmed: boolean) => void) | null = null;

const settle = (confirmed: boolean) => {
  state.open = false;
  resolver?.(confirmed);
  resolver = null;
};

export function useConfirmDialog() {
  const confirmAction = (options: ConfirmDialogOptions): Promise<boolean> => {
    resolver?.(false);
    Object.assign(state, {
      message: '',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      color: 'error',
      ...options,
      open: true,
    });
    return new Promise((resolve) => {
      resolver = resolve;
    });
  };

  return { state, confirmAction, settle };
}
