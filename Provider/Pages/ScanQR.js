import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StartChargingSession() {
  const [qrCode, setQrCode] = useState(null);
  const [qrCodeText, setQrCodeText] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkQrCodeKey = async () => {
      try {
        const storedQrCodeText = await AsyncStorage.getItem('qrCodeKey');
        if (storedQrCodeText) {
          // Key exists in shared preferences
          setQrCodeText(storedQrCodeText);
        } else {
          // Key not found, fetch from backend
          fetchQrCodeFromBackend();
        }
      } catch (error) {
        console.error('Error checking QR code key:', error);
      }
    };

    checkQrCodeKey();
  }, []);

  const fetchQrCodeFromBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://your-backend-api-url.com/generate-qr-code', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch QR code');
      }

      const data = await response.json();
      setQrCode(data.qrCodeUrl);
      setQrCodeText(data.qrCodeKey);

      // Save the QR code key in shared preferences
      await AsyncStorage.setItem('qrCodeKey', data.qrCodeKey);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch QR code from the server.');

      // testing data
      setQrCode("https://qrcg-free-editor.qr-code-generator.com/latest/assets/images/websiteQRCode_noFrame.png");
      setQrCodeText("DGTHYL");

      console.error('Error fetching QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Start Charging Session</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#08A045" />
      ) : (
        <>
          {qrCode ? (
            <Image source={{ uri: qrCode }} style={styles.qrCodeImage} />
          ) : (
            <Text style={styles.infoText}>
              No QR code found. Please wait while we fetch your QR code.
            </Text>
          )}

          {qrCodeText && (
            <Text style={styles.qrCodeText}>
              Your Code: <Text style={styles.codeHighlight}>{qrCodeText}</Text>
            </Text>
          )}
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={fetchQrCodeFromBackend}>
        <Text style={styles.buttonText}>Refresh QR Code</Text>
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
    padding: 20,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qrCodeImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  infoText: {
    color: '#888',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  qrCodeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  codeHighlight: {
    color: '#08A045',
    fontSize: 22,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#08A045',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
