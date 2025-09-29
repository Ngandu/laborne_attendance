// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD13fu4khhO-SwiNDFATmbs7JQX8j4HCOg",
  authDomain: "laborne-600e3.firebaseapp.com",
  projectId: "laborne-600e3",
  storageBucket: "laborne-600e3.firebasestorage.app",
  messagingSenderId: "281567901691",
  appId: "1:281567901691:web:8bbab8ce69c156c93cfd5e",
  measurementId: "G-674N7V4Q09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
