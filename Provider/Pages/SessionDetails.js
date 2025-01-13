import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Svg, { Circle } from 'react-native-svg';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SessionDetails({ route, navigation }) {
  const { session } = route.params;
  const [remainingTime, setRemainingTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [cost, setCost] = useState(0);
  const [sessionId, setSessionId] = useState(session.sessionId);
  const [status, setStatus] = useState(session.status);
  const [chargeType, setChargeType] = useState(session.chargeType);
  const [selectedTime, setSelectedTime] = useState('');
  const [fixedChargingTime, setFixedChargingTime] = useState('');
  const [chargingPrices, setChargingPrices] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [startTime, setStartTime] = useState(session.startTime);

  let timer;

  const fetchSessionDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/sessions/${sessionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch session details.');
      }
  
      const data = await response.json();
      if (data) {
        // Set the detailed session information
        setSessionDetails(data);
      } else {
        Alert.alert('Error', 'Failed to fetch session details.');
      }
    } catch (error) {
      console.error('Error fetching session details:', error);
      Alert.alert('Error', 'Failed to fetch session details.');
    }
  };

  useEffect(() => {
    // Fetch charging types and prices from the API
    console.log(session);

    if (status === 'Ongoing') {
      setSelectedTime(startTime);
      setFixedChargingTime(session.fixedChargingTime);
    }

    if (status === 'Completed') {
      fetchSessionDetails();
    }

    const fetchChargingData = async () => {
      console.log('API_URL:', API_URL);
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${API_URL}/stations/mystation`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Add API key to request headers if needed
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setChargingPrices(data.Prices);  // Store the fetched prices
      } catch (error) {
        console.error('Error fetching charging data:', error);
        Alert.alert('Error', 'Failed to fetch charging data.');
      }
    };

    fetchChargingData();
  }, []);

  const handleStartSession = async () => {
    if (!chargeType) {
      Alert.alert('Error', 'Please select a charger type.');
      return;
    }
    if (!fixedChargingTime || isNaN(fixedChargingTime) || fixedChargingTime <= 0) {
      Alert.alert('Error', 'Please enter a valid charging time in minutes.');
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log(chargingPrices, fixedChargingTime, chargeType, sessionId);
      const response = await fetch(`${API_URL}/sessions/startSession`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionID: sessionId,
          unitPrice: chargingPrices[chargeType]?.price,
          chargeType,
          fixedChargingTime: parseInt(fixedChargingTime),
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to start session.');
      }
  
      const data = await response.json();

      if (data.success) {
        setStatus(data.session.status);
        setRemainingTime(data.session.totalTime);
        setElapsedTime(0);
        setCost(0);
        setStartTime(new Date());
        initializeSession();
        Alert.alert('Session Started', `Charging session started with ${chargeType}.`);
      } else {
        Alert.alert('Error', 'Failed to start the session.');
      }
    } catch (error) {
      console.error('Error starting session:', error);
      Alert.alert('Error', 'Failed to start session.');
    }
  };
  
  // make use effect for update selected time
  useEffect(() => {
    console.log('selectedTime:', selectedTime);
  }, [selectedTime]);

  const initializeSession = () => {
    if (status === 'Ongoing') {
      try {
        timer = setInterval(() => {
          const currentTime = new Date();
          const sessionStartTime = new Date(startTime);

          const elapsed = Math.floor((currentTime - sessionStartTime) / 1000); // Time in seconds
          const totalTime = fixedChargingTime * 60; // Convert minutes to seconds
          const remaining = Math.max(totalTime - elapsed, 0);

          setElapsedTime(elapsed);
          setRemainingTime(remaining);

          const price = chargingPrices?.[chargeType]?.price || session.cost || 0;
          const exceededTime = Math.max(elapsed - totalTime, 0);

          // Update cost dynamically
          if (remaining > 0) {
            setCost((elapsed / 60) * price);
          } else {
            setCost((totalTime / 60) * price + (exceededTime / 60) * price);
          }
        }, 1000);
      } catch (error) {
        console.error('Error initializing session:', error);
      }
    }
  };

  useEffect(() => {
  
    initializeSession();
  
    return () => clearInterval(timer); // Cleanup
  }, [status, fixedChargingTime, chargeType, chargingPrices]);
  

  const getProgress = () => {
    if (elapsedTime && remainingTime) {
      return (elapsedTime / (elapsedTime + remainingTime)) * 100;
    } else if (elapsedTime > fixedChargingTime) {
      return 100;
    }
    return 0;
  };

  const getProgressText = () => {
    if (elapsedTime && remainingTime) {
      return (elapsedTime / (elapsedTime + remainingTime)) * 100;
    } else if (elapsedTime > fixedChargingTime) {
      return 100 + ((elapsedTime/60 - fixedChargingTime) / fixedChargingTime)*100;
    }
    return 0;
  };

  const handleStopSession = async () => {
    Alert.alert('Stop Session', 'Are you sure you want to stop the session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Stop',
        onPress: async () => {
          try {
            // Stop the timer
            clearInterval(timer);  // Ensure the timer is stopped
  
            // Call the API to stop the session
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_URL}/sessions/endSession`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                sessionID: sessionId,
              }),
            });
  
            if (!response.ok) {
              throw new Error('Failed to stop session.');
            }
  
            const data = await response.json();
            if (data.success) {
              // Update state with the finalized session data
              setStatus('Completed');
              setElapsedTime(data.session.totalTime);
              setRemainingTime(0);
              setCost(data.session.cost);
  
              // Fetch detailed session information
              await fetchSessionDetails();
  
              Alert.alert('Session Stopped', `Total cost: $${cost.toFixed(2)}`);
              navigation.goBack();
            } else {
              Alert.alert('Error', 'Failed to stop the session.');
            }
          } catch (error) {
            console.error('Error stopping session:', error);
            Alert.alert('Error', 'Failed to stop session.');
          }
        },
      },
    ]);
  };
  
  const handleCloseSession = () => {
    Alert.alert('Close Session', 'Are you sure you want to close the session?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Close', 
        onPress: async () => {
          try {
            console.log('API_URL:', API_URL);
            // Make the API call to close the session
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${API_URL}/sessions/close`, {
              method: 'PATCH', // Assuming PUT for closing the session
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                sessionID: sessionId, // Use the actual session ID here
              }),
            });
  
            const data = await response.json();
            console.log('Close session response:', response);
  
            if (response.ok) {
              Alert.alert('Session Closed', 'The session has been closed successfully.');
              navigation.goBack();
            } else {
              Alert.alert('Error', data.message || 'Something went wrong while closing the session.');
            }
          } catch (error) {
            console.error('Error closing session:', error);
            Alert.alert('Error', 'An error occurred while closing the session.');
          }
        }
      },
    ]);
  };

  const calculateTotalTime = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
  
    // Calculate the difference in milliseconds
    const diff = Math.max(0, end - start);
  
    // Convert to hours, minutes, and seconds
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
    // Format the duration
    const formattedTime = `${hours}h ${minutes}m ${seconds}s`;
    return formattedTime;
  };
  
  
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <Text style={styles.headerText}>Session Details</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>User:</Text> {session.userName}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>Status:</Text> {status}
        </Text>

        {status === 'Completed' && sessionDetails && (
          <View>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Session ID:</Text> {sessionDetails.SessionID}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Start Time:</Text> {new Date(sessionDetails.StartTime).toLocaleString()}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>End Time:</Text> {new Date(sessionDetails.EndTime).toLocaleString()}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Charge Type:</Text> {sessionDetails.ChargeType}
            </Text>
            <Text style={styles.infoText}>
              {/* Calculate total time */}
              <Text style={styles.bold}>Total Time:</Text> {calculateTotalTime(sessionDetails.StartTime, sessionDetails.EndTime)}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Cost:</Text> ${sessionDetails.Cost.toFixed(2)}
            </Text>
          </View>
        )}

  
        {status === 'New' && (
          <>
            <Picker
              selectedValue={chargeType}
              onValueChange={(itemValue) => setChargeType(itemValue)}
              style={styles.picker}
            >
               <Picker.Item label="Select Charger Type" value={null} />
              {chargingPrices && chargingPrices.level1.active && (
                <Picker.Item label="Level 1" value="level1" />
              )}
              {chargingPrices && chargingPrices.level2.active && (
                <Picker.Item label="Level 2" value="level2" />
              )}
              {chargingPrices && chargingPrices.level3.active && (
                <Picker.Item label="Level 3" value="level3" />
              )}
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Enter charging time (minutes)"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={fixedChargingTime}
              onChangeText={(text) => setFixedChargingTime(text)}
              blurOnSubmit={true} // Ensure keyboard dismisses on submit
              onSubmitEditing={Keyboard.dismiss}
            />
          </>
        )}
  
        {status === 'Ongoing' && (
          <>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Charge Type:</Text> {chargeType}
            </Text>
            <View style={styles.circleContainer}>
              <Svg height="200" width="200">
                <Circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="#ddd"
                  strokeWidth="15"
                  fill="none"
                />
                <Circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="#08A045"
                  strokeWidth="15"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 90}
                  strokeDashoffset={2 * Math.PI * 90 - (getProgress() / 100) * 2 * Math.PI * 90}
                />
              </Svg>
              <Text style={styles.progressText}>{Math.round(getProgressText())}%</Text>
            </View>
  
            <Text style={styles.timerText}>
              {elapsedTime > fixedChargingTime * 60 ? (
                <Text style={{ color: "red" }}>
                  {Math.floor((elapsedTime - fixedChargingTime * 60) / 60)}m {(elapsedTime - fixedChargingTime * 60) % 60}s
                </Text>
              ) : (
                `${Math.floor(remainingTime / 60)}:${remainingTime % 60 < 10 ? '0' : ''}${remainingTime % 60}`
              )}
            </Text>
  
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Cost:</Text> ${cost.toFixed(2)}
            </Text>
          </>
        )}
      </View>
  
      {status === 'New' ? (
        <TouchableOpacity style={styles.startButton} onPress={handleStartSession}>
          <Text style={styles.startButtonText}>Start Session</Text>
        </TouchableOpacity>
      ) : status === 'Completed' ? (
        <TouchableOpacity style={styles.closeButton} onPress={handleCloseSession}>
          <Text style={styles.closeButtonText}>Close Session</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.stopButton} onPress={handleStopSession}>
          <Text style={styles.stopButtonText}>Stop Session</Text>
        </TouchableOpacity>
      )}

    </View>
    </TouchableWithoutFeedback>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#110F0F',
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginTop: 10,
  },
  circleContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  progressText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  timerText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
  },
  startButton: {
    backgroundColor: '#08A045',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stopButton: {
    backgroundColor: '#D9534F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
