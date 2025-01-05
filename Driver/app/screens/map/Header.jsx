import { View, Text, Image, ScrollView, Dimensions,TouchableWithoutFeedback, Keyboard,KeyboardAvoidingView} from 'react-native'

import { StyleSheet } from 'react-native'
import React, {useEffect, useContext,useRef} from 'react'
import { images } from '../../../constants'
import SearchBar from './SearchBar'
import DistanceSlider from './DistanceSlider'
import IonIcons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native'
import { UserLocationContext } from '../../Context/UserLocationContext'
import BottomSheet from 'reanimated-bottom-sheet';
import { useState } from 'react';

const { height: screenHeight } = Dimensions.get('window');
const SNAP_POINT = screenHeight * 0.7;

export default function Header({onSearchFocus}) {

  const {location,setLocation}=useContext(UserLocationContext);
  
  const bottomSheetRef = useRef(null);
  

  const renderContent = () => (
    <View style={styles.bottomSheetContent}>
      <Text style={styles.bottomSheetText}>Options</Text>
      {/* Add more options here */}
    </View>
  );

  const handleOpenBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapTo(0);
    }
  };

  return (
      <View style={styles.container}>

        <View style={{display: 'flex',flexDirection:'row',justifyContent:'space-between'}}>

          <TouchableOpacity style={{width:'85%', borderColor:'#161622', borderWidth: 1 }}>
            <SearchBar onFocus={onSearchFocus} searchedLocation={(location)=>
                setLocation({
                  latitude: location.lat,
                  longitude: location.lng
                })
              }
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleOpenBottomSheet} className={'mt-3.5'}>
            <IonIcons name="options-outline" size={30} color="#ffffff" style={{borderRadius:40,padding:6,backgroundColor: '#333333'}}/>
          </TouchableOpacity>

        </View>  
      </View>
    
  )
}

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  bottomSheetContent: {
    padding: 20,
    backgroundColor: 'white',
  },
  bottomSheetText: {
    fontSize: 18,
  },
})

