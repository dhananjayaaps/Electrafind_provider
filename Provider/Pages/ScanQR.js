import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from "socket.io-client";
import { SOCKET_URL } from '@env'; // Ensure SOCKET_URL is correctly set in the .env file

export default function StartChargingSession() {
  const [qrCode, setQrCode] = useState(null);
  const [qrCodeText, setQrCodeText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [providerId, setProviderId] = useState(null);
  const [sessionRequest, setSessionRequest] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [Username, setUsername] = useState(null);
  const socketRef = useRef(null);
  const [sessionNumber, setSessionNumber] = useState(0);

  // Fetch user data from AsyncStorage
  const getUserData = async () => {
    setLoading(true);
    try {
      const QRCode = await AsyncStorage.getItem('QRCode');
      const VerificationCode = await AsyncStorage.getItem('VerificationCode');
      const ProviderId = await AsyncStorage.getItem('ProviderId');
  
      if (QRCode && VerificationCode && ProviderId) {
        setQrCode(QRCode);
        setQrCodeText(VerificationCode);
        setProviderId(ProviderId);
      } else {
        console.log('Data missing in AsyncStorage');
      }
    } catch (error) {
      console.error('Error retrieving data from local storage:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []); 

  // Initialize Socket.IO connection
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket.IO connected with ID:", socket.id);
      socket.emit("register", { id: providerId, role: 'provider' });
    });

    // Listen for session requests
    socket.on("session-request", (data) => {
      console.log("Received session request:", data);
      setSessionRequest(data);
      setUsername(data.clientName);
      setSessionNumber(data.sessionNumber);
      setModalVisible(true); 
    });

    socket.on("message", (data) => {
      console.log("Message from server:", data);
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    socket.on("error", (error) => {
      console.error("Socket.IO error:", error);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [providerId]);

  const handleSessionResponse = (accept) => {
    if (socketRef.current && sessionRequest) {
      socketRef.current.emit("accept-session", {
        sessionId: sessionRequest.sessionId,
        accept,
        sessionNumber: sessionNumber,
      });

      if (accept) {
        Alert.alert("Session Accepted", "The session has started successfully.");
      } else {
        Alert.alert("Session Rejected", "The session was rejected.");
      }

      // Hide the modal after response
      setModalVisible(false);
      setSessionRequest(null); // Clear the session request data
    }
  };

  const refreshQRCode = () => {
    getUserData();
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

      <TouchableOpacity style={styles.button} onPress={refreshQRCode}>
        <Text style={styles.buttonText}>Refresh QR Code</Text>
      </TouchableOpacity>

      {/* Modal for session request */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Session Request</Text>
            <Text style={styles.modalText}>
              User {Username} is requesting a charging session. Do you accept?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.smallbutton, styles.acceptButton]}
                onPress={() => handleSessionResponse(true)}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallbutton, styles.rejectButton]}
                onPress={() => handleSessionResponse(false)}
              >
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    width: 250,
    height: 250,
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
  smallbutton: {
    backgroundColor: '#08A045',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  acceptButton: {
    backgroundColor: '#08A045',
  },
  rejectButton: {
    backgroundColor: '#D9534F',
  },
});
