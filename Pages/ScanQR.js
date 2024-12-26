import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Navbar from '../components/Navbar';

export default function ScanQR() {
    
    const handleUser = () => {
        console.log('User clicked');
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null } keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.users} onPress={handleUser}>
                            <Image source={require('../assets/user 1.png')} style={styles.user}/>
                        </TouchableOpacity>
                        <Text style={styles.text}>MY QR CODE</Text>
                    </View>

                    <Image source={require('../assets/QR.png')} style={styles.qrImage}/>

                    <View style={styles.QRtext}>
                        <Image source={require('../assets/Camera.png')} style={styles.cameraIcon}/>
                        <Text style={styles.scanText}>Scan QR Code</Text>
                       
                    </View>

                    <View style={styles.orContainer}>
                        <Text style={styles.orText}>OR</Text>
                        <View style={styles.code}>
                            <Text style={styles.codeText}>25qWE522@</Text>
                        </View>
                    </View>
                    
                </View>
            </ScrollView>
            <Navbar/>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#110F0F',
    },
    header: {
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 30,
    },
    user: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 10,
        left: 150,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 25,
        fontWeight: 'bold',
    },
    qrImage: {
        width: 350,
        height: 360,
        alignSelf: 'center', 
        marginTop: 20,
    },
    QRtext: {
        backgroundColor: '#ADF2CB',
        width: 250,
        height: 50, 
        alignSelf: 'center',
        marginTop: 40,
        //paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center', 
        borderRadius: 20,
        flexDirection: 'row', 
    },
    cameraIcon: {
        width: 30,
        height: 30,
        marginRight: 10, 
    },
    scanText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
        left: 10,
    },

    orContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    orText: {
        color: '#ffffff', 
        fontSize: 24,
        marginLeft: 2, 
        
    },

    code: {
        backgroundColor: '#F6E7E7',
        width: 150,
        height: 30, 
        alignSelf: 'center',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center', 
        
    }
});
