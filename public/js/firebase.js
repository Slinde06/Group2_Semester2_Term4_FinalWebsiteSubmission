// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
 
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsV2cjGIKVxzOrQHm7x47RMSGqYPZ8tXA",
  authDomain: "intro-class-f9eaa.firebaseapp.com",
  projectId: "intro-class-f9eaa",
  storageBucket: "intro-class-f9eaa.firebasestorage.app",
  messagingSenderId: "145843348743",
  appId: "1:145843348743:web:1fc22c8213fe9c8d7711a2",
  measurementId: "G-GYL1PG1QEL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);

