import { Text, View, StyleSheet, ScrollView } from 'react-native';
import React, { useContext, useState } from 'react';
import GarageHeader from '../../screens/service/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GarageContext } from '../../Context/GarageContext';
import GarageCard from '../../screens/service/GarageItem'; // Assuming you have a GarageItem component similar to VehicleCard
import { useNavigation } from '@react-navigation/native';

export default function GarageScreen() {

  const { garages } = useContext(GarageContext);
  const [selectedCategory, setSelectedCategory] = useState('mechanic');
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCardPress = (garage) => {
    navigation.navigate('Profile', { garage });
  };

  const filteredGarages = garages.filter(garage =>
    garage.type === selectedCategory &&
    (garage.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      garage.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      garage.services.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const recommendations = garages.filter(garage =>
    garage.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    garage.services.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.headerContainer}>
          <GarageHeader onCategoryChanged={handleCategoryChange} onSearch={handleSearch} recommendations={recommendations}/>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {filteredGarages.length > 0 ? (
            filteredGarages.map((garage) => (
              <GarageCard key={garage.id} garage={garage} onPress={handleCardPress} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No garages available in this category</Text>
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
