import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native'
import Navbar from '../components/Navbar';
import InputFields from '../components/InputFields';
import ChargeingLevel from '../components/ChargeingLevel';
import AvailableButton from '../components/AvailableButton';
import DateTimePicker from '../components/DateTimeSelector';
import DateTimeSelector from '../components/DateTimeSelector';

export default function Home1() {

    const handleUser = () => {
        console.log('User clicked');
   }
    const handleEdit = () => {
        console.log('User clicked edit');
   }
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null } keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}>
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
   <View style ={styles.container}>

    <View style={styles.header}>
        <TouchableOpacity style={styles.users} onPress ={handleUser}>
            <Image source={require('../assets/user 1.png')} style={styles.user}/>
       </TouchableOpacity>

       <TouchableOpacity style={styles.edit} onPress ={handleEdit}>
            <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold', left: 30,top:8}}>EDIT</Text>
       </TouchableOpacity>

    </View>

    {/* Station Name and Station Address import from InputFields component*/}
        <View style ={styles.inputs}>
            <InputFields label="Station Name" placeholder="Enter Station Name" fontSize={25}/>
            <InputFields label="Station Address" placeholder=" Line 1" fontSize={25} />
            <InputFields placeholder="Line 2" />
            <InputFields placeholder="Line 3" />
        </View>
    
    {/* Charge types import from InputFields component*/}
        <View style ={styles.chargeTypes}>
            <Text style={styles.chargeHeading}>Charge Type</Text>
            <Image source={require('../assets/chargeType.png')} style={{width: 395, height: 210, left: 12, top: 20}}/>

            {/* Import from AvailableButton component*/}
           <View style={styles.availableContainer}>
                <AvailableButton/>
           </View>
           <View style={styles.availableContainer1}>
                <AvailableButton/>
           </View>
           <View style={styles.availableContainer2}>
                <AvailableButton/>
           </View>
        </View>

        <View style ={styles.Availability}>
            <Text style={styles.availableHeading}>Avaialbility</Text>
            <View style={styles.dateTimePicker}>
                <DateTimeSelector/>
            </View>
        </View>

        <View style ={styles.settingPrice}>
            <Text style={styles.price}>Set Price</Text>
            <View style={styles.inputWrapper}>
                 <TextInput
                    style={[styles.input]}
                    //keyboardType={keyboardType}
                    placeholderTextColor="#000"
                    placeholder="80.50 LKR"
                />

             </View>
        </View>

        <TouchableOpacity style={styles.saveButton}>
            <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold', left: 25, top: 10}}>SAVE</Text>
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

    edit:{
        backgroundColor:"#00A848",
        width:100,
        height:45,
        borderRadius: 20,
        top:-3,
        left:-220
    },

    inputs: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        top:-10,
        left:20
    },

    chargeHeading: {
        color:'#fff',
        fontSize: 25,
        left: 40,
    },
    Availablecontainer: {
        flex: 1,
        // Background color similar to the image
        padding: 20,
        justifyContent: 'space-around',
    },

    availableContainer: {
        flex: 1,
        left:-80
        
    },

    availableContainer1: {
        flex: 1,
        left:65,
        top:-100
        
    },
    availableContainer2: {
        flex: 1,
        left:200,
        top:-200
        
    },

    availableHeading: {

        color:'#fff',
        fontSize: 25,
        left: 40,   
    },

    Availability:{
        top:-160
    },

    dateTimePicker: {
        flex: 1,
        justifyContent: 'center',
        //backgroundColor: '#000',
        top:20
        
    },

    settingPrice:{
        flex: 1,
        justifyContent: 'center',
        top:-90
    },

    price: {
       
        color:'#fff',
        fontSize: 25,
        left: 40,
    },

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ADF2CB',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 8,
        width:'75%',
        left: 55,
        top: 10
    },

    input: {
        flex: 1,
        color: '#000',
        
    },

    saveButton: {
        backgroundColor: '#00A848',
        width: 100,
        height: 45,
        borderRadius: 20,
        top: -50,
        left: 160
    }
})
