//Firebase Configuration and Authentication Setup

//Purpose: Initializes and configures Firebase services for the Florish application

// - Sets up Firebase connection using project-specific configuration credentials
// - Initializes Firebase Authentication for user login/logout functionality
// - Configures Google OAuth provider for social sign-in
// - Defines the admin email constant for role-based access control
// - Centralizes Firebase setup so it can be imported throughout the app
// - Essential for user authentication and authorization features

// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace these with your Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyDjHkoK7UoAkeMLcRyN003GL1uPyayqVB4",
  authDomain: "florish-fb7f2.firebaseapp.com",
  projectId: "florish-fb7f2",
  storageBucket: "florish-fb7f2.firebasestorage.app",
  messagingSenderId: "933177722443",
  appId: "1:933177722443:web:f9fb0489c9bf0e22d0efce",
  measurementId: "G-9226V0YGYQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export const ADMIN_EMAIL = "kiel.brioso.0713@gmail.com";

