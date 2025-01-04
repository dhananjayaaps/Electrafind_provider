import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import images from '../../../constants/images';

const screenWidth = Dimensions.get('screen').width;

export default function VehicleCard({ vehicle, onPress }) {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={() => onPress(vehicle)}>
      <View style={styles.rowContainer}>
        <Image
          source={vehicle?.images?.length > 0 ? { uri: vehicle.images[0] } : images.carImage}
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{vehicle.name}</Text>
            <Text style={styles.title}>{vehicle.model}</Text>
            <Text style={styles.subtitle}>{vehicle.manufacturedYear}</Text>
          </View> 
          <Text style={styles.price}>Rs. {vehicle.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: screenWidth * 0.90,
    backgroundColor: '#ffffff',
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 5,
  },
  subtitle: { 
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 15,
    color: '#000000', // Change to a stylish color
    marginTop: 15,
  },
});
