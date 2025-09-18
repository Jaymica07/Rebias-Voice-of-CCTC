// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrlyjtH-zT-VgSrtv90a5_nZr9TZ1QVJk",
  authDomain: "rebias-voice-of-cctc.firebaseapp.com",
  projectId: "rebias-voice-of-cctc",
  storageBucket: "rebias-voice-of-cctc.firebasestorage.app",
  messagingSenderId: "62148904537",
  appId: "1:62148904537:web:591a020f855fc331931348"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);