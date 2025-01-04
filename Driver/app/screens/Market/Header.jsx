import React, { useRef, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const categories = [
  {
    name: 'E-Cars',
    icon: 'directions-car',
    value: 'e-car',
  },
  {
    name: 'E-Bikes',
    icon: 'two-wheeler',
    value: 'e-bike',
  },
  {
    name: 'E-Cycles',
    icon: 'directions-bike',
    value: 'e-cycle',
  },
  {
    name: 'Favorites',
    icon: 'favorite', // or 'heart' for Ionicons
    value: 'favorites',
  },
];

const Header = ({ onCategoryChanged, onSearch, recommendations }) => {
  const scrollRef = useRef(null);
  const itemsRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const selectCategory = (index) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measure((x, y, width, height, pageX) => {
      scrollRef.current?.scrollTo({ x: pageX - 16, y: 0, animated: true });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].value);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Vehicles . ElectraFind"
              placeholderTextColor="#d9d9d9"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Ionicons name="search" size={24} color="#ffffff" />
            </TouchableOpacity>
            {searchQuery.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {categories.map((item, index) => (
            <TouchableOpacity
              ref={(el) => (itemsRef.current[index] = el)}
              key={index}
              style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
              onPress={() => selectCategory(index)}
            >
              <MaterialIcons
                name={item.icon}
                size={28}
                color={activeIndex === index ? '#ffffff' : '#888888'}
              />
              <Text style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {  
    backgroundColor: '#000000',
    height: 150,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  actionRow: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c2c2c2',
    borderRadius: 30,
    padding: 10,
    width: '90%',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },

  searchButton: {
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 5,
    marginLeft: 5,
  },
  clearButton: {
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 5,
    marginLeft: 5,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#ffffff',
  },
  recommendationList: {
    maxHeight: 200,
    backgroundColor: '#000000',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c2c2c2',
    borderRadius: 10,
    marginHorizontal: 16,
    position: 'absolute', // Position the recommendation list absolutely
    top: 100, // Adjust as needed
    left: 0,
    right: 0,
    zIndex: 1, // Ensure the list appears above other content
  },
  recommendationItem: {
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c2c2c2',
    color: '#ffffff',
  },
  categoryText: {
    fontSize: 14,
    color: '#888888',
  },
  categoryTextActive: {
    fontSize: 14,
    color: '#ffffff',
  },
  categoriesBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  categoriesBtnActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#ffffff',
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
  scrollContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
  },
});

export default Header;
