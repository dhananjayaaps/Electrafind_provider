import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';

export default function Options() {

  const navigation = useNavigation();

  const handlePress = (time) => {
    Alert.alert(
      'Confirm Charge',
      `Are you sure you want to start a ${time} charge?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => startCharge(time) },
      ]
    );
  };

  const startCharge = (time) => {
    // Logic to start the charge, e.g., navigate to another screen or update state
    navigation.navigate('timer', { time: parseInt(time) });
  };

  return (
    <View style={styles.container}>

      <Video
            source={require('../../../assets/plugin.mp4')}
            rate={1.0}
            volume={1.0}
            isMuted={true}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={styles.video}
          />
        

      <View style={styles.instructionBox}>
        <Text style={styles.instructionText}>
          Please plug in the charging connector to the car and select
          <Text style={styles.linkText}> Preference Time</Text>.
        </Text>
      </View>

      <View style={styles.subcontainer}>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('15 Minutes')}>
          <Text style={styles.buttonText}>15 min</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handlePress('30 Minutes')}>
          <Text style={styles.buttonText}>30 min</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subcontainer}>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('45 Minutes')}>
          <Text style={styles.buttonText}>45 min</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handlePress('60 Minutes')}>
          <Text style={styles.buttonText}>60 min</Text>
        </TouchableOpacity>
      </View>

      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '47%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  subcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: 300,
    marginTop: -30,
    marginBottom: 20,
  },
  instructionBox: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#E7F5ED', // Light gray background for the box
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#ccc', // Light gray border
    width: '90%', // Adjust the width to fit your design
  },
  instructionText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333333',
    fontWeight: 'bold',
  },
  linkText: {
    color: '#008000',
    fontWeight: 'bold',
  },
});
