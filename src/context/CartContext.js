import { createContext, useContext, useState, useEffect } from "react";
import { useAlert } from "./AlertContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Lazy initialization from localStorage
    try {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
      return [];
    }
  });
  
  const { showAlert } = useAlert();

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const isInCart = (productId) => {
    return cart.some((item) => item._id === productId);
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      let newCart;
      
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        showAlert(`Added ${quantity} more ${product.name} to cart!`, "success");
      } else {
        newCart = [...prevCart, { ...product, quantity }];
        showAlert(`Added ${product.name} to cart!`, "success");
      }
      
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const removedItem = prevCart.find((item) => item._id === productId);
      const newCart = prevCart.filter((item) => item._id !== productId);
      showAlert(`Removed ${removedItem?.name || "item"} from cart`, "info");
      return newCart;
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart(prevCart => {
      const updatedItem = prevCart.find((item) => item._id === productId);
      
      if (newQuantity <= 0) {
        const newCart = prevCart.filter((item) => item._id !== productId);
        showAlert(`Removed ${updatedItem?.name || "item"} from cart`, "info");
        return newCart;
      } else {
        const newCart = prevCart.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        );
        showAlert(
          `Updated ${updatedItem?.name || "item"} quantity to ${newQuantity}`,
          "info"
        );
        return newCart;
      }
    });
  };

  const clearCart = () => {
    setCart([]);
    showAlert("Cart cleared", "info");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isInCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal: () =>
          cart.reduce((total, item) => total + item.price * item.quantity, 0),
        getCartCount: () =>
          cart.reduce((count, item) => count + item.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};