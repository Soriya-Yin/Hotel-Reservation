import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// TODO: Replace with your own Firebase project config (Firebase Console > Project Settings)
// const firebaseConfig = {
//   apiKey: "AIzaSyBvq2V2diFYFRC0T-H7nAJa0siLyyiY_AA",
//   authDomain: "hotel-reservation-1740c.firebaseapp.com",
//   projectId: "hotel-reservation-1740c",
//   storageBucket: "hotel-reservation-1740c.firebasestorage.app",
//   messagingSenderId: "637968946638",
//   appId: "1:637968946638:web:a410a89389c12b9987879f"
// };  
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const ADMIN_EMAIL = "admin123@gmail.com"
export default app
