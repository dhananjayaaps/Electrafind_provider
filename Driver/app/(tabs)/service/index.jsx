import { Text, View, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import GarageHeader from '../../screens/service/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import GarageCard from '../../screens/service/GarageItem';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';

export default function GarageScreen() {
  const [garages, setGarages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Garage');
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

  const filteredGarages = garages.filter((garage) => {
    const matchesCategory = garage.UserType === selectedCategory;
    const matchesSearchQuery =
      garage.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      garage.Address.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearchQuery;
  });

  useEffect(() => {
    const fetchGarages = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/garages`);
        setGarages(response.data);
      } catch (error) {
        console.error('Error fetching garages:', error);
      }
    };

    fetchGarages();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <GarageHeader
            onCategoryChanged={handleCategoryChange}
            onSearch={handleSearch}
            recommendations={garages} // Pass garages for recommendations
          />
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {filteredGarages.length > 0 ? (
            filteredGarages.map((garage) => (
              <GarageCard key={garage.UserID} garage={garage} onPress={handleCardPress} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No garages or mechanics available for your search.
              </Text>
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
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
});
