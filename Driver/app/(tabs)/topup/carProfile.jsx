import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import images from '../../../constants/images';
import { Ionicons } from '@expo/vector-icons';


const chargerImages = {
  Type1: images.type1,
  Type2: images.type2,
  CCS: images.ccstype2,
  CHAdeMO: images.chademo
}

export default function CarProfile({ navigation }) {
  const [carDetails, setCarDetails] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const data = await AsyncStorage.getItem('carDetails');
        if (data !== null) {
          setCarDetails(JSON.parse(data));
        }
      } catch (error) {
        console.error('Failed to fetch car details', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchCarDetails); // Refresh when returning to the screen

    return unsubscribe;
  }, [navigation]);

  if (!carDetails) {
    return (
      <View style={styles.container}>
        <Text>No car details found</Text>
        <Button title="Edit Car Profile" onPress={() => navigation.navigate('editCarProfile')} />
      </View>
    );
  }

  return (
    <ScrollView>
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.headerText}>
        <Text style={styles.title}>Car Profile</Text>
      </View>
      <View style={styles.header}>
        <Image source={{ uri: carDetails.vehiclePhoto }} style={styles.carImage} />
        <View style={styles.headerInfo}>
          <Text style={styles.carTitle}>{carDetails.brand}</Text>
          <Text style={styles.carDetails}>{carDetails.model}</Text>
        </View>
      </View>

      <View style={styles.NumRange}>
        <View style={styles.subheader}>
          <Text style={styles.carNumberPlate}>{carDetails.numberPlate}</Text>
        </View>

        <View style={styles.subheader}>
          <Text style={styles.infoLabel}>EV Range:</Text><Text style={styles.range}>{carDetails.range} Km</Text>
        </View>
      </View>

      <View style={styles.NumRange}>
        <View style={styles.subsubheader}>
          <Text style={styles.infoLabel}>Last Service: </Text><Text style={styles.range}>{carDetails.lastService} Km</Text>
          <Text style={styles.infoLabel}>Last Tyre Change: </Text><Text style={styles.range}>{carDetails.lastTyre} Km</Text>
        </View>

        <View style={styles.subsubheader}>
        <Text style={styles.infoLabel}>Connector Types: </Text>
        {carDetails.connectorTypes && carDetails.connectorTypes.length > 0
          ? carDetails.connectorTypes.map((type, index) => (
              <View key={index} style={styles.chargerRow}>
                <Image source={chargerImages[type]} style={styles.chargerImage} />
                {/* <Text style={styles.range}>{type}</Text> */}
              </View>
            ))
          : <Text style={styles.range}>No connector types selected</Text>
        }
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('editCarProfile')}>
          <Text style={styles.buttonText}>Edit Car Profile</Text>
      </TouchableOpacity>

    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    marginTop: 20,
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 15,
    zIndex: 1,
  },
  headerText: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D3EDDE',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  NumRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  subheader: {
    backgroundColor: '#D3EDDE',
    borderRadius: 10,
    marginBottom: 20,
    width: 170,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  subsubheader: {
    backgroundColor: '#D3EDDE',
    borderRadius: 10,
    marginBottom: 20,
    width: 170,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },

  carNumberPlate: {
    color: 'black',
    fontSize: 30,
    padding: 10,
    fontWeight: 'bold',
  },


  carImage: {
    width: 170,
    height: 170,
    borderRadius: 10,
  
  },
  headerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  carTitle: {
    color: 'black',
    fontSize: 40,
    fontWeight: 'bold',
  },
  carDetails: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoLabel: {
    fontSize: 16,
    color: '#000000',

  },
  range: {
    fontSize: 30,
    marginVertical: 10,
    color: '#000000',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  chargerImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginTop: 10,
  }
});
