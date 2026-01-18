//Shopping Cart Page Component

//Purpose: Displays and manages items in the user's shopping cart

//- Shows all products added to cart with images, prices, and quantities
//- Allows users to update item quantities or remove items from cart
//- Displays subtotal, delivery fee, and total cost calculations
//- Provides checkout button that redirects to checkout (requires login)
//- Shows empty cart state with navigation options if cart is empty
//- Integrates with CartContext for real-time cart data
//- Essential step in the purchase flow before checkout

import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();

  const handleCheckout = () => {
    console.log("Checkout button clicked");
    console.log("Current user:", currentUser);
    
    if (!currentUser) {
      console.log("No user, redirecting to login");
      navigate("/login");
      return;
    }
    
    console.log("Navigating to checkout");
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <>
        <div className="cart-container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <div className="empty-cart-buttons">
              <button className="primary-btn" onClick={() => navigate("/shop")}>
                Shop Collections
              </button>
              <button className="secondary-btn" onClick={() => navigate("/build")}>
                Build a Bouquet
              </button>
            </div>
          </div>
        </div>
        <footer className="footer">
          <p>© 2026 Florish. All rights reserved.</p>
        </footer>
      </>
    );
  }

  return (
    <>
      <div className="cart-container">
        <section className="cart-header">
          <h1>Shopping Cart</h1>
          <p>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </section>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items-section">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.imageUrl} alt={item.name} />
                </div>
                
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  {item.category && <p className="item-category">{item.category}</p>}
                  {item.occasion && <span className="item-occasion">{item.occasion}</span>}
                  {item.color && <p className="item-color">Color: {item.color}</p>}
                  
                  {/* Custom Bouquet Details */}
                  {item.isCustom && item.details && (
                    <div className="custom-bouquet-details">
                      {item.details.baseFlowers && item.details.baseFlowers.length > 0 && (
                        <p className="custom-detail">
                          <strong>Base:</strong> {item.details.baseFlowers.map(f => f.name).join(", ")}
                        </p>
                      )}
                      {item.details.focalFlowers && item.details.focalFlowers.length > 0 && (
                        <p className="custom-detail">
                          <strong>Focal:</strong> {item.details.focalFlowers.map(f => `${f.name} (${f.quantity})`).join(", ")}
                        </p>
                      )}
                      {item.details.wrapper && (
                        <p className="custom-detail">
                          <strong>Wrapper:</strong> {item.details.wrapper.name}
                        </p>
                      )}
                      {item.details.card && (
                        <p className="custom-detail">
                          <strong>Card:</strong> {item.details.card.name}
                          {item.details.card.message && ` - "${item.details.card.message}"`}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-price">
                  <p className="item-unit-price">AED {item.price} each</p>
                  <p className="item-total-price">AED {(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item._id)}
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}

            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>AED {getCartTotal().toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>AED 15.00</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row summary-total">
              <span>Total</span>
              <span>AED {(getCartTotal() + 15).toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            <button className="continue-shopping-btn" onClick={() => navigate("/shop")}>
              Continue Shopping
            </button>

            <div className="cart-features">
              <div className="feature">
                <span className="feature-icon">🚚</span>
                <span>Free delivery on orders over AED 200</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🌸</span>
                <span>Fresh flowers guaranteed</span>
              </div>
              <div className="feature">
                <span className="feature-icon">💳</span>
                <span>Secure payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>© 2026 Florish. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Cart;