import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

export default function TimerScreen({ route }) {

  const { time } = route.params;  // Receive the designated time in minutes from the previous screen
  const [seconds, setSeconds] = useState(0);
  const [startTime] = useState(new Date()); // Capture start time
  const [endTime, setEndTime] = useState(null); // Initialize endTime state
  const ratePerMinute = 5; // 5 rupees per minute
  const navigation = useNavigation();

  useEffect(() => {
    const countUp = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds + 1 >= time * 60) {
          clearInterval(countUp);
          const end = new Date(); // Capture end time when the time is up
          setEndTime(end);
          navigation.navigate('summary', {
            totalTime: (time).toFixed(2),
            totalCost: (time * ratePerMinute).toFixed(2),
            startTime: startTime.toLocaleString(),
            endTime: end.toLocaleString(),
          });
          return prevSeconds + 1;
        }
        return prevSeconds + 1;
      });
    }, 1000);


    return () => clearInterval(countUp);
  }, [time, navigation, startTime]);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const totalCost = (seconds / 60) * ratePerMinute;

  const handleStop = () => {
    const end = new Date(); // Capture end time when stopping manually
    setEndTime(end);
    Alert.alert(
      'Stop Charging',
      'Are you sure you want to stop charging?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Stop', onPress: () => navigation.navigate('summary', {
          totalTime: (seconds / 60).toFixed(2),
          totalCost,
          startTime: startTime.toLocaleString(),
          endTime: end.toLocaleString(),
        }) },
      ]
    );
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Charge Your Vehicle</Text>
      <Text style={styles.subtitle}>Your vehicle is charging for {time} minutes</Text>
      <View style={styles.infobox}>
        <View style={styles.videoview}>
          <Video
            source={require('../../../assets/Green ring Charging.mp4')}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={styles.video}
          />
        </View>

        <View style={styles.infocontainer}>
          <View style={styles.instructionBox}>
            <Text style={styles.timer}>Time: </Text> 
            <Text style={styles.count}> {formatTime(seconds)} min</Text>
          </View>
          <View style={styles.instructionBox}>
            <Text style={styles.cost}>Total Cost:</Text> 
            <Text style={styles.count}>Rs. {totalCost.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
        <Text style={styles.stopButtonText}>Finish Charging</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 70,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  videoview: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
  cost: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  count: {
    fontSize: 24,
    color: '#00AB82',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 40,
    
  },
  stopButton: {
    backgroundColor: '#000000',
    paddingVertical: 20,
    paddingHorizontal: 80,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructionBox: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#E7F5ED', // Light gray background for the box
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#B6E1C7', // Light gray border
    width: '40%', // Adjust the width to fit your design
  },
  infocontainer: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    
  },
  infobox: {
    borderWidth: 3,
    borderColor: '#ccc',
    borderRadius: 15,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
});
