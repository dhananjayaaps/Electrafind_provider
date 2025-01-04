import { View, Image } from 'react-native';
import React, { useContext } from 'react';
import { Marker } from 'react-native-maps';
import images from '../../../constants/images';
import { SelectMarkerContext } from '../../Context/SelectMarkerContext';

export default function Markers({ index, place, onMarkerTouch }) {
  const { setSelectedMarker, setIsMarkerTouched } = useContext(SelectMarkerContext);

  const handleMarkerPress = () => {
    setSelectedMarker(index);
    setIsMarkerTouched(true);
    onMarkerTouch();
  };

  return place && (
    <Marker
      coordinate={{
        latitude: place.location?.latitude,
        longitude: place.location?.longitude,
      }}
      onPress={handleMarkerPress}
      description="Your Location"
    >
      <Image source={images.evchargerheader}
      
      style={{ height: 40, width: 40, position: 'absolute' }} />
    </Marker>
  );
}
