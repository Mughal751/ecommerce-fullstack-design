import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const existingId = product._id || product.id;
      const existing = prev.find(i => (i._id || i.id) === existingId);
      if (existing) {
        return prev.map(i =>
          (i._id || i.id) === existingId
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { ...product, id: existingId, _id: existingId, quantity: qty }];
    });
  };

  const removeFromCart = (id) =>
    setCartItems(prev => prev.filter(i => (i._id || i.id) !== id));

  const updateQty = (id, amount) => {
    setCartItems(prev =>
      prev.map(i =>
        (i._id || i.id) === id
          ? { ...i, quantity: Math.max(1, i.quantity + amount) }
          : i
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() { return useContext(CartContext); }
