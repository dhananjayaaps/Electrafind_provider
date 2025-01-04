// Context/GarageContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GarageContext = createContext();

export const GarageProvider = ({ children }) => {
  const [garages, setGarages] = useState([]);

  useEffect(() => {
    loadGarages();
  }, []);

  const loadGarages = async () => {
    try {
      const storedGarages = await AsyncStorage.getItem('garages');
      if (storedGarages) {
        setGarages(JSON.parse(storedGarages));
      }
    } catch (error) {
      console.error('Failed to load garages from storage', error);
    }
  };

  const saveGarages = async (garages) => {
    try {
      await AsyncStorage.setItem('garages', JSON.stringify(garages));
    } catch (error) {
      console.error('Failed to save garages to storage', error);
    }
  };

  const addGarage = (garage) => {
    const updatedGarages = [...garages, garage];
    setGarages(updatedGarages);
    saveGarages(updatedGarages);
  };

  return (
    <GarageContext.Provider value={{ garages, addGarage }}>
      {children}
    </GarageContext.Provider>
  );
};
