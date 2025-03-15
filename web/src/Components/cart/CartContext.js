import React, { createContext, useContext, useState } from 'react';

export const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (newItems) => {
    setCartItems(newItems);
    document.getElementsByClassName('nav-item')[0].classList.add('animate-jump');
    setTimeout(() => {
      document.getElementsByClassName('nav-item')[0].classList.remove('animate-jump');
    }, 500)
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
