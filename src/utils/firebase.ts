import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { initializeAuth, indexedDBLocalPersistence } from 'firebase/auth/web-extension';

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.WXT_FIREBASE_API_KEY,
  authDomain: import.meta.env.WXT_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.WXT_FIREBASE_PROJECT_ID,
  appId: import.meta.env.WXT_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: indexedDBLocalPersistence,
});
