import { createContext, useContext, useState, useEffect } from "react";

const AddressContext = createContext();

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
};

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState(() => {
    // Lazy initialization from localStorage
    try {
      const storedAddresses = localStorage.getItem("addresses");
      return storedAddresses ? JSON.parse(storedAddresses) : [];
    } catch (error) {
      console.error("Failed to load addresses from localStorage", error);
      return [];
    }
  });
  
  const [selectedAddress, setSelectedAddress] = useState(() => {
    // Lazy initialization from localStorage
    try {
      const storedSelectedAddress = localStorage.getItem("selectedAddress");
      return storedSelectedAddress ? JSON.parse(storedSelectedAddress) : null;
    } catch (error) {
      console.error("Failed to load selected address from localStorage", error);
      return null;
    }
  });

  // Save addresses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }, [addresses]);

  // Save selected address to localStorage whenever it changes
  useEffect(() => {
    if (selectedAddress) {
      localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
    } else {
      localStorage.removeItem("selectedAddress");
    }
  }, [selectedAddress]);

  const addAddress = (addressData) => {
    const newAddress = {
      ...addressData,
      _id: Date.now().toString(),
    };

    setAddresses(prev => {
      let updatedAddresses;
      
      if (addressData.isDefault) {
        // Remove default from all other addresses
        updatedAddresses = prev.map(addr => ({ ...addr, isDefault: false }));
        updatedAddresses.push(newAddress);
        setSelectedAddress(newAddress);
      } else {
        updatedAddresses = [...prev, newAddress];
      }
      
      return updatedAddresses;
    });
    
    return newAddress;
  };

  const updateAddress = (addressId, addressData) => {
    setAddresses(prev => {
      const updatedAddresses = prev.map((addr) =>
        addr._id === addressId ? { ...addr, ...addressData } : addr
      );

      // If this is set as default, remove default from others
      if (addressData.isDefault) {
        updatedAddresses.forEach((addr) => {
          if (addr._id !== addressId) {
            addr.isDefault = false;
          }
        });
        setSelectedAddress({ _id: addressId, ...addressData });
      }

      return updatedAddresses;
    });
  };

  const deleteAddress = (addressId) => {
    setAddresses(prev => {
      const updatedAddresses = prev.filter((addr) => addr._id !== addressId);
      
      // If deleted address was selected, clear selection
      if (selectedAddress && selectedAddress._id === addressId) {
        setSelectedAddress(null);
      }
      
      return updatedAddresses;
    });
  };

  const selectAddress = (address) => {
    setSelectedAddress(address);
  };

  const value = {
    addresses,
    selectedAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
  };

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
};