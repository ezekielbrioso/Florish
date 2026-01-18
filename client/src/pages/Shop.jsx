//Shop Page Component

//Purpose: Displays all pre-made bouquet collections available for purchase

//- Shows the full catalog of signature/pre-designed bouquet products
//- Allows customers to browse and add ready-made bouquets to their cart
// - Fetches bouquet products from the backend API
// - Provides instant add-to-cart functionality with user feedback
//- Handles loading and error states for better user experience
// - Displays product details (name, price, image) in a grid layout
// - Core shopping experience for customers who want quick, curated options

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { useCart } from "../contexts/CartContext";
import "./Shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <>
      {/* Shop Header */}
      <section className="shop-header">
        <h1>Our Signature Collections</h1>
        <p>Handcrafted bouquets made with love and the freshest flowers</p>
      </section>

      {/* Products Grid */}
      <section className="shop-section">
        {loading && <p className="loading">Loading products...</p>}
        {error && <p className="error">Error: {error}</p>}
        
        {!loading && products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    onError={(e) => {
                      console.error("Image failed to load:", product.imageUrl);
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  <p className="price">AED {product.price}</p>
                  <button 
                    className="primary-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p className="no-products">No products available</p>
        )}
      </section>

      <footer className="footer">
        <p>© 2026 Florish. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Shop;
