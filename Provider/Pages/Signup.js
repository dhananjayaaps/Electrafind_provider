import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Button,
  Image
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { API_URL, API_KEY } from '@env';

export default function Signup() {
  const navigation = useNavigation();

  // State hooks
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [latitude, setLatitude] = useState(6.9271); // Default to Colombo
  const [longitude, setLongitude] = useState(79.8612); // Default to Colombo
  const [availableStartTime, setAvailableStartTime] = useState('');
  const [availableEndTime, setAvailableEndTime] = useState('');
  const [prices, setPrices] = useState({
    level1: { price: -1, active: false },
    level2: { price: -1, active: false },
    level3: { price: -1, active: false },
  });

  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

  const [image, setImage] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        error => {
          console.log(error);
        }
      );
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    // console.log(API_URL)
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only show images
      allowsEditing: true, // Enable cropping
      quality: 1, // Image quality (1 is best)
      aspect: [4, 3], // Image aspect ratio
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri); // Set the selected image URI
    }
  };

  const handleSignup = async () => {
    if (
      !name ||
      !email ||
      !password ||
      !locationAddress ||
      !availableStartTime ||
      !availableEndTime ||
      !latitude ||
      !longitude ||
      !prices ||
      !image
    ) {
      Alert.alert('Error', 'Please fill all the fields and upload an image.');
      return;
    }
  
    try {
      // Step 1: Upload the image and get its URL
      const formData = new FormData();
      formData.append('file', {
        uri: image,
        type: 'image/jpeg', // Adjust type as needed
        name: 'station_image.jpg',
      });
  
      const imageUploadResponse = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      if (!imageUploadResponse.ok) {
        const errorData = await imageUploadResponse.json();
        Alert.alert('Error', errorData.message || 'Failed to upload image.');
        return;
      }
  
      const imageUploadData = await imageUploadResponse.json();
      const uploadedImageUrl = imageUploadData.url;

      // Step 2: Prepare the registration payload
      const payload = {
        Name: name,
        Email: email,
        Password: password,
        Location: locationAddress,
        Latitude: latitude,
        Longitude: longitude,
        AvailableStartTime: availableStartTime,
        AvailableEndTime: availableEndTime,
        Prices: prices,
        ImageUrl: uploadedImageUrl, // Include the image URL
      };
  
      // console.log('Registration Payload:', payload);
      console.log('API URL:', API_URL);
      const response = await fetch(`${API_URL}/stations/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Something went wrong.');
        return;
      }
  
      const data = await response.json();
      Alert.alert('Success', 'Charging station registered successfully!');
      console.log('Response data:', data);
  
      navigation.navigate('Login'); // Navigate to the home screen
    } catch (error) {
      console.error('Signup Error:', error);
      Alert.alert('Error', 'Unable to connect to the server.');
    }
  };
  
  
  const toggleChargeType = (type) => {
    setPrices(prevPrices => {
      const updatedPrices = { ...prevPrices };
      updatedPrices[type].active = !updatedPrices[type].active;
      if (!updatedPrices[type].active) {
        updatedPrices[type].price = -1;
      }
      return updatedPrices;
    });
  };

  const setChargePrice = (type, price) => {
    setPrices(prevPrices => {
      const updatedPrices = { ...prevPrices };
      updatedPrices[type].price = price;
      return updatedPrices;
    });
  };

  const showStartTimePicker = () => setStartTimePickerVisible(true);
  const hideStartTimePicker = () => setStartTimePickerVisible(false);
  const handleStartTimeConfirm = (time) => {
    setAvailableStartTime(time.toLocaleTimeString());
    hideStartTimePicker();
  };

  const showEndTimePicker = () => setEndTimePickerVisible(true);
  const hideEndTimePicker = () => setEndTimePickerVisible(false);
  const handleEndTimeConfirm = (time) => {
    setAvailableEndTime(time.toLocaleTimeString());
    hideEndTimePicker();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>Station Registration</Text>

        {/* Name Email and Password */}
        <Text style={styles.label}>Station Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Station Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Station Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Station Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Location */}
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Location Address"
          placeholderTextColor="#aaa"
          value={locationAddress}
          onChangeText={setLocationAddress}
        />
        <Text style={styles.label}>Pick Location</Text>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            onPress={(e) => {
              setLatitude(e.nativeEvent.coordinate.latitude);
              setLongitude(e.nativeEvent.coordinate.longitude);
            }}
          >
            <Marker coordinate={{ latitude, longitude }} title="Location" />
          </MapView>
        </View>

        {/* Available Time */}
        <Text style={styles.label}>Available Start Time</Text>
        <TouchableOpacity onPress={showStartTimePicker}>
          <TextInput
            style={styles.input}
            value={availableStartTime}
            placeholder="Select Start Time"
            placeholderTextColor="#aaa"
            editable={false}
          />
        </TouchableOpacity>
        <Text style={styles.label}>Available End Time</Text>
        <TouchableOpacity onPress={showEndTimePicker}>
          <TextInput
            style={styles.input}
            value={availableEndTime}
            placeholder="Select End Time"
            placeholderTextColor="#aaa"
            editable={false}
          />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isStartTimePickerVisible}
          mode="time"
          onConfirm={handleStartTimeConfirm}
          onCancel={hideStartTimePicker}
        />
        <DateTimePickerModal
          isVisible={isEndTimePickerVisible}
          mode="time"
          onConfirm={handleEndTimeConfirm}
          onCancel={hideEndTimePicker}
        />

        {/* Charge Types */}
        <Text style={styles.chargeHeading}>Charge Type Pricing</Text>
        {Object.keys(prices).map((type) => (
          <View key={type} style={styles.chargeContainer}>
            <TouchableOpacity onPress={() => toggleChargeType(type)}>
              <Text style={styles.chargeName}>{type.toUpperCase()}</Text>
            </TouchableOpacity>
            {prices[type].active && (
              <TextInput
                style={styles.input}
                placeholder="Enter Price"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={prices[type].price === -1 ? '' : prices[type].price.toString()}
                onChangeText={(text) => setChargePrice(type, parseFloat(text) || -1)}
              />
            )}
          </View>
        ))}

        {/* Image Upload */}
        <Text style={styles.label}>Upload Station Image</Text>

        <Button title="Pick an Image" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={{ height: 200, marginTop:10 }} />}

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#110F0F',
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    color: '#000',
  },
  mapContainer: {
    height: 200,
    marginVertical: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  chargeHeading: {
    fontSize: 20,
    color: '#fff',
    marginVertical: 15,
  },
  chargeContainer: {
    marginBottom: 15,
  },
  chargeName: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#3a8dff',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
