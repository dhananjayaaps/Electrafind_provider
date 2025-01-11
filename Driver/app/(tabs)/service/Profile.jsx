import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, Share, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import images from '../../../constants/images'; // Ensure you have a default image for garages

export default function GarageDetailProfile({ route }) {
  const navigation = useNavigation();
  const [garage, setGarage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from params
    const fetchGarage = async () => {
      try {
        const garageData = route.params;
        setGarage(garageData.garage || {}); // Default to an empty object if no data
        // console.log("showing garage is", garage.garage);  
      } catch (error) {
        console.error('Error fetching garage data:', error);
      } finally {
        setLoading(false);
        console.log("garage is", garage);
      }
    };

    fetchGarage();
  }, [route.params]);

  const handleCallPress = (phoneNumber) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
        alert("Unable to make a call. Please check the phone number.")
      );
    } else {
      alert("Phone number is not available.");
    }
  };

  const handleSharePress = async () => {
    try {
      await Share.share({
        message: `Check out this garage: ${garage?.Name || 'N/A'} located at ${garage?.Address || 'N/A'}. Contact: ${garage?.PhoneNumber || 'N/A'}.`,
      });
    } catch (error) {
      alert("Unable to share at the moment. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading garage details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image
            source={garage?.ImageUrl ? { uri: garage.ImageUrl } : images.serviceImage}
            style={styles.image}
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back-outline"
              color="#ffffff"
              size={30}
              style={styles.backIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailsHeader}>
            <Text style={styles.garageName}>{garage?.Name || 'N/A'}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.callButton} onPress={() => handleCallPress(garage?.PhoneNumber)}>
              <Ionicons name="call" color="#ffffff" size={30} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={handleSharePress}>
              <Ionicons name="share-social" color="#ffffff" size={30} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider}></View>

          <View style={styles.infoContainer}>
            {[
              { label: 'Name:', value: garage?.Name },
              { label: 'Type:', value: garage?.UserType },
              { label: 'Location:', value: garage?.Address },
              { label: 'Contact Number:', value: garage?.PhoneNumber },
              // { label: 'Services Offered:', value: garage?.services },
              // { label: 'Description:', value: garage?.description },
            ].map((item, index) => (
              <View key={index} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value || 'N/A'}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 35,
    left: 15,
    backgroundColor: '#161622',
    borderRadius: 15,
    padding: 5,
    opacity: 0.8,
  },
  backIcon: {
    padding: 3,
  },
  detailsContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    marginTop: -10,
    padding: 20,
  },
  detailsHeader: {
    marginBottom: 10,
  },
  garageName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  garageType: {
    fontSize: 20,
    fontWeight: '500',
    color: '#555',
    marginVertical: 5,
  },
  garageLocation: {
    fontSize: 18,
    color: '#777',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  callButton: {
    backgroundColor: '#1eb814',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  shareButton: {
    backgroundColor: '#161622',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  infoContainer: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    width: '40%',
  },
  infoValue: {
    fontSize: 16,
    color: '#555',
    width: '60%',
  },
});
