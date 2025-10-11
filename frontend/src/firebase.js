// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-MyGJonr3JTYqmMHbKhrPby3iRnbl--E",
  authDomain: "investment-website-ef216.firebaseapp.com",
  projectId: "investment-website-ef216",
  storageBucket: "investment-website-ef216.firebasestorage.app",
  messagingSenderId: "343866211479",
  appId: "1:343866211479:web:4e6908f8fe0a02104f7dd2",
  measurementId: "G-E66B17BGTV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();