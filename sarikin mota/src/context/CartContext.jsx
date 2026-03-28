import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const item = window.localStorage.getItem('sm_cart');
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem('sm_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const isInCart = (carId) => cartItems.some(c => c.id === carId);

  const addToCart = (car) => {
    if (isInCart(car.id)) {
      toast('Already in your cart!', { icon: '🛒' });
      setCartOpen(true);
      return;
    }
    setCartItems(prev => [...prev, { ...car, quantity: 1 }]);
    toast.success(`${car.brand?.name || ''} ${car.model || car.title} added to cart!`);
    setCartOpen(true);
  };

  const removeFromCart = (carId) => {
    setCartItems(prev => prev.filter(c => c.id !== carId));
    toast('Removed from cart', { icon: '🗑️' });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  };

  const getCartCount = () => cartItems.length;

  const value = {
    cartItems,
    cartOpen,
    setCartOpen,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
