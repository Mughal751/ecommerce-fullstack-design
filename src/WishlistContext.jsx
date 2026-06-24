import { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('shopzone_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const save = (items) => {
    setWishlist(items);
    localStorage.setItem('shopzone_wishlist', JSON.stringify(items));
  };

  const addToWishlist = (product) => {
    if (wishlist.find(p => p.id === product.id || p._id === product._id)) return;
    save([...wishlist, product]);
  };

  const removeFromWishlist = (id) => {
    save(wishlist.filter(p => p.id !== id && p._id !== id));
  };

  const isWishlisted = (id) =>
    wishlist.some(p => p.id === id || p._id === id);

  const toggleWishlist = (product) => {
    const id = product.id || product._id;
    if (isWishlisted(id)) removeFromWishlist(id);
    else addToWishlist(product);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() { return useContext(WishlistContext); }
