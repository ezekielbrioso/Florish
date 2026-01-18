//Shopping Cart Context Provider

//Purpose: Manages shopping cart state and operations across the application

//- Provides global access to cart data (items, quantities, totals) throughout the app
//- Persists cart data to localStorage so items remain after page refresh
//- Offers cart operations: add items, remove items, update quantities, clear cart
//- Calculates cart totals and item counts automatically
//- Prevents prop drilling by making cart state accessible to any component
//- Enables real-time cart updates visible across all pages (navbar badge, cart page, etc.)
//- Essential for e-commerce functionality and checkout process

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("florish_cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("florish_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    console.log("CartContext: Adding item to cart", item);
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i._id === item._id);
      if (existingItem) {
        console.log("Item exists, updating quantity");
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      console.log("New item, adding to cart");
      const newCart = [...prev, { ...item, quantity: 1 }];
      console.log("New cart:", newCart);
      return newCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};