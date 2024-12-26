import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Image, TouchableOpacity,Text, Alert, KeyboardAvoidingView, Platform,ScrollView } from 'react-native'
import Navbar from '../components/Navbar';
import { useNavigation } from '@react-navigation/native';

export default function Success() {
    const navigation = useNavigation();

    const handleUser = () => {
        console.log('User clicked');
   }

   const start = () => {
       navigation.navigate('chargings');
   }
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null } keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}>
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <View style = {styles.container}>
        <View style={styles.header}>
        <TouchableOpacity style={styles.users} onPress ={handleUser}>
            <Image source={require('../assets/user 1.png')} style={styles.user}/>
       </TouchableOpacity>

    
        </View>

        <Image source={require('../assets/success.png')} style={{width: 380, height: 210, left: 22, top: -10}}/>

        <View style={styles.success}>
            <Text style={styles.successText}>Success!</Text>
        </View>

        <TouchableOpacity style={styles.chargingButton} onPress={start}>
            <Text style={styles.chargingButtonText}>Start Charging</Text>
        </TouchableOpacity>
        </View>
        </ScrollView>
            <Navbar/>
       
       
   
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#110F0F',
       
    },

    header: {
        alignItems: 'center',
        marginTop: 50,  
        marginBottom: 30,  
      },

    user:{
        width: 50,
        height: 50,
        borderRadius: 25,  
        marginBottom: 10,
        left:150
    },

    success:{
        alignItems: 'center',
        marginTop: 0,  
        marginBottom: 30,  
        backgroundColor:'#101025',
        width:310,
        height:30,
        top:-60,
        left:50
      },

      successText:{
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        left: 8
      },

      chargingButton: {
         width:200,
         height: 50,
         backgroundColor:'#00A947',
         borderRadius: 30,
         marginTop: 50,
         left: 100,
      },
      chargingButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        left: 3
      },
      
})
