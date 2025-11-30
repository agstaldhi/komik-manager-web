import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Ganti dengan config dari Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCEx-LlrBa6oYjB3ypXJFNaumTh1gh4ZuM",
  authDomain: "comic-manager-agii.firebaseapp.com",
  projectId: "comic-manager-agii",
  storageBucket: "comic-manager-agii.firebasestorage.app",
  messagingSenderId: "345899171842",
  appId: "1:345899171842:web:3b388ff1adc2cf6130271b",
  measurementId: "G-Q9MDER5W08",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
