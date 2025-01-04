import { Text, View, StyleSheet, ScrollView } from 'react-native';
import React, { useContext, useState } from 'react';
import Header from '../../screens/Market/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VehicleContext } from '../../Context/VehicleContext';
import VehicleCard from '../../screens/Market/MarketItem';
import { useNavigation } from '@react-navigation/native';

export default function MarketScreen() {
  const { vehicles, favoriteVehicles } = useContext(VehicleContext); // Access favoriteVehicles from context
  const [selectedCategory, setSelectedCategory] = useState('e-car');
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCardPress = (vehicle) => {
    navigation.navigate('vehicleDetailProfile', { vehicle });
  };

  const filteredVehicles = selectedCategory === 'favorites'
    ? favoriteVehicles.filter(vehicle =>
        vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : vehicles.filter(vehicle =>
        vehicle.category === selectedCategory &&
        (vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const recommendations = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header onCategoryChanged={handleCategoryChange} onSearch={handleSearch} recommendations={recommendations} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} onPress={handleCardPress} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No vehicles available in this category</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    height: '23%',
    zIndex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
});
