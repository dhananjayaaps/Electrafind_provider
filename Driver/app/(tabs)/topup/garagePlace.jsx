import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import React, { useState, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderMarketForm from '../../screens/topup/HeaderMarketForm';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { GarageContext } from '../../Context/GarageContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function GaragePlace() {

  const { addGarage } = useContext(GarageContext);
  const navigation = useNavigation();

  const [garageName, setGarageName] = useState('');
  const [garageType, setGarageType] = useState('mechanic');
  const [location, setLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [servicesOffered, setServicesOffered] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  const handleAddGarage = () => {
    // Handle the form submission logic here
    const newGarage = {
      id: Date.now().toString(),
      name: garageName,
      type: garageType,
      location,
      contactNumber,
      address,
      services: servicesOffered,
      description,
      images,
    };

    addGarage(newGarage); // Add to your context or state management

    Alert.alert('Form Submitted', 'Your garage/service station has been listed.', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('index'), // Navigate to the index page
      },
    ]);
  };

  const pickImage = async () => {
    if (images.length >= 3) {
      Alert.alert('Limit Reached', 'You can upload a maximum of 3 images.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (uri) => {
    setImages(images.filter(image => image !== uri));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <View style={styles.headerContainer}>
        <HeaderMarketForm />
      </View> */}
      
      <View style={styles.textContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.text} className={'font-pbold'}>
          List your Garage or Service Station on our platform
        </Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Garage Name"
            value={garageName}
            onChangeText={setGarageName}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={garageType}
              onValueChange={(itemValue) => setGarageType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Mechanic" value="mechanic" />
              <Picker.Item label="Service Station" value="service-station" />
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            style={styles.input}
            placeholder="Services Offered"
            value={servicesOffered}
            onChangeText={setServicesOffered}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <View style={styles.imageContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: image }} style={styles.image} />
                <TouchableOpacity onPress={() => removeImage(image)} style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.buttonUpload} onPress={pickImage}>
            <Text style={styles.buttonTextUpload}>Upload Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleAddGarage}>
            <Text style={styles.buttonText}>List Garage</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#161622',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textContainer: {
    marginTop: 20, // Adjust this value as needed to control the space between header and text
    paddingHorizontal: 20, // Add some padding for better text appearance
  },
  text: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0,
    backgroundColor: '#D3EDDE',
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  textArea: {
    height: 100,
  },
  pickerContainer: {
    height: 150,
    borderColor: 'gray',
    borderWidth: 0,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#D3EDDE',
    overflow: 'hidden',
    justifyContent: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  picker: {
    height: 190,
    width: '100%',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  imageWrapper: {
    position: 'relative',
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#000000',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  buttonUpload: {
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonTextUpload: {
    color: '#000000',
    fontSize: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 1,
  }
});
