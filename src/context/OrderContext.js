import { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save orders to localStorage
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: Date.now().toString(),
      orderDate: new Date().toISOString(),
      status: "confirmed",
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrder = (orderId) => {
    return orders.find((order) => order.id === orderId);
  };

  const getUserOrders = () => {
    return orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        getOrder,
        getUserOrders,
        orderCount: orders.length,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
