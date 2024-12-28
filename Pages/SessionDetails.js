import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Svg, { Circle } from 'react-native-svg';  // Import Svg and Circle

export default function SessionDetails({ route, navigation }) {
  const { session } = route.params;
  const [remainingTime, setRemainingTime] = useState(0); // Remaining time in seconds
  const [elapsedTime, setElapsedTime] = useState(0); // Elapsed time in seconds
  const [cost, setCost] = useState(0);
  const [status, setStatus] = useState(session.status);
  const [chargeType, setChargeType] = useState(null);
  const [selectedTime, setSelectedTime] = useState(''); // Time in minutes
  const ratePerMinute = 0.5; // Cost per minute
  const totalTimeInSeconds = 0; // Initialize total time in seconds (based on user input)

  const handleStartSession = () => {
    if (!chargeType) {
      Alert.alert('Error', 'Please select a charger type.');
      return;
    }
    if (!selectedTime || isNaN(selectedTime) || selectedTime <= 0) {
      Alert.alert('Error', 'Please enter a valid charging time in minutes.');
      return;
    }

    const totalTime = parseInt(selectedTime) * 60; // Convert minutes to seconds
    setStatus('Ongoing');
    setRemainingTime(totalTime);
    setElapsedTime(0);
    setCost(0); // Reset cost
    Alert.alert('Session Started', `Charging session started with ${chargeType} for ${selectedTime} minutes.`);
  };

  useEffect(() => {
    let timer;

    if (status === 'Ongoing' && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1; // Decrease remaining time by 1 second
          if (newTime <= 0) {
            clearInterval(timer);
            setStatus('Completed');
          }
          return newTime;
        });

        setElapsedTime((prevElapsedTime) => {
          const newElapsedTime = prevElapsedTime + 1; // Increase elapsed time by 1 second
          setCost((newElapsedTime / 60) * ratePerMinute); // Calculate the cost
          return newElapsedTime;
        });
      }, 1000); // Update every second
    }

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [status, remainingTime]);

  const getProgress = () => {
    // Calculate percentage based on elapsed time
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
          navigation.goBack(); // Navigate back
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
              <Picker.Item label="Type A" value="Type A" />
              <Picker.Item label="Type B" value="Type B" />
              <Picker.Item label="Type C" value="Type C" />
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
                  strokeDasharray={2 * Math.PI * 90} // Circumference
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
    backgroundColor: '#FF4500',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  progressText: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
});
