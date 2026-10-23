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
const recentEmail = ref<string | null>(null);
const RECENT_EMAIL_KEY = 'recentAuthEmail';

void browser.storage.local.get(RECENT_EMAIL_KEY).then((result) => {
  const email = result[RECENT_EMAIL_KEY];
  if (typeof email === 'string' && email) recentEmail.value = email;
});

onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
  if (currentUser?.email) {
    recentEmail.value = currentUser.email;
    void browser.storage.local.set({ [RECENT_EMAIL_KEY]: currentUser.email });
  }
  loading.value = false;
});

export function useAuth() {
  const getGoogleAccessToken = async () => {
    const { token } = await browser.identity.getAuthToken({ interactive: true });

    if (!token) {
      throw new Error('Google did not return an access token.');
    }

    return token;
  };

  const signInWithGoogleToken = async (token: string) => {
    const credential = GoogleAuthProvider.credential(null, token);
    return signInWithCredential(auth, credential);
  };

  const signInWithGoogle = async () => {
    const token = await getGoogleAccessToken();
    return signInWithGoogleToken(token);
  };

  const signInWithAnotherAccount = async () => {
    await browser.identity.clearAllCachedAuthTokens();
    const token = await getGoogleAccessToken();
    return signInWithGoogleToken(token);
  };

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  return {
    user: readonly(user),
    loading: readonly(loading),
    recentEmail: readonly(recentEmail),
    signInWithGoogle,
    signInWithAnotherAccount,
    logout,
  };
}
