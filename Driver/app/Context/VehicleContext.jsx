import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [favoriteVehicles, setFavoriteVehicles] = useState([]);

  useEffect(() => {
    loadVehicles();
    loadFavoriteVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const storedVehicles = await AsyncStorage.getItem('vehicles');
      if (storedVehicles) {
        setVehicles(JSON.parse(storedVehicles));
      }
    } catch (error) {
      console.error('Failed to load vehicles from storage', error);
    }
  };

  const saveVehicles = async (vehicles) => {
    try {
      await AsyncStorage.setItem('vehicles', JSON.stringify(vehicles));
    } catch (error) {
      console.error('Failed to save vehicles to storage', error);
    }
  };

  const loadFavoriteVehicles = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favoriteVehicles');
      if (storedFavorites) {
        setFavoriteVehicles(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Failed to load favorite vehicles from storage', error);
    }
  };

  const saveFavoriteVehicles = async (favorites) => {
    try {
      await AsyncStorage.setItem('favoriteVehicles', JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorite vehicles to storage', error);
    }
  };

  const addVehicle = (vehicle) => {
    const updatedVehicles = [...vehicles, vehicle];
    setVehicles(updatedVehicles);
    saveVehicles(updatedVehicles);
  };

  const toggleFavorite = (vehicle) => {
    const isFavorite = favoriteVehicles.some(fav => fav.id === vehicle.id);
    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favoriteVehicles.filter(fav => fav.id !== vehicle.id);
    } else {
      updatedFavorites = [...favoriteVehicles, vehicle];
    }
    setFavoriteVehicles(updatedFavorites);
    saveFavoriteVehicles(updatedFavorites);
  };

  return (
    <VehicleContext.Provider value={{ vehicles, addVehicle, favoriteVehicles, toggleFavorite }}>
      {children}
    </VehicleContext.Provider>
  );
};
