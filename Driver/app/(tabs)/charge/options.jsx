import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
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
  const [chargeType, setChargeType] = useState(session.ChargeType);
  const [selectedTime, setSelectedTime] = useState('');
  const [fixedChargingTime, setFixedChargingTime] = useState('');
  const [chargingPrices, setChargingPrices] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);

  let timer;

  // fetch session details for every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSessionDetails();
      // initializeSession();
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  // useEffect(() => {
  //   // Fetch charging types and prices from the API
  //   fetchSessionDetails();

  // }, []);

  const initializeSession = () => {
    if (status === 'Ongoing') {
      try {
        timer = setInterval(() => {
          const currentTime = new Date();
          if (!sessionDetails) {
            return;
          }
          const sessionStartTime = new Date(sessionDetails.StartTime);

          const elapsed = Math.floor((currentTime - sessionStartTime) / 1000); // Time in seconds
          const totalTime = fixedChargingTime * 60;
          const remaining = Math.max(fixedChargingTime * 60 - elapsed, 0);
          console.log("Current Time: ", currentTime, "Session Start Time: ", sessionStartTime);
          setElapsedTime(elapsed);
          setRemainingTime(remaining);
          // console.log('Elapsed:', elapsed, 'Remaining:', remaining);

          // const price = chargingPrices?.[chargeType]?.price || session.cost || 0;
          const price = sessionDetails.Cost;
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
  
    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [sessionDetails, timer]);  
  

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
        console.log('Session details:', data);
        setSessionDetails(data);
        setChargeType(data.ChargeType);
        setFixedChargingTime(data.fixedChargingTime);
        setSelectedTime(data.StartTime);
        setStatus(data.Status);
        // if data.cost found set it, else 0
        // if (data.Cost) {
        //   setCost(data.Cost);
        // } 
        // setCost(data.Cost)

        if (data.Status === 'Closed' ) {
          setStatus('Completed');
        }
      } else {
        Alert.alert('Error', 'Failed to fetch session details.');
      }
    } catch (error) {
      console.error('Error fetching session details:', error);
      Alert.alert('Error', 'Failed to fetch session details.');
    }
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
    <View style={styles.container}>
      <Text style={styles.headerText}>Session Details</Text>
      <View style={styles.infoContainer}>
  
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
            <Text style={styles.bold}>Total Time:</Text>  {calculateTotalTime(sessionDetails.StartTime, sessionDetails.EndTime)}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Cost:</Text> ${sessionDetails.Cost.toFixed(2)}
          </Text>
        </View>
      )}

      {status === 'Closed' && sessionDetails && (
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
            <Text style={styles.bold}>Total Time:</Text>  {calculateTotalTime(sessionDetails.StartTime, sessionDetails.EndTime)}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Cost:</Text> ${sessionDetails.Cost.toFixed(2)}
          </Text>
        </View>
      )}
  
        {status === 'New' && (
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
    </View>
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
