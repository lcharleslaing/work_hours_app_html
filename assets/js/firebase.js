import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyDGqfX_jz4RL4x4wC202gxjVp7_b-BF1V8",
  authDomain: "leecharleslaing-923eb.firebaseapp.com",
  projectId: "leecharleslaing-923eb",
  storageBucket: "leecharleslaing-923eb.firebasestorage.app",
  messagingSenderId: "865019723005",
  appId: "1:865019723005:web:ae61f66bfb6815f2509294",
  measurementId: "G-N8KY0SY2S2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);

// Auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const signOut = () => auth.signOut();