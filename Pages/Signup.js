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
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import { launchImageLibrary } from 'react-native-image-picker';

export default function Signup() {
  const navigation = useNavigation();

  // State hooks
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

  const [imageUri, setImageUri] = useState(null); // Store selected image URI
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // Store uploaded image URL

  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

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


  // const handleImagePicker = async () => {
  //   const result = await launchImageLibrary({
  //     mediaType: 'photo',
  //     quality: 0.8,
  //   });

  //   if (result.didCancel) {
  //     console.log('User cancelled image picker');
  //   } else if (result.errorCode) {
  //     console.error('ImagePicker Error: ', result.errorMessage);
  //   } else {
  //     const { uri } = result.assets[0];
  //     setImageUri(uri);
  //     await uploadImage(uri);
  //   }
  // };

  const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  
   handleGalleryClick = () => {
   ImagePicker.launchImageLibrary(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      const source = { uri: response.uri };
      this.setState({
        avatarSource: source,
      });
    }
  });
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg', // Adjust if needed
      name: 'upload.jpg',
    });

    try {
      const response = await fetch('http://localhost/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        Alert.alert('Error', 'Failed to upload image');
        return;
      }

      const data = await response.json();
      setUploadedImageUrl(data.url); // Assuming your API returns the image URL in `data.url`
      Alert.alert('Success', 'Image uploaded successfully!');
    } catch (error) {
      console.error('Image Upload Error:', error);
      Alert.alert('Error', 'Unable to upload image.');
    }
  };

  const handleSignup = async () => {
    if (
      !email ||
      !password ||
      !locationAddress ||
      !availableStartTime ||
      !availableEndTime ||
      !latitude ||
      !longitude ||
      !prices ||
      !uploadedImageUrl
    ) {
      Alert.alert('Error', 'Please fill all the fields and upload an image.');
      return;
    }

    const payload = {
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

    try {
      const response = await fetch('http://localhost/register', {
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

      navigation.navigate('Home'); // Navigate to home screen
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

        {/* Email and Password */}
        <TextInput
          style={styles.input}
          placeholder="Station Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Location */}
        <TextInput
          style={styles.input}
          placeholder="Location Address"
          placeholderTextColor="#aaa"
          value={locationAddress}
          onChangeText={setLocationAddress}
        />
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
        {/* <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
          <Text style={styles.buttonText}>Select Image</Text>
        </TouchableOpacity>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
        {uploadedImageUrl && <Text style={styles.successText}>Image uploaded successfully!</Text>}
 */}
        <TouchableOpacity onPress={this.handleGalleryClick}>
        <Text>Open Gallery</Text>
        </TouchableOpacity>

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
