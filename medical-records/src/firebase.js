// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDm20Plug9S3EWQo4umsdnrMXaEn8i_Jeo",
  authDomain: "medical-project-6a2aa.firebaseapp.com",
  projectId: "medical-project-6a2aa",
  storageBucket: "medical-project-6a2aa.appspot.com",
  messagingSenderId: "533053954463",
  appId: "1:533053954463:web:bbb60e3bd068baa90405aa",
  measurementId: "G-GMQZJYE7WW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it
const db = getFirestore(app);
export { db };
export const auth = getAuth(app);

