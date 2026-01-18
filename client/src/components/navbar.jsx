// Navigation Bar Component

// Purpose: Provides the main navigation interface for the Florish application
 
// Why it's here:
//- Displays the brand logo and main navigation links (Home, Shop, Occasions, Build)
// - Shows shopping cart icon with item count badge
// - Handles user authentication state (login/logout) and displays user profile
// - Implements responsive mobile menu for smaller screens
// - Provides dropdown menu for user profile with access to orders and admin panel
// - Persists across all pages to maintain consistent navigation experience
// - Highlights active page for better user orientation

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { auth } from "../api/firebase";
import { signOut } from "firebase/auth";
import "./navbar.css";

const Navbar = () => {
  const { currentUser } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      {/* Left - Brand Logo */}
      <Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
        <img 
          src="/images/logo/florish-logo.png" 
          alt="Florish Logo" 
          className="brand-logo"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="brand-fallback" style={{ display: 'none' }}>
          <div className="logo-icon">🌸</div>
          <span className="logo-text">Florish</span>
        </div>
      </Link>

      {/* Center - Desktop Navigation */}
      <div className="navbar-links">
        <Link to="/" className={isActive("/") ? "active" : ""}>HOME</Link>
        <Link to="/shop" className={isActive("/shop") ? "active" : ""}>SHOP</Link>
        <Link to="/occasions" className={isActive("/occasions") ? "active" : ""}>OCCASIONS</Link>
        <Link to="/build" className={`build-link ${isActive("/build") ? "active" : ""}`}>BUILD A BOUQUET</Link>
      </div>

      {/* Right - User Actions */}
      <div className="navbar-actions">
        {/* Cart Icon */}
        <Link to="/cart" className="cart-icon-wrapper">
          <img 
            src="/images/icons/cart.png" 
            alt="Cart" 
            className="cart-icon-img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <span className="cart-icon-emoji" style={{ display: 'none' }}>🛒</span>
          {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
        </Link>

        {/* Login/Profile */}
        {currentUser ? (
          <div 
            className="user-profile"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="avatar">
              <img 
                src="/images/icons/user-icon.png" 
                alt="User" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="avatar-letter" style={{ display: 'none' }}>
                {currentUser.displayName?.charAt(0)}
              </div>
            </div>
            
            {showDropdown && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <p className="user-name">{currentUser.displayName}</p>
                  <p className="user-email">{currentUser.email}</p>
                </div>
                <div className="dropdown-divider"></div>
                {currentUser?.isAdmin && (
                  <Link to="/admin" className="dropdown-item">Admin Panel</Link>
                )}
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-btn">Login</Link>
        )}

        {/* Hamburger Menu */}
        <button 
          className="hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className={isActive("/") ? "active" : ""}
          >
            Home
          </Link>
          <Link 
            to="/shop" 
            onClick={() => setMobileMenuOpen(false)}
            className={isActive("/shop") ? "active" : ""}
          >
            Shop
          </Link>
          <Link 
            to="/occasions" 
            onClick={() => setMobileMenuOpen(false)}
            className={isActive("/occasions") ? "active" : ""}
          >
            Occasions
          </Link>
          <Link 
            to="/build" 
            onClick={() => setMobileMenuOpen(false)}
            className={isActive("/build") ? "active" : ""}
          >
            Build a Bouquet
          </Link>
          <Link 
            to="/cart" 
            onClick={() => setMobileMenuOpen(false)}
            className={isActive("/cart") ? "active" : ""}
          >
            Cart ({getCartCount()})
          </Link>
          {currentUser ? (
            <>
              <div className="mobile-user-info">
                <p>{currentUser.displayName}</p>
                <p className="user-email-mobile">{currentUser.email}</p>
              </div>
              {currentUser?.isAdmin && (
                <Link 
                  to="/admin" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={isActive("/admin") ? "active" : ""}
                >
                  Admin Panel
                </Link>
              )}
              <button onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }} className="logout-btn-mobile">
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setMobileMenuOpen(false)}
              className={isActive("/login") ? "active" : ""}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
