import { onAuthStateChanged, type User } from 'firebase/auth';
import { ref, readonly } from 'vue';
import { auth } from '@/utils/firebase';

const user = ref<User | null>(auth.currentUser);
const loading = ref(true);

onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
  loading.value = false;
});

export function useAuth() {
  return {
    user: readonly(user),
    loading: readonly(loading),
  };
}
