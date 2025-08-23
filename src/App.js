import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import UserProfilePage from "./pages/UserProfilePage";
import AddressPage from "./pages/AddressPage";
import CheckoutPage from "./pages/CheckoutPage";
import Header from "./components/Header";
import { ProductProvider } from "./context/ProductContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { AddressProvider } from "./context/AddressContext";
import { OrderProvider } from "./context/OrderContext";
import { AlertProvider } from "./context/AlertContext";
import SimpleAlert from "./components/SimpleAlert";
function App() {
  return (
    <AlertProvider>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            <AddressProvider>
              <OrderProvider>
                <div className="App">
                  <Header />
                  <main className="container mt-4">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route
                        path="/products"
                        element={<ProductListingPage />}
                      />
                      <Route
                        path="/products/:id"
                        element={<ProductDetailPage />}
                      />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/wishlist" element={<WishlistPage />} />
                      <Route path="/profile" element={<UserProfilePage />} />
                      <Route path="/address" element={<AddressPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                    </Routes>
                  </main>
                  <SimpleAlert />
                </div>
              </OrderProvider>
            </AddressProvider>
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </AlertProvider>
  );
}

export default App;
