import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import images from '../../../constants/images'; // Ensure you have a default image for garages

export default function GarageDetailProfile({ route }) {

  const navigation = useNavigation();

  const { garage } = route.params;

  const handleCallPress = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleSharePress = async () => {
    try {
      await Share.share({
        message: `Check out this garage: ${garage.name} located at ${garage.location}. Contact: ${garage.contactNumber}.`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View>
      <ScrollView>
        <View className="relative">
          <Image 
            source={garage?.images?.length > 0 ? { uri: garage.images[0] } : images.serviceImage} 
            style={styles.image} 
          />
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 35, left: 5, }} activeOpacity={0.7} className={'p-2'}>
            <Ionicons
              name={"arrow-back-outline"}
              resizeMode="contain"
              color={"#ffffff"}
              size={30}
              style={{ padding: 3, backgroundColor: '#161622', borderRadius: 30, opacity: 0.7 }}
            />
          </TouchableOpacity>
        </View>

        <View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 40 }} className="bg-white -mt-8 pt-4">
          <View className="px-5 mb-2">
            <View className="flex-row items-center space-x-1 mt-2">
              <Text className="text-3xl font-bold">{garage.name} </Text>
              <Text className="text-3xl font-bold">{garage.type} </Text>
            </View>
            <Text style={{ color:'#000000' }} className={'text-xl font-semibold mt-3'}>{garage.location}</Text>
          </View>
        </View>

        <View className="flex-row items-center space-x-1 mt-2">
          <TouchableOpacity style={styles.button1} onPress={() => handleCallPress(garage.contactNumber)}>
            <Ionicons
              name={"call"}
              resizeMode="contain"
              color={"#ffffff"}
              size={30}
              style={{ padding: 3, backgroundColor: '#1eb814', borderRadius: 30, opacity: 0.7 }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2} onPress={handleSharePress}>
            <Ionicons
              name={"share"}
              resizeMode="contain"
              color={"#ffffff"}
              size={30}
              style={{ padding: 3, backgroundColor: 'transparent', borderRadius: 30, opacity: 0.7 }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.divider}></View>

        <View style={styles.card}>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{garage.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type:</Text>
              <Text style={styles.infoValue}>{garage.type}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location:</Text>
              <Text style={styles.infoValue}>{garage.location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Contact Number:</Text>
              <Text style={styles.infoValue}>{garage.contactNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Services Offered:</Text>
              <Text style={styles.infoValue}>{garage.services}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Description:</Text>
              <Text style={styles.infoValue}>{garage.description}</Text>
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
    alignItems: 'flex-start'
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
  }
});
