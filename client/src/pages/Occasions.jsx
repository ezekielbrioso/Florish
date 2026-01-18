//Occasions Page Component

//Purpose: Displays occasion-specific bouquet collections with filtering

// - Shows bouquets curated for specific occasions (Birthday, Anniversary, Valentine's, etc.)
//- Allows users to filter products by occasion type for easier browsing
//- Fetches occasion-specific products from the backend API
//- Provides visual occasion selector with icons for intuitive navigation
//- Enables quick add-to-cart functionality for occasion bouquets
// - Helps customers find the perfect bouquet for their specific event
//- Displays all occasions or filters to show only selected occasion

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { useCart } from "../contexts/CartContext";
import { API_URL } from "../api/config";
import "./Occasions.css";

const Occasions = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOccasion, setSelectedOccasion] = useState("All");
  const { addToCart } = useCart();

  const occasions = [
    { name: "All", icon: "/images/icons/all.png" },
    { name: "Birthday", icon: "/images/icons/birthday.png" },
    { name: "Anniversary", icon: "/images/icons/anniversary.png" },
    { name: "Valentine's Day", icon: "/images/icons/valentines.png" },
    { name: "Get Well", icon: "/images/icons/get-well.png" },
    { name: "Congratulations", icon: "/images/icons/congratulations.png" },
    { name: "Sympathy", icon: "/images/icons/sympathy.png" }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedOccasion === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.occasion === selectedOccasion));
    }
  }, [selectedOccasion, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/occasion-products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
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
      {/* Page Header */}
      <section className="occasions-header">
        <h1>Bouquets for Every Occasion</h1>
        <p>Celebrate life's special moments with our curated occasion collections</p>
      </section>

      {/* Occasion Categories */}
      <section className="occasion-categories">
        {occasions.map((occasion) => (
          <div
            key={occasion.name}
            className={`occasion-category-card ${selectedOccasion === occasion.name ? "active" : ""}`}
            onClick={() => setSelectedOccasion(occasion.name)}
          >
            <div className="occasion-icon">
              <img 
                src={occasion.icon} 
                alt={occasion.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <h3>{occasion.name}</h3>
          </div>
        ))}
      </section>

      {/* Products Grid */}
      <section className="occasions-products">
        {loading && <p className="loading">Loading products...</p>}
        {error && <p className="error">Error: {error}</p>}
        
        {!loading && filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="product-info">
                  <span className="occasion-tag">{product.occasion}</span>
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
          !loading && <p className="no-products">No products available for this occasion</p>
        )}
      </section>

      <footer className="footer">
        <p>© 2026 Florish. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Occasions;