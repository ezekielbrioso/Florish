//Authentication Context Provider
 
// Purpose: Manages user authentication state across the entire application

//- Provides global access to current user information throughout the app
//- Listens to Firebase authentication state changes in real-time
//- Automatically syncs user data with localStorage for persistence
//- Determines if a user has admin privileges based on their email
//- Eliminates the need to pass user data through multiple component layers
//- Enables any component to access authentication state via useAuth hook
//- Essential for protecting routes and showing/hiding UI based on auth status

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, ADMIN_EMAIL } from "../api/firebase.js";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          isAdmin: user.email === ADMIN_EMAIL
        });
        localStorage.setItem("currentUser", JSON.stringify(user));
      } else {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

