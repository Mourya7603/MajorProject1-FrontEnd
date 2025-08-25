// context/AddressContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AddressContext = createContext();

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
};

// Function to generate MongoDB-like ObjectId
const generateObjectId = () => {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
  const random = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  return timestamp + random;
};

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false); // Track if initial load is complete

  // Load addresses from localStorage on component mount
  useEffect(() => {
    const loadAddresses = () => {
      try {
        const storedAddresses = localStorage.getItem("userAddresses");
        if (storedAddresses) {
          let parsedAddresses = JSON.parse(storedAddresses);

          // Convert old numeric IDs to ObjectId format if needed
          parsedAddresses = parsedAddresses.map((address) => {
            if (typeof address.id === "number" || (address.id && address.id.length < 12)) {
              return {
                ...address,
                _id: generateObjectId(),
                id: undefined, // Remove old numeric ID
              };
            }
            return address;
          });

          setAddresses(parsedAddresses);

          // Auto-select default address if exists
          const defaultAddress = parsedAddresses.find((addr) => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
          }
        }
      } catch (error) {
        console.error("Error loading addresses from localStorage:", error);
        // If there's an error parsing, clear the corrupted data
        localStorage.removeItem("userAddresses");
      } finally {
        setIsLoaded(true); // Mark initial load as complete
      }
    };

    loadAddresses();
  }, []);

  // Save addresses to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) { // Only save after initial load is complete
      try {
        localStorage.setItem("userAddresses", JSON.stringify(addresses));
      } catch (error) {
        console.error("Error saving addresses to localStorage:", error);
      }
    }
  }, [addresses, isLoaded]); // Add isLoaded to dependency array

  const addAddress = (addressData) => {
    const newAddress = {
      ...addressData,
      _id: generateObjectId(), // Use ObjectId format
    };

    // If this is set as default, remove default from others
    let updatedAddresses;
    if (addressData.isDefault) {
      updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: false,
      }));
      updatedAddresses.push(newAddress);
      setSelectedAddress(newAddress);
    } else {
      updatedAddresses = [...addresses, newAddress];
    }

    setAddresses(updatedAddresses);
    return newAddress;
  };

  const updateAddress = (addressId, addressData) => {
    const updatedAddresses = addresses.map((addr) =>
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

    setAddresses(updatedAddresses);
  };

  const deleteAddress = (addressId) => {
    const updatedAddresses = addresses.filter((addr) => addr._id !== addressId);
    setAddresses(updatedAddresses);

    // If deleted address was selected, clear selection
    if (selectedAddress && selectedAddress._id === addressId) {
      setSelectedAddress(null);
    }
  };

  const selectAddress = (address) => {
    setSelectedAddress(address);
  };

  const clearAllAddresses = () => {
    setAddresses([]);
    setSelectedAddress(null);
    localStorage.removeItem("userAddresses");
  };

  const value = {
    addresses,
    selectedAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
    clearAllAddresses,
    hasAddresses: addresses.length > 0,
  };

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
};