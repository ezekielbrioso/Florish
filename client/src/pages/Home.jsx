//Home Page Component
 
//Purpose: Landing page for the Florish e-commerce website

//- Serves as the first page visitors see when they arrive at the site
//- Displays hero section with branding and call-to-action
//- Showcases featured occasion products (Birthday, Anniversary, Valentine's)
//- Shows preview of shop products to entice browsing
//- Provides quick navigation to main shopping sections
//- Creates first impression and encourages user engagement
//- Fetches and displays curated product samples from the backend


import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [occasionProducts, setOccasionProducts] = useState([]);
  const [shopProducts, setShopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOccasionProducts();
    fetchShopProducts();
  }, []);

  const fetchOccasionProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/occasion-products");
      const data = await response.json();
      
      // Filter to get one product from each occasion: Birthday, Anniversary, Valentine's Day
      const birthday = data.find(p => p.occasion === "Birthday");
      const anniversary = data.find(p => p.occasion === "Anniversary");
      const valentines = data.find(p => p.occasion === "Valentine's Day");
      
      // Create array with only these 3 products (filter out undefined)
      const selectedProducts = [birthday, anniversary, valentines].filter(p => p !== undefined);
      
      setOccasionProducts(selectedProducts);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching occasion products:", err);
      setLoading(false);
    }
  };

  const fetchShopProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();
      setShopProducts(data.slice(0, 3)); // Show only 3 products
    } catch (err) {
      console.error("Error fetching shop products:", err);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Whispering the Language <span className="highlight">of Love Through Petals</span></h1>
          <p>Choose from our signature collections or design custom bouquets with the freshest flowers, wrapped with love, delivered to your door.</p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate("/build")}>
              Build Your Bouquet
            </button>
            <a href="/shop" style={{ textDecoration: 'none' }}>
              <button className="secondary-btn">Shop Collections</button>
            </a>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/flowers/hero-bouquet.jpg" alt="Beautiful bouquet" />
        </div>
      </section>

      {/* Featured Collections */}
      <section className="collections">
        <h2>Signature Collections</h2>
        <p className="collections-subtitle">Handcrafted bouquets made with love</p>
        
        {loading ? (
          <p className="loading">Loading collections...</p>
        ) : (
          <div className="collection-grid">
            {shopProducts.map((product) => (
              <div key={product._id} className="collection-card">
                <img src={product.imageUrl} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.category}</p>
                <p className="product-price">AED {product.price}</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="collections-button">
          <a href="/shop" style={{ textDecoration: 'none' }}>
            <button className="primary-btn">Shop Collections</button>
          </a>
        </div>
      </section>

      {/* Occasions Preview Section */}
      <section className="occasions-preview">
        <div className="occasions-header-section">
          <h2>Celebrate Every Occasion</h2>
          <p>Beautifully curated bouquets for life's special moments</p>
          <a href="/occasions" style={{ textDecoration: 'none' }}>
            <button className="secondary-btn">View All Occasions</button>
          </a>
        </div>

        {loading ? (
          <p className="loading">Loading occasion bouquets...</p>
        ) : (
          <div className="occasions-preview-grid">
            {occasionProducts.map((product) => (
              <div key={product._id} className="occasion-preview-card">
                <div className="occasion-image">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="occasion-info">
                  <h3>{product.name}</h3>
                  <span className="occasion-badge-inline">{product.occasion}</span>
                  <p>{product.description}</p>
                  <p className="occasion-price">AED {product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="features">
        <h2>Why Choose Florish?</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Fresh Flowers</h3>
            <p>Sourced daily to ensure maximum freshness.</p>
          </div>
          <div className="feature-card">
            <h3>Custom Bouquets</h3>
            <p>Create your own arrangement exactly how you want it.</p>
          </div>
          <div className="feature-card">
            <h3>Fast Delivery</h3>
            <p>Delivered on time, with care and love.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Prefer something unique?</h2>
        <p>Create your own arrangement from scratch using our Bouquet Builder.</p>
        <button className="primary-btn" onClick={() => navigate("/build")}>
          Start Building Your Bouquet
        </button>
      </section>

      <footer className="footer">
        <p>© 2026 Florish. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Home;

