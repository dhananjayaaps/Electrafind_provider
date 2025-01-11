import { View, Text, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import images from '../../../constants/images';

const screenWidth = Dimensions.get('screen').width;

export default function GarageCard({ garage, onPress }) {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={() => onPress(garage)}>
      <LinearGradient colors={['transparent', '#ffffff']}>
        <Image
          source={garage?.ImageUrl ? { uri: garage.ImageUrl } : images.serviceImage}
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{garage.Name}</Text>
          {/* <Text style={styles.subtitle}>{garage.UserType}</Text> */}
          <Text style={styles.subtitle}>{garage.Address}</Text>
          {/* <Text style={styles.subtitle}>{garage.PhoneNumber}</Text> */}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: screenWidth * 0.9,
    backgroundColor: '#ffffff',
    marginVertical: 5,
    borderRadius: 10,
    padding: 0,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    fontSize: 15,
  },
});
