//Checkout Page Component

//Purpose: Handles the complete order checkout process

//- Collects delivery information (address, contact details, preferred delivery date/time)
//- Handles payment information collection (card details)
//- Validates all form inputs to ensure data integrity
//- Displays order summary with cart items and total cost
//- Processes order placement and shows confirmation
//- Requires user authentication before accessing
//- Clears cart after successful order completion
//- Final step in the purchase flow before order confirmation
//- Includes UAE-specific features (emirates selection, landmark field)

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: currentUser?.displayName || "",
    email: currentUser?.email || "",
    phone: "",
    address: "",
    city: "",
    emirate: "Dubai",
    landmark: "",
    deliveryDate: "",
    deliveryTime: "morning",
    specialInstructions: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});

  const emirates = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];

  // Redirect if cart is empty (but not if order is already placed)
  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      console.log("Cart is empty, redirecting to cart page");
      navigate("/cart");
    }
  }, [cartItems, navigate, orderPlaced]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.address.trim()) newErrors.address = "Delivery address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.deliveryDate) newErrors.deliveryDate = "Delivery date is required";

    if (!formData.cardNumber.trim()) newErrors.cardNumber = "Card number is required";
    else if (!/^[0-9]{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }
    if (!formData.cardName.trim()) newErrors.cardName = "Cardholder name is required";
    if (!formData.expiryDate.trim()) newErrors.expiryDate = "Expiry date is required";
    else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Format: MM/YY";
    }
    if (!formData.cvv.trim()) newErrors.cvv = "CVV is required";
    else if (!/^[0-9]{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    
    if (!validateForm()) {
      console.log("Validation failed", errors);
      alert("Please fill in all required fields correctly");
      return;
    }

    console.log("Validation passed, processing order...");
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Order processed successfully");
      setLoading(false);
      setOrderPlaced(true);
      
      // Clear cart after successful order
      setTimeout(() => {
        console.log("Clearing cart...");
        clearCart();
      }, 3000);
    }, 2000);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const formatDeliveryTime = (time) => {
    switch(time) {
      case 'morning': return 'Morning (9 AM - 12 PM)';
      case 'afternoon': return 'Afternoon (12 PM - 5 PM)';
      case 'evening': return 'Evening (5 PM - 8 PM)';
      default: return time;
    }
  };

  // Order Success Screen
  if (orderPlaced) {
    console.log("Showing success screen");
    return (
      <>
        <div className="checkout-container">
          <div className="order-success">
            <div className="success-icon">✓</div>
            <h1>Order Placed Successfully!</h1>
            <p className="success-message">
              Thank you for your order! We've sent a confirmation email to <strong>{formData.email}</strong>
            </p>
            
            <div className="order-details-box">
              <h3>Order Summary</h3>
              <div className="order-info">
                <p><strong>Delivery Address:</strong></p>
                <p>{formData.address}, {formData.city}, {formData.emirate}</p>
                
                <p><strong>Delivery Date:</strong></p>
                <p>{new Date(formData.deliveryDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} - {formatDeliveryTime(formData.deliveryTime)}</p>
                
                <p><strong>Total Amount:</strong></p>
                <p className="total-amount">AED {(getCartTotal() + 15).toFixed(2)}</p>
              </div>
            </div>

            <div className="success-actions">
              <button className="primary-btn" onClick={() => navigate("/")}>
                Back to Home
              </button>
              <button className="secondary-btn" onClick={() => navigate("/shop")}>
                Continue Shopping
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

  console.log("Rendering checkout form");

  return (
    <>
      
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your order</p>
        </div>

        <div className="checkout-content">
          {/* Left Side - Checkout Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="form-section">
                <h2>1. Personal Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={errors.fullName ? "error" : ""}
                    />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "error" : ""}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="05XXXXXXXX"
                      className={errors.phone ? "error" : ""}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="form-section">
                <h2>2. Delivery Address</h2>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Building name, street, area"
                      className={errors.address ? "error" : ""}
                    />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                  </div>

                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? "error" : ""}
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label>Emirate *</label>
                    <select
                      name="emirate"
                      value={formData.emirate}
                      onChange={handleChange}
                    >
                      {emirates.map(emirate => (
                        <option key={emirate} value={emirate}>{emirate}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Landmark (Optional)</label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      placeholder="e.g., Near Metro Station, Opposite Mall"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Schedule */}
              <div className="form-section">
                <h2>3. Delivery Schedule</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Delivery Date *</label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      min={getMinDate()}
                      className={errors.deliveryDate ? "error" : ""}
                    />
                    {errors.deliveryDate && <span className="error-message">{errors.deliveryDate}</span>}
                  </div>

                  <div className="form-group">
                    <label>Delivery Time *</label>
                    <select
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleChange}
                    >
                      <option value="morning">Morning (9 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                      <option value="evening">Evening (5 PM - 8 PM)</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Special Instructions (Optional)</label>
                    <textarea
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Any special delivery instructions..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="form-section">
                <h2>4. Payment Information</h2>
                <div className="payment-icons">
                  <span>💳 We accept: Visa, Mastercard, American Express</span>
                </div>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className={errors.cardNumber ? "error" : ""}
                    />
                    {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label>Cardholder Name *</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="Name on card"
                      className={errors.cardName ? "error" : ""}
                    />
                    {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Expiry Date *</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className={errors.expiryDate ? "error" : ""}
                    />
                    {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                  </div>

                  <div className="form-group">
                    <label>CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength="4"
                      className={errors.cvv ? "error" : ""}
                    />
                    {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="form-section">
                <div className="terms-checkbox">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                  <label htmlFor="agreeToTerms">
                    I agree to the Terms & Conditions and Privacy Policy *
                  </label>
                </div>
                {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
              </div>

              <button 
                type="submit" 
                className="place-order-btn"
                disabled={loading}
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Right Side - Order Summary */}
          <div className="order-summary-section">
            <h2>Order Summary</h2>
       
            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item._id} className="summary-item">
                  <img src={item.imageUrl} alt={item.name} />
                  <div className="summary-item-info">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <p className="summary-item-price">AED {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="summary-totals">
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
            </div>

            <div className="secure-checkout">
              <span>🔒 Secure Checkout</span>
              <p>Your payment information is encrypted and secure</p>
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

export default Checkout;