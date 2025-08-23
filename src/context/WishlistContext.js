import { createContext, useContext, useState, useEffect } from "react";
import { useAlert } from "./AlertContext";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    // Lazy initialization from localStorage
    try {
      const storedWishlist = localStorage.getItem("wishlist");
      return storedWishlist ? JSON.parse(storedWishlist) : [];
    } catch (error) {
      console.error("Failed to load wishlist from localStorage", error);
      return [];
    }
  });
  
  const { showAlert } = useAlert();

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  const addToWishlist = (product) => {
    if (isInWishlist(product._id)) {
      showAlert(`${product.name} is already in wishlist`, "warning");
      return;
    }

    setWishlist(prev => [...prev, product]);
    showAlert(`Added ${product.name} to wishlist!`, "success");
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => {
      const removedItem = prev.find((item) => item._id === productId);
      const newWishlist = prev.filter((item) => item._id !== productId);
      showAlert(`Removed ${removedItem?.name || "item"} from wishlist`, "info");
      return newWishlist;
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
    showAlert("Wishlist cleared", "info");
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};