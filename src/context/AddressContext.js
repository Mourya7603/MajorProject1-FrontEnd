// context/AddressContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AddressContext = createContext();

export const useAddress = () => {
  return useContext(AddressContext);
};

export const AddressProvider = ({ children }) => {
  // Initialize addresses with data from localStorage
  const [addresses, setAddresses] = useState(() => {
    try {
      const savedAddresses = localStorage.getItem('userAddresses');
      return savedAddresses ? JSON.parse(savedAddresses) : [];
    } catch (error) {
      console.error('Error loading addresses from localStorage:', error);
      return [];
    }
  });
  
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Set selected address based on loaded addresses
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      setSelectedAddress(defaultAddress || addresses[0]);
    }
  }, [addresses]);

  // Save addresses to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('userAddresses', JSON.stringify(addresses));
    } catch (error) {
      console.error('Error saving addresses to localStorage:', error);
    }
  }, [addresses]);

  // Add this function to simulate fetching addresses
  const fetchAddresses = async () => {
    setLoading(true);
    setError('');
    try {
      // In a real app, you would fetch from an API
      // For now, we'll just use the addresses from localStorage
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch addresses');
      setLoading(false);
      console.error('Error fetching addresses:', err);
    }
  };

  const addAddress = (newAddress) => {
    // Generate a unique ID for the new address
    const addressWithId = {
      ...newAddress,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    
    let updatedAddresses;
    
    if (newAddress.isDefault) {
      // Remove default from other addresses
      updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
      updatedAddresses.push(addressWithId);
    } else {
      updatedAddresses = [...addresses, addressWithId];
    }
    
    setAddresses(updatedAddresses);
    
    // If this is the first address or it's set as default, select it
    if (addresses.length === 0 || newAddress.isDefault) {
      setSelectedAddress(addressWithId);
    }
    
    return addressWithId;
  };

  const updateAddress = (id, updatedData) => {
    const updatedAddresses = addresses.map(addr => {
      if (addr.id === id) {
        // If setting this address as default, remove default from others
        if (updatedData.isDefault) {
          return { ...addr, ...updatedData };
        }
        return { ...addr, ...updatedData };
      }
      
      // Remove default from other addresses if setting a new default
      if (updatedData.isDefault) {
        return { ...addr, isDefault: false };
      }
      
      return addr;
    });
    
    setAddresses(updatedAddresses);
    
    // If updating the selected address, update it too
    if (selectedAddress && selectedAddress.id === id) {
      setSelectedAddress({ ...selectedAddress, ...updatedData });
    }
  };

  const deleteAddress = (id) => {
    const addressToDelete = addresses.find(addr => addr.id === id);
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    
    // If deleting the default address, set a new default if available
    let newDefaultSet = false;
    if (addressToDelete && addressToDelete.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
      newDefaultSet = true;
    }
    
    setAddresses(updatedAddresses);
    
    // If deleting the selected address, select a new one
    if (selectedAddress && selectedAddress.id === id) {
      if (newDefaultSet) {
        setSelectedAddress(updatedAddresses[0]);
      } else {
        setSelectedAddress(updatedAddresses.length > 0 ? updatedAddresses[0] : null);
      }
    }
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
    fetchAddresses, 
    loading,
    error
  };

  return (
    <AddressContext.Provider value={value}>
      {children}
    </AddressContext.Provider>
  );
};