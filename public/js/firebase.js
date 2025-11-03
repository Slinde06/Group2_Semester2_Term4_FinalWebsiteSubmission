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
  apiKey: "AIzaSyAoUYRw0JlzTps3Ay9LqtvJX-IGnh-0HTM",
  authDomain: "look-final-handin.firebaseapp.com",
  projectId: "look-final-handin",
  storageBucket: "look-final-handin.firebasestorage.app",
  messagingSenderId: "374507244864",
  appId: "1:374507244864:web:cecefe7cde8e5ceb4e7ea5",
  measurementId: "G-E2WNGVWH98"
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

    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("signinForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  let email = document.getElementById("signInEmail").value;
  let password = document.getElementById("signInPass").value;
  let username = document.getElementById("username").value;
  try {
    await signInWithEmailAndPassword(auth, email, password); // from firebase built in functions
    localStorage.setItem("username", username);
    window.location.href = "pages/Home.html";
  } catch (error) {
    alert(error.message);
  }
});
