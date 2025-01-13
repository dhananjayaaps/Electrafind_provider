import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, StyleSheet, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { API_URL } from '@env';
import { getDistance } from 'geolib';

export default function MapScreen({ navigation }) {
  const [userLocation, setUserLocation] = useState(null);
  const [placeList, setPlaceList] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [nearestStations, setNearestStations] = useState([]);
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
    fetchStations();
  }, []);

  useEffect(() => {
    if (userLocation && placeList.length > 0) {
      findNearestStations();
    }
  }, [userLocation, placeList]);

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
      const response = await axios.get(`${API_URL}/stations`);
      setPlaceList(response.data);
      setFilteredPlaces(response.data); // Ensure filteredPlaces is initially set
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  const findNearestStations = () => {
    const distances = placeList.map((place) => ({
      ...place,
      distance: getDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: place.Latitude, longitude: place.Longitude }
      ),
    }));

    const sortedByDistance = distances.sort((a, b) => a.distance - b.distance);
    setNearestStations(sortedByDistance.slice(0, 3)); // Select 3 nearest stations
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = placeList.filter((place) =>
        place.Name.toLowerCase().includes(query.toLowerCase()) ||
        place.Location.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPlaces(filtered);

      if (filtered.length > 0) {
        const { Latitude, Longitude } = filtered[0];
        const newRegion = {
          latitude: Latitude,
          longitude: Longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };
        mapRef.current?.animateToRegion(newRegion, 1000);
      }
    } else {
      setFilteredPlaces(placeList);
      if (userLocation) {
        mapRef.current?.animateToRegion(userLocation, 1000); // Reset to user location
      }
    }
  };

  const handleMarkerPress = (place) => {
    navigation.navigate('chargingStationProfile', {
      station: place,
    });
  };

  const renderStationCard = ({ item }) => (
    <TouchableOpacity
      style={styles.stationCard}
      onPress={() => handleMarkerPress(item)}
    >
      <Image
        source={{ uri: item.ImageUrl }}
        style={styles.stationImage}
      />
      <View style={styles.stationInfo}>
        <Text style={styles.stationName}>{item.Name}</Text>
        <Text style={styles.stationLocation}>{item.Location}</Text>
      </View>
    </TouchableOpacity>
  );

  if (!userLocation || !filteredPlaces.length) return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <SearchBar
        placeholder="Search by station or city..."
        value={searchQuery}
        onChangeText={handleSearch}
        platform="default"
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInput}
      />
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={userLocation || colomboRegion}
          showsUserLocation={true}
          followsUserLocation={false}
        >
          {filteredPlaces.map((place) => (
            <Marker
              key={place.StationID}
              coordinate={{
                latitude: place.Latitude,
                longitude: place.Longitude,
              }}
              title={place.Name}
              description={place.Location}
              onPress={() => handleMarkerPress(place)}
            />
          ))}
        </MapView>
        <FlatList
          data={nearestStations}
          horizontal
          keyExtractor={(item) => item.StationID.toString()}
          renderItem={renderStationCard}
          style={styles.slideBar}
        />
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
  searchContainer: {
    backgroundColor: 'white',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    paddingHorizontal: 10,
  },
  searchInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  slideBar: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  stationCard: {
    width: 250,
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  stationImage: {
    width: '100%',
    height: 120,
  },
  stationInfo: {
    padding: 10,
  },
  stationName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stationLocation: {
    fontSize: 14,
    color: 'gray',
  },
});
