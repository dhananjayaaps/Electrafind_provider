import React, { useState , useEffect} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { Camera, useCameraPermissions, CameraView } from 'expo-camera';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '@env';

export default function Recent() {
  const [scanned, setScanned] = useState(false);
  const [scannedValue, setScannedValue] = useState('');
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [qrLock, setQrLock] = useState(false);
  const [socket, setSocket] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
    });
    newSocket.emit('register', { id: '2', role: 'client' });
    setSocket(newSocket);
    console.log('Socket connected');

    return () => newSocket.disconnect();
  }, [SOCKET_URL]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleBarCodeScanned = ({ data }) => {
    setScannedValue(data);
    setIsScannerVisible(false);
    // Alert.alert('QR Code Scanned', `Data: ${data}`);
    submitData(data);
  };

  const submitData = (qrCode) => {
    if (socket) {
      const dataToSend = {
        clientName: 'Sineth',
        qrCode: qrCode,
        clientId: 1,
      };
      socket.emit('data', dataToSend);
      // Alert.alert('Data Sent', JSON.stringify(dataToSend));
    } else {
      Alert.alert('Not connected');
    }
  };

  return (
    <View style={styles.inputContainer}>
      {isScannerVisible ? (
             <View style={styles.cameracontainer}>

             <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={({ data }) => {
                  if (data && !qrLock) {
                    console.log(data)
                    
                    if (data.length !== 6) {
                      console.log('Invalid QR Code');
                      setQrLock(false);
                    }
                    else{
                      setIsScannerVisible(false);
                      // setQrLock(true);
                      handleBarCodeScanned({ data });
                    }
                  }
                }}
              >
              </CameraView>

              {/* button to hide the camera */}
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setIsScannerVisible(false)}
              >
                <Text style={{ color: 'white' }}>Hide Camera</Text>
              </TouchableOpacity>
          </View>
      ) : (
        <>
          <Text style={styles.instructionText}>
            Please ENTER or SCAN charge point reference code
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter Reference"
              value={scannedValue}
              onChangeText={setScannedValue}
            />
            <TouchableOpacity onPress={() => setIsScannerVisible(true)}>
              <Ionicons name="qr-code-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => submitData(scannedValue)}>
            <Text style={styles.buttonText}>START CHARGE</Text>
          </TouchableOpacity>
          <Video
            source={require('../../../assets/QR Code Scanning in Hand.mp4')}
            rate={0.2}
            volume={1.0}
            isMuted
            resizeMode="contain"
            shouldPlay
            isLooping
            style={styles.video}
          />
        </>
      )}
    </View>
  );

}


const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    padding: 20,
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: 10,
    marginHorizontal: 8,
    flex: 1,
  },
  instructionText: {
    fontSize: 18,
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  video: {
    width: '100%',
    height: 200,
    marginTop: 2,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  cameracontainer: {
    flex: 1,
    height: 300,
    backgroundColor: 'black',
  },
});