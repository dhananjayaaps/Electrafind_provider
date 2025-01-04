import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { VehicleContext } from '../../Context/VehicleContext'; // Import the context
import images from '../../../constants/images';

export default function VehicleDetailProfile({ route }) {
  const navigation = useNavigation();
  const { vehicle } = route.params;
  
  const { toggleFavorite, favoriteVehicles } = useContext(VehicleContext); // Get context values
  const isFavorite = favoriteVehicles.some((fav) => fav.id === vehicle.id); // Check if the vehicle is in favorites

  const handleCallPress = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleSharePress = async () => {
    try {
      await Share.share({
        message: `Check out this vehicle: ${vehicle.name} ${vehicle.model} (${vehicle.manufacturedYear}) for Rs. ${vehicle.price}. Contact: ${vehicle.phoneNumber}.`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleFavoritePress = () => {
    toggleFavorite(vehicle); // Toggle the favorite status using context
  };

  return (
    <View>
      <ScrollView>
        <View className="relative">
          <Image
            source={vehicle?.images?.length > 0 ? { uri: vehicle.images[0] } : images.carImage}
            style={styles.image}
          />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ position: 'absolute', top: 35, left: 5 }}
            activeOpacity={0.7}
            className={'p-2'}
          >
            <Ionicons
              name="arrow-back-outline"
              resizeMode="contain"
              color="#ffffff"
              size={30}
              style={{
                padding: 3,
                backgroundColor: '#161622',
                borderRadius: 30,
                opacity: 0.7,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleFavoritePress}
            style={{ position: 'absolute', top: 35, right: 10 }}
            activeOpacity={0.7}
            className={'p-2'}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              resizeMode="contain"
              color={isFavorite ? "#e63946" : "#ffffff"}
              size={30}
              style={{
                padding: 3,
                backgroundColor: '#161622',
                borderRadius: 30,
                opacity: 0.7,
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 40 }} className="bg-white -mt-8 pt-4">
          <View className="px-5 mb-2">
            <View className="flex-row items-center space-x-1 mt-2">
              <Text className="text-3xl font-bold">{vehicle.name} </Text>
              <Text className="text-3xl font-bold">{vehicle.model} </Text>
              <Text className="text-3xl font-bold">{vehicle.manufacturedYear}</Text>
            </View>
            <Text style={{ color: '#000000' }} className={'text-xl font-semibold mt-3'}>
              Rs. {vehicle.price} ~
            </Text>
          </View>
        </View>

        <View className="flex-row items-center space-x-1 mt-2">
          <TouchableOpacity style={styles.button1} onPress={() => handleCallPress(vehicle.phoneNumber)}>
            <Ionicons
              name="call"
              resizeMode="contain"
              color="#ffffff"
              size={30}
              style={{
                padding: 3,
                backgroundColor: '#1eb814',
                borderRadius: 30,
                opacity: 0.7,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2} onPress={handleSharePress}>
            <Ionicons
              name="share"
              resizeMode="contain"
              color="#ffffff"
              size={30}
              style={{
                padding: 3,
                backgroundColor: 'transparent',
                borderRadius: 30,
                opacity: 0.7,
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.divider}></View>

        <View style={styles.card}>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Manufactured Year:</Text>
              <Text style={styles.infoValue}>{vehicle.manufacturedYear}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Registered Year:</Text>
              <Text style={styles.infoValue}>{vehicle.registeredYear}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Price:</Text>
              <Text style={styles.infoValue}>{vehicle.price}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Range:</Text>
              <Text style={styles.infoValue}>{vehicle.range}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mileage:</Text>
              <Text style={styles.infoValue}>{vehicle.mileage}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Description:</Text>
              <Text style={styles.infoValue}>{vehicle.description}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone Number:</Text>
              <Text style={styles.infoValue}>{vehicle.phoneNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nearest City:</Text>
              <Text style={styles.infoValue}>{vehicle.nearestCity}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>District:</Text>
              <Text style={styles.infoValue}>{vehicle.district}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  button1: {
    flex: 1,
    backgroundColor: '#1eb814',
    padding: 10,
    width: 260,
    alignItems: 'center',
    borderRadius: 10,
    margin: 7,
  },
  button2: {
    backgroundColor: '#161622',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    margin: 10,
  },
  price: {
    padding: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    width: 190,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '500',
    color: '#555',
    textAlign: 'left',
    flex: 1,
  },
});
