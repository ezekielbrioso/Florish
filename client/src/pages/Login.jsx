//Login Page Component

//Purpose: Handles user authentication via Google Sign-In

//- Provides user login interface using Firebase Google Authentication
//- Creates or retrieves user accounts on first login
//- Stores user data in localStorage for session persistence
//- Redirects users to home page after successful authentication
//- Required for accessing protected features (checkout, admin panel, saved bouquets)
//- Displays branded login screen with Florish identity
//- Simplifies authentication by using trusted Google accounts

import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../api/firebase";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      localStorage.setItem("currentUser", JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));

      navigate("/");
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Failed to sign in with Google");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-decoration">
          <div className="flower-icon">
            <img src="images/icons/florish-icon.png" alt="Florish Logo" />
          </div>
          <h1>
            <img src="/images/logo/florish-logo.png" alt="Florish" />
          </h1>
          <p className="tagline">Whispering the language of love through petals</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue your floral journey</p>
          </div>

          <button className="google-signin-btn" onClick={handleGoogleSignIn}>
            <svg className="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="login-divider">
            <span>Secure & Easy Sign In</span>
          </div>

          <div className="login-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Fast checkout</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Save your favorites</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Track your orders</span>
            </div>
          </div>

          <div className="login-footer">
            <p>Don't have an account? Sign up with Google to get started!</p>
            <a href="/" className="back-home">← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


