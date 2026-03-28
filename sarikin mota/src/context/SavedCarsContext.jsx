import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const SavedCarsContext = createContext();

export function useSavedCars() {
  return useContext(SavedCarsContext);
}

export function SavedCarsProvider({ children }) {
  const [savedCars, setSavedCars] = useState(() => {
    // Initialize from localStorage
    try {
      const item = window.localStorage.getItem('sm_saved_cars');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error("Failed to parse saved cars from local storage", error);
      return [];
    }
  });

  // Sync to localStorage whenever savedCars changes
  useEffect(() => {
    window.localStorage.setItem('sm_saved_cars', JSON.stringify(savedCars));
  }, [savedCars]);

  const isSaved = (carId) => {
    return savedCars.some(car => car.id === carId);
  };

  const toggleSavedCar = (car) => {
    setSavedCars(prev => {
      const exists = prev.some(c => c.id === car.id);
      if (exists) {
        toast.success(`Removed ${car.brand} ${car.model} from saved list`);
        return prev.filter(c => c.id !== car.id);
      } else {
        toast.success(`Added ${car.brand} ${car.model} to saved list`);
        return [...prev, car];
      }
    });
  };

  const getSavedCount = () => savedCars.length;

  const value = {
    savedCars,
    toggleSavedCar,
    isSaved,
    getSavedCount
  };

  return (
    <SavedCarsContext.Provider value={value}>
      {children}
    </SavedCarsContext.Provider>
  );
}
