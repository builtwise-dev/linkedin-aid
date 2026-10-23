import { browser } from 'wxt/browser';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth/web-extension';
import { ref, readonly } from 'vue';
import { auth } from '@/utils/firebase';

const user = ref<User | null>(auth.currentUser);
const loading = ref(true);

onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
  loading.value = false;
});

export function useAuth() {
  const signInWithGoogle = async () => {
    const { token } = await browser.identity.getAuthToken({
      interactive: true,
    });

    if (!token) {
      throw new Error('Google did not return an access token.');
    }

    const credential = GoogleAuthProvider.credential(null, token);

    return signInWithCredential(auth, credential);
  };

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  return {
    user: readonly(user),
    loading: readonly(loading),
    signInWithGoogle,
    logout,
  };
}
