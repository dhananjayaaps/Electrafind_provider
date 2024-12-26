import React from 'react'
import { ScrollView, View, Text,Image,StyleSheet,KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import Navbar from '../components/Navbar';

export default function Earnings() {

    const handleUser = () => {
        console.log('User clicked');
   }
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null } keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>

            <View style ={styles.container}>

            <View style={styles.header}>
        <TouchableOpacity style={styles.users} onPress ={handleUser}>
            <Image source={require('../assets/user 1.png')} style={styles.user}/>
       </TouchableOpacity>

       <Text style={{color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', left: -220,}}>Earnings</Text>

    </View>

    <View style={styles.square}>
        <Text style={styles.text}>Date</Text>
        <Text style={styles.text}>Time</Text>
        <Text style={styles.text}>Location</Text>
        <Text style={styles.text}>Cost(Rs.)</Text>
    </View>
    <View style={styles.data}>
        <Text style={styles.text1}>2024/03/12</Text>
        <Text style={styles.text1}>14:12-15.09</Text>
        <Text style={styles.text1}>My Place</Text>
        <Text style={styles.text1}>208.59</Text>
    </View>
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

    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'space-between', // Ensures that the layout doesn't get squashed
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 60, 

      },

    user:{
        width: 50,
        height: 50,
        borderRadius: 25,  
        marginBottom: 10,
        left:290
    },

    square: {
        backgroundColor: '#FFFFFF',
        width: '98%',
        height: 60,
        padding: 20,
        marginBottom: 20,
        left: 2,
        top: -35,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },

      text: {
        fontSize: 16,
        top:-2
    },

    data: {
      
        width: '98%',
        height: 60,
        padding: 20,
        marginBottom: 20,
        left: 2,
        top: -35,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },

      text1: {
        fontSize: 16,
        top:-2,
        color:'#fff',
        left:-5
    },
})
