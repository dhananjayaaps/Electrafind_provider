import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import Navbar from '../components/Navbar';
import MapView, { Marker } from 'react-native-maps';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';

const InputFields = ({ label, placeholder, value, onChangeText, secureTextEntry, style }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  </View>
);

export default function Signup() {
  const navigation = useNavigation();

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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        error => console.log(error)
      );
    }
  }, []);

  const handleSignup = () => {
    if (!email || !password || !locationAddress || !availableStartTime || !availableEndTime) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }
    console.log({
      email,
      password,
      locationAddress,
      latitude,
      longitude,
      availableStartTime,
      availableEndTime,
      prices,
    });
    navigation.navigate('Home');
  };

  const toggleChargeType = (type) => {
    setPrices(prevPrices => {
      const newPrices = { ...prevPrices };
      newPrices[type].active = !newPrices[type].active;
      if (!newPrices[type].active) newPrices[type].price = -1;
      return newPrices;
    });
  };

  const setChargePrice = (type, price) => {
    setPrices(prevPrices => {
      const newPrices = { ...prevPrices };
      newPrices[type].price = price;
      return newPrices;
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
        <View style={styles.header}>
          <Text style={styles.headerText}>Sign Up</Text>
        </View>

        <InputFields label="Station Email" placeholder="Enter Station Email" value={email} onChangeText={setEmail} style={styles.fullWidthInput} />
        <InputFields label="Password" placeholder="Enter Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.fullWidthInput} />

        <InputFields label="Location Address" placeholder="Enter Location Address" value={locationAddress} onChangeText={setLocationAddress} style={styles.fullWidthInput} />

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

        <View style={styles.availableTimeContainer}>
          <InputFields label="Available Start Time" placeholder="Select Start Time" value={availableStartTime} onChangeText={() => {}} style={styles.fullWidthInput} />
          <InputFields label="Available End Time" placeholder="Select End Time" value={availableEndTime} onChangeText={() => {}} style={styles.fullWidthInput} />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSignup}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#110F0F',
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  inputs: {
    marginTop: 30,
  },
  mapContainer: {
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  availableTimeContainer: {
    marginTop: 30,
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
  },
  chargeTypes: {
    marginTop: 30,
  },
  chargeHeading: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
  },
  chargeName: {
    fontSize: 18,
    color: '#fff',
  },
  availableContainer: {
    marginBottom: 20,
  },
  priceInput: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#3a8dff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
