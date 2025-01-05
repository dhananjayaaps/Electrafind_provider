import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { API_URL } from '@env';
import { getDistance } from 'geolib';

export default function MapScreen({ navigation }) {
  const [userLocation, setUserLocation] = useState(null);
  const [placeList, setPlaceList] = useState([]);
  const mapRef = useRef(null);

  const colomboRegion = {
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Location access is required to show your location on the map. Please enable it in your settings.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (placeList.length === 0) {
      const interval = setInterval(() => {
        fetchStations();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, []);

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const { latitude, longitude } = location.coords;
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };

    setUserLocation(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);
  };

  const fetchStations = async () => {
    try {
      console.log('Fetching stations...');
      const response = await axios.get(`${API_URL}/stations`);
      setPlaceList(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  const findNearestStation = () => {
    if (!userLocation || placeList.length === 0) return;

    let nearestStation = null;
    let nearestDistance = Infinity;

    placeList.forEach((place) => {
      const distance = getDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: place.Latitude, longitude: place.Longitude }
      );

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestStation = place;
      }
    });

    if (nearestStation) {
      const newRegion = {
        latitude: nearestStation.Latitude,
        longitude: nearestStation.Longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
      mapRef.current?.animateToRegion(newRegion, 1000);
    }
  };

  useEffect(() => {
    if (userLocation && placeList.length > 0) {
      findNearestStation();
    }
  }, [userLocation, placeList]);

  const handleMarkerPress = (place) => {
    navigation.navigate('chargingStationProfile', {
      station: place,
    });
  };

  if (!userLocation) return "loading";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={userLocation || colomboRegion}
          showsUserLocation={true}
          followsUserLocation={false}
        >
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="Your Location"
              pinColor="blue"
            />
          )}

          {placeList.map((place) => (
            <Marker
              key={place.StationID}
              coordinate={{
                latitude: place.Latitude,
                longitude: place.Longitude,
              }}
              title={place.Name}
              description={place.Location}
              onPress={() => handleMarkerPress(place)}  // Navigate on marker press
            />
          ))}
        </MapView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
