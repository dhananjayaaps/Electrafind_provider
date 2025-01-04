import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import images from '../../../constants/images'

export default function EditCarProfile({ navigation }) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [range, setRange] = useState('');
  const [lastService, setLastService] = useState('');
  const [lastTyre, setLastTyre] = useState('');
  const [numberPlate, setNumberPlate] = useState('');
  const [connectorTypes, setConnectorTypes] = useState({
    Type1: false,
    Type2: false,
    CCS: false,
    CHAdeMO: false,
  });
  const [vehiclePhoto, setVehiclePhoto] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setVehiclePhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const selectedConnectors = Object.keys(connectorTypes).filter(
      (key) => connectorTypes[key]
    );

    const carDetails = {
      brand,
      model,
      range,
      lastService,
      lastTyre,
      numberPlate,
      connectorTypes: selectedConnectors,
      vehiclePhoto,
    };

    try {
      await AsyncStorage.setItem('carDetails', JSON.stringify(carDetails));
      Alert.alert('Success', 'Car details updated');
      navigation.navigate('carProfile'); // Navigate back to CarProfile
    } catch (error) {
      Alert.alert('Error', 'Failed to save car details');
    }
  };

  const handleCheckboxChange = (type) => {
    setConnectorTypes((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };

  return (
    <ScrollView>
      <View style={styles.container}>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.title}>Edit Vehicle Details</Text>
        </View>

        <Text style={styles.label}>Brand</Text>
        <TextInput style={styles.input} value={brand} onChangeText={setBrand} />

        <Text style={styles.label}>Model</Text>
        <TextInput style={styles.input} value={model} onChangeText={setModel} />

        <Text style={styles.label}>Number Plate</Text>
        <TextInput style={styles.input} value={numberPlate} onChangeText={setNumberPlate} />

        <Text style={styles.label}>Range (km)</Text>
        <TextInput style={styles.input} value={range} onChangeText={setRange} keyboardType="numeric" />

        <Text style={styles.label}>Last Service (km)</Text>
        <TextInput style={styles.input} value={lastService} onChangeText={setLastService} keyboardType="numeric" />

        <Text style={styles.label}>Last Tyre Changed (km)</Text>
        <TextInput style={styles.input} value={lastTyre} onChangeText={setLastTyre} keyboardType="numeric" />

        {/* Checkboxes for Connector Types */}
        <Text style={styles.label}>Connector Types</Text>
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxRow}>
            <Checkbox
              value={connectorTypes.Type1}
              onValueChange={() => handleCheckboxChange('Type1')}
            />
            <Text style={styles.checkboxLabel}>Type 1</Text>
          </View>
          <View style={styles.checkboxRow}>
            <Checkbox
              value={connectorTypes.Type2}
              onValueChange={() => handleCheckboxChange('Type2')}
            />
            <Text style={styles.checkboxLabel}>Type 2</Text>
          </View>
          <View style={styles.checkboxRow}>
            <Checkbox
              value={connectorTypes.CCS}
              onValueChange={() => handleCheckboxChange('CCS')}
            />
            <Text style={styles.checkboxLabel}>CCS</Text>
          </View>
          <View style={styles.checkboxRow}>
            <Checkbox
              value={connectorTypes.CHAdeMO}
              onValueChange={() => handleCheckboxChange('CHAdeMO')}
            />
            <Text style={styles.checkboxLabel}>CHAdeMO</Text>
          </View>
        </View>

        

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {vehiclePhoto ? (
            <Image source={{ uri: vehiclePhoto }} style={styles.vehicleImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageText}>Upload Vehicle Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={{ color: '#ffffff', fontSize: 18 }}>Submit</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    marginTop: 20,
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
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 0,
    borderColor: '#ccc',
    backgroundColor: '#D3EDDE',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 14,
  },
  checkboxContainer: {
    marginBottom: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 14,
  },
  imagePicker: {
    marginBottom: 15,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D3EDDE',
    borderRadius: 10,
  },
  imageText: {
    marginTop: 10,
    color: '#999',
  },
  vehicleImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  }
});
