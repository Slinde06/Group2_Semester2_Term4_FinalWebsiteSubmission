// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNU-4VO8rV6pwL236yCi1X8rx8cyO4Ef8",
  authDomain: "look-semester-2.firebaseapp.com",
  projectId: "look-semester-2",
  storageBucket: "look-semester-2.firebasestorage.app",
  messagingSenderId: "437802465315",
  appId: "1:437802465315:web:f1265411212ff68937d996",
  measurementId: "G-1TN6KGNG23",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  let email = document.getElementById("signUpEmail").value;
  let password = document.getElementById("signUpPass").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password); // from firebase built in functions

    alert("Account created successfully");
    window.location.href = "pages/Home.html";
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("signinForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  let email = document.getElementById("signInEmail").value;
  let password = document.getElementById("signInPass").value;
  let username = document.getElementById("fullname").value;
  try {
    await signInWithEmailAndPassword(auth, email, password); // from firebase built in functions
    localStorage.setItem("username", username);
    alert("Login successful");
    window.location.href = "pages/Home.html";
  } catch (error) {
    alert(error.message);
  }
});
