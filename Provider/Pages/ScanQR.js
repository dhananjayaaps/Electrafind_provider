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

  const getUserData = async () => {
    try {
      const QRCode = await AsyncStorage.getItem('QRCode');
      const VerificationCode = await AsyncStorage.getItem('VerificationCode');
  
      if (QRCode) {
        setQrCode(QRCode);
        setQrCodeText(VerificationCode);
      }
    } catch (error) {
      console.error('Error retrieving data from local storage:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);    


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

      <TouchableOpacity style={styles.button} onPress={getUserData}>
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
