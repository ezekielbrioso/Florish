//Build-A-Bouquet Page Component

//Purpose: Interactive bouquet customization experience
  
//- Allows customers to create personalized custom bouquets step-by-step
// - Implements 6-step process: base flowers, focal flowers, filler flowers, wrapper, ribbon, card
//- Fetches available customization items from the backend API by category
//- Manages complex selection state for multiple flower types and accessories
//- Calculates total price dynamically as user makes selections
//- Enables adding custom message for greeting cards
// - Provides preview of selections and ability to add custom bouquet to cart
// - Unique selling feature that differentiates Florish from competitors

import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import "./BuildABouquet.css";

const BuildABouquet = () => {
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [activeCategory, setActiveCategory] = useState("base");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selection states
  const [selectedBase, setSelectedBase] = useState([]);
  const [selectedFocal, setSelectedFocal] = useState({});
  const [selectedFiller, setSelectedFiller] = useState({});
  const [selectedWrapper, setSelectedWrapper] = useState(null);
  const [selectedRibbon, setSelectedRibbon] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardMessage, setCardMessage] = useState("");

  const categories = [
    { key: "base", label: "Base Flowers", step: 1, apiPath: "flowers/base" },
    { key: "focal", label: "Focal Flowers", step: 2, apiPath: "flowers/focal" },
    { key: "filler", label: "Filler Flowers", step: 3, apiPath: "flowers/filler" },
    { key: "wrapper", label: "Wrapper", step: 4, apiPath: "category/wrapper" },
    { key: "ribbon", label: "Ribbon", step: 5, apiPath: "category/ribbon" },
    { key: "card", label: "Greeting Card", step: 6, apiPath: "category/card" }
  ];

  useEffect(() => {
    const category = categories.find(c => c.key === activeCategory);
    if (category) {
      fetchItems(category.apiPath);
    }
  }, [activeCategory]);

  const fetchItems = async (path) => {
    try {
      setLoading(true);
      console.log("Fetching from path:", path);
      const response = await fetch(`http://localhost:5000/api/build-items/${path}`);
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Data received:", data);
      console.log("Number of items:", data.length);
      setItems(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching items:", err);
      setLoading(false);
    }
  };

  const handleCategoryChange = (category, step) => {
    setActiveCategory(category);
    setCurrentStep(step);
  };

  const handleBaseFlowerSelect = (item) => {
    if (selectedBase.find(g => g._id === item._id)) {
      setSelectedBase(selectedBase.filter(g => g._id !== item._id));
    } else if (selectedBase.length < 2) {
      setSelectedBase([...selectedBase, item]);
    }
  };

  const handleFocalFlowerSelect = (item) => {
    const current = selectedFocal[item._id] || 0;
    if (current < (item.maxQuantity || 10)) {
      setSelectedFocal({ ...selectedFocal, [item._id]: current + 1 });
    }
  };

  const handleFillerFlowerSelect = (item) => {
    const current = selectedFiller[item._id] || 0;
    if (current < (item.maxQuantity || 10)) {
      setSelectedFiller({ ...selectedFiller, [item._id]: current + 1 });
    }
  };

  const decrementFocal = (itemId) => {
    const current = selectedFocal[itemId] || 0;
    if (current > 0) {
      const newFocal = { ...selectedFocal };
      if (current === 1) {
        delete newFocal[itemId];
      } else {
        newFocal[itemId] = current - 1;
      }
      setSelectedFocal(newFocal);
    }
  };

  const decrementFiller = (itemId) => {
    const current = selectedFiller[itemId] || 0;
    if (current > 0) {
      const newFiller = { ...selectedFiller };
      if (current === 1) {
        delete newFiller[itemId];
      } else {
        newFiller[itemId] = current - 1;
      }
      setSelectedFiller(newFiller);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    
    // Base flowers
    selectedBase.forEach(item => {
      total += item.price;
    });
    
    // Focal flowers
    Object.keys(selectedFocal).forEach(itemId => {
      const item = items.find(i => i._id === itemId);
      if (item) total += item.price * selectedFocal[itemId];
    });
    
    // Filler flowers
    Object.keys(selectedFiller).forEach(itemId => {
      const item = items.find(i => i._id === itemId);
      if (item) total += item.price * selectedFiller[itemId];
    });
    
    // Wrapper
    if (selectedWrapper) total += selectedWrapper.price;
    
    // Ribbon
    if (selectedRibbon) total += selectedRibbon.price;
    
    // Card
    if (selectedCard) total += selectedCard.price;
    
    return total.toFixed(2);
  };

  const canProceed = () => {
    return selectedBase.length >= 1 && 
           Object.keys(selectedFocal).length >= 1 && 
           selectedWrapper !== null;
  };

  const handleAddToCart = () => {
    console.log("Add to cart clicked");
    console.log("Current user:", currentUser);
    console.log("Can proceed:", canProceed());
    
    if (!currentUser) {
      console.log("No user, redirecting to login");
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }
    
    if (!canProceed()) {
      console.log("Cannot proceed - missing required items");
      alert("Please complete required selections: Base Flowers (min 1), Focal Flowers (min 1), and Wrapper");
      return;
    }

    // Get all selected items for the details
    const getAllSelectedFlowers = () => {
      const allFlowers = {
        base: [],
        focal: [],
        filler: []
      };

      // Add base flowers
      selectedBase.forEach(item => {
        allFlowers.base.push({
          name: item.name,
          price: item.price,
          color: item.color
        });
      });

      // Add focal flowers with quantities
      Object.keys(selectedFocal).forEach(itemId => {
        const item = items.find(i => i._id === itemId);
        if (item) {
          allFlowers.focal.push({
            name: item.name,
            quantity: selectedFocal[itemId],
            price: item.price,
            color: item.color
          });
        }
      });

      // Add filler flowers with quantities
      Object.keys(selectedFiller).forEach(itemId => {
        const item = items.find(i => i._id === itemId);
        if (item) {
          allFlowers.filler.push({
            name: item.name,
            quantity: selectedFiller[itemId],
            price: item.price,
            color: item.color
          });
        }
      });

      return allFlowers;
    };

    const selectedFlowers = getAllSelectedFlowers();

    // Create custom bouquet object
    const customBouquet = {
      _id: `custom-${Date.now()}`,
      name: "Custom Bouquet",
      category: "Custom Build",
      price: parseFloat(calculateTotal()),
      imageUrl: selectedWrapper?.imageUrl || "/images/custom-bouquet.jpg",
      isCustom: true,
      details: {
        baseFlowers: selectedFlowers.base,
        focalFlowers: selectedFlowers.focal,
        fillerFlowers: selectedFlowers.filler,
        wrapper: selectedWrapper ? {
          name: selectedWrapper.name,
          price: selectedWrapper.price,
          color: selectedWrapper.color
        } : null,
        ribbon: selectedRibbon ? {
          name: selectedRibbon.name,
          price: selectedRibbon.price,
          color: selectedRibbon.color
        } : null,
        card: selectedCard ? {
          name: selectedCard.name,
          message: cardMessage,
          price: selectedCard.price
        } : null
      }
    };

    console.log("Custom bouquet created:", customBouquet);
    
    try {
      addToCart(customBouquet);
      console.log("Successfully added to cart");
      console.log("Navigating to cart page...");
      
      // Use setTimeout to ensure state updates before navigation
      setTimeout(() => {
        navigate("/cart");
      }, 100);
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  // Helper function to get all items for summary (since items change per category)
  const getAllSelectedItems = () => {
    return [...selectedBase];
  };

  return (
    <>      
      <div className="build-container">
        {/* Header */}
        <section className="build-header">
          <h1>Build Your Custom Bouquet</h1>
          <p>Create a personalized arrangement step by step</p>
        </section>

        <div className="build-content">
          {/* Left Panel - Item Selection */}
          <div className="items-panel">
            {/* Sticky Category Navigation */}
            <div className="category-nav">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  className={`category-tab ${activeCategory === cat.key ? "active" : ""}`}
                  onClick={() => handleCategoryChange(cat.key, cat.step)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="items-grid">
              {loading ? (
                <p className="loading">Loading items...</p>
              ) : (
                items.map((item) => {
                  let isSelected = false;
                  let quantity = 0;
                  let buttonText = "Select";

                  if (activeCategory === "base") {
                    isSelected = selectedBase.find(g => g._id === item._id);
                    buttonText = isSelected ? "Selected" : "Select";
                  } else if (activeCategory === "focal") {
                    quantity = selectedFocal[item._id] || 0;
                    isSelected = quantity > 0;
                    buttonText = quantity > 0 ? "Add Another" : "Select";
                  } else if (activeCategory === "filler") {
                    quantity = selectedFiller[item._id] || 0;
                    isSelected = quantity > 0;
                    buttonText = quantity > 0 ? "Add Another" : "Select";
                  } else if (activeCategory === "wrapper") {
                    isSelected = selectedWrapper?._id === item._id;
                    buttonText = isSelected ? "Selected" : "Select";
                  } else if (activeCategory === "ribbon") {
                    isSelected = selectedRibbon?._id === item._id;
                    buttonText = isSelected ? "Selected" : "Select";
                  } else if (activeCategory === "card") {
                    isSelected = selectedCard?._id === item._id;
                    buttonText = isSelected ? "Selected" : "Select";
                  }

                  return (
                    <div
                      key={item._id}
                      className={`item-card ${isSelected ? "selected" : ""}`}
                    >
                      <div className="item-image">
                        <img src={item.imageUrl} alt={item.name} />
                        {quantity > 0 && (
                          <span className="quantity-badge">{quantity}</span>
                        )}
                        {item.color && (
                          <span className="color-badge">{item.color}</span>
                        )}
                      </div>
                      <div className="item-info">
                        <h3>{item.name}</h3>
                        {item.color && <p className="item-color">{item.color}</p>}
                        <p className="item-price">AED {item.price}</p>
                        {activeCategory === "focal" || activeCategory === "filler" ? (
                          <div className="quantity-controls">
                            <button
                              onClick={() => activeCategory === "focal" ? decrementFocal(item._id) : decrementFiller(item._id)}
                              disabled={quantity === 0}
                            >
                              -
                            </button>
                            <span>{quantity}</span>
                            <button
                              onClick={() => activeCategory === "focal" ? handleFocalFlowerSelect(item) : handleFillerFlowerSelect(item)}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            className={`item-select-btn ${isSelected ? "selected" : ""}`}
                            onClick={() => {
                              if (activeCategory === "base") handleBaseFlowerSelect(item);
                              else if (activeCategory === "wrapper") setSelectedWrapper(item);
                              else if (activeCategory === "ribbon") setSelectedRibbon(item);
                              else if (activeCategory === "card") setSelectedCard(item);
                            }}
                          >
                            {buttonText}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel - Bouquet Summary */}
          <div className="summary-panel">
            <h2>Your Bouquet</h2>
            
            <div className="summary-section">
              <h3>Base Flowers {selectedBase.length >= 1 ? "✓" : "(Required)"}</h3>
              {selectedBase.map(item => (
                <div key={item._id} className="summary-item">
                  <span>{item.name}</span>
                  <span>AED {item.price}</span>
                </div>
              ))}
            </div>

            <div className="summary-section">
              <h3>Focal Flowers {Object.keys(selectedFocal).length >= 1 ? "✓" : "(Required)"}</h3>
              {Object.keys(selectedFocal).map(itemId => {
                const item = selectedBase.find(i => i._id === itemId) || 
                            items.find(i => i._id === itemId);
                if (!item) return null;
                return (
                  <div key={itemId} className="summary-item">
                    <span>{item.name} x{selectedFocal[itemId]}</span>
                    <span>AED {(item.price * selectedFocal[itemId]).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="summary-section">
              <h3>Filler Flowers (Optional)</h3>
              {Object.keys(selectedFiller).length === 0 ? (
                <p className="summary-empty">None selected</p>
              ) : (
                Object.keys(selectedFiller).map(itemId => {
                  const item = selectedBase.find(i => i._id === itemId) || 
                              items.find(i => i._id === itemId);
                  if (!item) return null;
                  return (
                    <div key={itemId} className="summary-item">
                      <span>{item.name} x{selectedFiller[itemId]}</span>
                      <span>AED {(item.price * selectedFiller[itemId]).toFixed(2)}</span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="summary-section">
              <h3>Wrapper {selectedWrapper ? "✓" : "(Required)"}</h3>
              {selectedWrapper ? (
                <div className="summary-item">
                  <span>{selectedWrapper.name}</span>
                  <span>AED {selectedWrapper.price}</span>
                </div>
              ) : (
                <p className="summary-empty">None selected</p>
              )}
            </div>

            <div className="summary-section">
              <h3>Ribbon (Optional)</h3>
              {selectedRibbon ? (
                <div className="summary-item">
                  <span>{selectedRibbon.name}</span>
                  <span>AED {selectedRibbon.price}</span>
                </div>
              ) : (
                <p className="summary-empty">None selected</p>
              )}
            </div>

            <div className="summary-section">
              <h3>Greeting Card (Optional)</h3>
              {selectedCard ? (
                <>
                  <div className="summary-item">
                    <span>{selectedCard.name}</span>
                    <span>AED {selectedCard.price}</span>
                  </div>
                  <textarea
                    className="card-message"
                    placeholder="Enter your message (max 200 characters)"
                    maxLength={200}
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                  />
                  <p className="char-count">{cardMessage.length}/200</p>
                </>
              ) : (
                <p className="summary-empty">None selected</p>
              )}
            </div>

            <div className="summary-total">
              <h3>Total Price</h3>
              <p className="total-price">AED {calculateTotal()}</p>
            </div>

            <button
              className="primary-btn add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!canProceed()}
              style={{ opacity: canProceed() ? 1 : 0.5, cursor: canProceed() ? 'pointer' : 'not-allowed' }}
            >
              Add to Cart
            </button>
            
            {!canProceed() && (
              <p className="requirement-message">
                Please select: Base Flowers (min 1), Focal Flowers (min 1), and a Wrapper
              </p>
            )}
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>© 2026 Florish. All rights reserved.</p>
      </footer>
    </>
  );
};

export default BuildABouquet;