import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Button, TouchableOpacity, } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import Navbar from '../components/Navbar';

export default function Chargings() {
    const [plugType, setPlugType] = useState('Type A');
    const [timer, setTimer] = useState(0);
    const[isTimerRunning, setTimerRunning] = useState(false);

    const startTimer = () => {
      setTimerRunning(true);
    }

    const stopTimer = () => {
      setTimerRunning(false);
      
    }

    useEffect(() => {
      let interval;
      if (isTimerRunning) {
        interval = setInterval(() => {
          setTimer(prevTimer => prevTimer + 1); // Increment the timer value
        }, 1000);
      } else if (!isTimerRunning && timer !== 0) {
        clearInterval(interval); // Clear interval when stopped
      }
      return () => clearInterval(interval); // Cleanup interval on unmount
    }, [isTimerRunning, timer]);
  
    // Convert timer to hours, minutes, seconds format
    const formatTime = (timeInSeconds) => {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      const seconds = timeInSeconds % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
 



  return (
   <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null } keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}>
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
            <Text style={styles.headerText}>Set Timer</Text>
            <Text style={styles.headerText1}>Start timer to start charging!</Text>
            <Picker
            selectedValue={plugType}
            style={styles.picker}
            onValueChange={(itemValue) => setPlugType(itemValue)}
            >
                <Picker.Item label="1hour" value="1hour" />
                <Picker.Item label="2hours" value="2hours" />
                <Picker.Item label="3hours" value="3hours" />
                <Picker.Item label="4hours" value="4hours" />
                <Picker.Item label="5hours" value="5hours" />
                <Picker.Item label="6hours" value="6hours" />
            </Picker>
            <Text style={styles.headerText2}>Select Plug Type</Text>
            <Text style={styles.headerText3}>Choose the plug which suit </Text>
            <Text style={styles.headerText4}>your vehicle to start charging</Text>
            <Picker
            selectedValue={plugType}
            style={styles.picker1}
            onValueChange={(itemValue) => setPlugType(itemValue)}
            >
                <Picker.Item label="Type A" value="Type A" />
                <Picker.Item label="Type B" value="Type B" />
                <Picker.Item label="Type C" value="Type C" />
               
            </Picker>

          <TouchableOpacity style={styles.startButton} onPress={startTimer}>
            <Text style={styles.startButtonText}>Start Timer</Text>
          </TouchableOpacity>

            {/* Digital Timer Display */}
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
          </View>

            <View style={styles.subContent}>
              <Text style={styles.text1}>Energy</Text>
              <Text style={styles.text2}>30 kWh</Text>
              <View style={styles.line}></View>
              <Text style={styles.text1}>Current</Text>
              <Text style={styles.text2}>12.24 Amp</Text>
              <View style={styles.line}></View>
              <Text style={styles.text3}>Total Amount</Text>
              <Text style={styles.text2}>Rs 150</Text>
            </View>

            <TouchableOpacity style={styles.stop} onPress={stopTimer}>
                <Text style={styles.stopText}>Stop Charging</Text>
            </TouchableOpacity>

        </View>
    </ScrollView>
    <Navbar/>

   </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101010',
      },
      headerText: {
        color: '#00FF00',
        fontSize: 24,
        marginBottom: 10,
        marginTop: 50,
        marginLeft: 20,
      },
      headerText1: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 10,
        marginTop: 20,
        marginLeft: 20,
      },
      picker: {
        height: 5,
        width: 130,
        //color: '#00FF00',
        top:-50,
        left: 260,
        backgroundColor: '#00A947',
        borderRadius: 20,
      },
      headerText2: {
        color: '#00FF00',
        fontSize: 24,
        marginBottom: 10,
        marginTop: -5,
        marginLeft: 20,
      },
      headerText3: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 10,
        marginTop: 20,
        marginLeft: 20,
      },
      headerText4: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 0,
        marginTop: -5,
        marginLeft: 20,
      },
      picker1: {
        height: 50, // Increase height
        width: 130, // Increase width
        marginTop: 20, // Adjust margin
        left: 260,
        backgroundColor: '#00A947',
        borderRadius: 20,
        top: -74,
      },

      timerContainer: {
        marginTop: 20,
        marginBottom:20,
        alignItems: 'center',
        width: '55%',
        height:'20%',
        backgroundColor:'#000000',
        borderRadius:90,
        borderColor: 'grey',
        borderWidth: 8,
        left:85
      },
      timerText: {
        fontSize: 36,
        color: '#fff',
        fontWeight: 'bold',
        top:70
      },
      startButton: {
        backgroundColor: '#00A947',
        padding: 10,
        marginTop: 2,
        alignItems: 'center',
        borderRadius: 10,
        width: 150,
        left: 125,
      },
      startButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
      },

     

      subContent: {
        backgroundColor: 'darkgrey',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
        width: 280,
        left: 65,
        height: 240,
      },
      text1: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#fff',
        top:10,
        left:-80
      },
      text3: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#fff',
        top:10,
        left:-55
      },
      text2: {
        fontSize: 16,
        color: 'green',
        top:-10,
        left:80
      },
      line: {
        height: 1,
        backgroundColor: 'green',
        width: '100%',
        marginVertical: 10,
      },

      stop: {
        backgroundColor: '#101010',
  borderRadius: 10,
  padding: 10,
  alignItems: 'center',
  marginVertical: 20,  // Use vertical margins for spacing
  width: 220,
  alignSelf: 'center',  // Center the button horizontally
  borderColor: '#00A947',
  borderWidth: 2,
  marginBottom:200,
  top:-10

      },
      stopText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00A947',	
      }
})
