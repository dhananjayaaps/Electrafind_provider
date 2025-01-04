import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-expo';

export default function EditProfile({ navigation }) {
  const { user } = useUser(); // Get user object
  const [phone, setPhone] = useState(user.phoneNumbers && user.phoneNumbers.length > 0 ? user.phoneNumbers[0].phoneNumber : '');
  const [address, setAddress] = useState(user.publicMetadata?.address || '');
  const [vehicleNumber, setVehicleNumber] = useState(user.publicMetadata?.vehicleNumber || '');

  const handleSave = async () => {
    try {
      // Update user profile
      await user.update({
        phoneNumbers: [{ phoneNumber: phone }],
        publicMetadata: { address, vehicleNumber },
      });

      // Show success message
      Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
      
      // Navigate back to the UserProfile screen
      navigation.goBack();
    } catch (error) {
      // Show error message
      Alert.alert('Update Failed', 'There was an error updating your profile.');
      console.error('Error updating profile:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Vehicle Number"
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    width: '100%',
    maxWidth: 400,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#000000',
    borderRadius: 35,
    paddingVertical: 20,
    paddingHorizontal: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});
