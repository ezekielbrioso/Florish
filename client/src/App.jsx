//Main Application Component

//Purpose: Root component that orchestrates the entire Florish e-commerce application

//- Defines the application's routing structure using React Router
//- Wraps the app with context providers (Auth and Cart) for global state management
//- Implements protected admin routes that require authentication and admin privileges
//- Organizes all page components and navigation
// - Serves as the central hub connecting all parts of the application
//- Ensures consistent layout with persistent navbar across all pages

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Occasions from "./pages/Occasions";
import BuildABouquet from "./pages/BuildABouquet";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminPanel from "./pages/AdminPanel.jsx";

// Protected Route Component - restricts access to admin-only pages
// Checks if user is logged in and has admin privileges before allowing access
const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" />;
  if (!currentUser.isAdmin) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/login" element={<Login />} />
            <Route path="/occasions" element={<Occasions />} />
            <Route path="/build" element={<BuildABouquet />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} 
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
