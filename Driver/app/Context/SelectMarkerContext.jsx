import React, { createContext, useState } from 'react';

export const SelectMarkerContext = createContext();

//newly added delete in case
export const SelectMarkerProvider = ({ children }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isMarkerTouched, setIsMarkerTouched] = useState(false);


  return (
    <SelectMarkerContext.Provider value={{ selectedMarker, setSelectedMarker, isMarkerTouched, setIsMarkerTouched, resetMarkerTouched }}>
      {children}
    </SelectMarkerContext.Provider>
  );
};