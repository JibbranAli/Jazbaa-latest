import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDxHpDLydjUJz47oTbia028hM3nTOjImF8",
  authDomain: "jazbaa-4-0.firebaseapp.com",
  projectId: "jazbaa-4-0",
  storageBucket: "jazbaa-4-0.firebasestorage.app",
  messagingSenderId: "904553931845",
  appId: "1:904553931845:web:8a0532c0359ac2e5b8af2c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 