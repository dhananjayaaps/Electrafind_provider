import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Svg, { Circle } from 'react-native-svg';
import { API_URL, API_KEY } from '@env'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SessionDetails({ route, navigation }) {
  const { session } = route.params;
  const [remainingTime, setRemainingTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [cost, setCost] = useState(0);
  const [sessionId, setSessionId] = useState(session.id);
  const [status, setStatus] = useState(session.status);
  const [chargeType, setChargeType] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [chargingPrices, setChargingPrices] = useState(null);
  const ratePerMinute = 0.5;
  const totalTimeInSeconds = 0;

  useEffect(() => {
    // Fetch charging types and prices from the API
    const fetchChargingData = async () => {
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

  const handleStartSession = () => {
    if (!chargeType) {
      Alert.alert('Error', 'Please select a charger type.');
      return;
    }
    if (!selectedTime || isNaN(selectedTime) || selectedTime <= 0) {
      Alert.alert('Error', 'Please enter a valid charging time in minutes.');
      return;
    }

    const totalTime = parseInt(selectedTime) * 60;
    setStatus('Ongoing');
    setRemainingTime(totalTime);
    setElapsedTime(0);
    setCost(0);
    Alert.alert('Session Started', `Charging session started with ${chargeType} for ${selectedTime} minutes.`);
  };

  useEffect(() => {
    let timer;

    if (status === 'Ongoing' && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            clearInterval(timer);
            setStatus('Completed');
          }
          return newTime;
        });

        setElapsedTime((prevElapsedTime) => {
          const newElapsedTime = prevElapsedTime + 1;
          setCost((newElapsedTime / 60) * ratePerMinute);
          return newElapsedTime;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [status, remainingTime]);

  const getProgress = () => {
    if (elapsedTime && remainingTime) {
      return (elapsedTime / (elapsedTime + remainingTime)) * 100;
    }
    return 0;
  };

  const handleStopSession = () => {
    Alert.alert('Stop Session', 'Are you sure you want to stop the session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Stop',
        onPress: () => {
          setStatus('Completed');
          Alert.alert('Session Stopped', `Total cost: $${cost.toFixed(2)}`);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Session Details</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>User:</Text> {session.userName}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>Status:</Text> {status}
        </Text>
        {status === 'New' && (
          <>
            <Picker
              selectedValue={chargeType}
              onValueChange={(itemValue) => setChargeType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Charger Type" value={null} />
              {chargingPrices && chargingPrices.level1.active && (
                <Picker.Item label="Level 1" value="Level 1" />
              )}
              {chargingPrices && chargingPrices.level2.active && (
                <Picker.Item label="Level 2" value="Level 2" />
              )}
              {chargingPrices && chargingPrices.level3.active && (
                <Picker.Item label="Level 3" value="Level 3" />
              )}
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Enter charging time (minutes)"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={selectedTime}
              onChangeText={(text) => setSelectedTime(text)}
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
              <Text style={styles.progressText}>{Math.round(getProgress())}%</Text>
            </View>
            <Text style={styles.timerText}>
              {`${Math.floor(remainingTime / 60)}:${remainingTime % 60 < 10 ? '0' : ''}${remainingTime % 60}`}
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
      ) : (
        <TouchableOpacity style={styles.stopButton} onPress={handleStopSession}>
          <Text style={styles.stopButtonText}>Stop Session</Text>
        </TouchableOpacity>
      )}
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
  startButton: {
    backgroundColor: '#08A045',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stopButton: {
    backgroundColor: '#E63946',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  progressText: {
    position: 'absolute',
    color: '#FFFFFF',
    fontSize: 24,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 10,
  },
});
