import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_URL, API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'TabNavigator' }],
            })
          );
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
    };

    checkToken();
  }, [navigation]);

  const saveToLocalStorage = async (data) => {
    try {
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userName', data.Name);
      await AsyncStorage.setItem('userEmail', data.Email);
      await AsyncStorage.setItem('userImageUrl', data.ImageUrl);
      await AsyncStorage.setItem('VerificationCode', data.VerificationCode);
      await AsyncStorage.setItem('QRCode', data.QRCode);
      await AsyncStorage.setItem('ProviderId', data.ProviderId.toString());
      console.log('User data saved to local storage.');
    } catch (error) {
      console.error('Error saving data to local storage:', error);
    }
  };

  const handleLogin = async () => {
    // prevent default
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    console.log('API_URL:', API_URL);
    console.log('API_URL:', API_URL);
    try {
      const response = await fetch(`${API_URL}/stations/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email: email, Password: password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Invalid email or password.');
        return;
      }
  
      const data = await response.json();
      Alert.alert('Success', 'Logged in successfully!');
      console.log('Response data:', data);
  
      // Save data to AsyncStorage
      await saveToLocalStorage(data);
  
      // Reset the navigation stack
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'TabNavigator' }],
        })
      );
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', 'Unable to connect to the server.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Login to Your Station</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your station email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerLink}
        onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.registerText}>Don't have an account? Register here</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#110F0F',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#08A045',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
  },
  registerText: {
    color: '#888',
    fontSize: 16,
  },
});
