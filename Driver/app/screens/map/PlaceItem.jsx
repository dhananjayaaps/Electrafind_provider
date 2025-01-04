import { View, Text, Image, Dimensions } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import images from '../../../constants/images'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import GlobalApi from '../../Utils/GlobalApi'
import {LinearGradient} from 'expo-linear-gradient'
import { FontAwesome } from '@expo/vector-icons'
import GotoPageButton from '../../../components/GotoPageButton'
import { router } from 'expo-router'
import { useRouter } from 'expo-router'
import { useNavigation } from 'expo-router'
import chargingStationProfile from '../../(tabs)/map/chargingStationProfile'

const screenWidth = Dimensions.get('screen').width;

export default function PlaceItem({place}) {

  const navigation = useNavigation();
  
  

  const PLACE_PHOTO_BASE_URL = "https://places.googleapis.com/v1/"
  return (
    
    <View style={{width:screenWidth * 0.95, backgroundColor:'#ffffff', margin:10, borderRadius:10, items:'center',padding:0,}}>

      <LinearGradient
        colors={['transparent', '#ffffff']}
      >
      <Image source={ place?.photos?
        {uri:PLACE_PHOTO_BASE_URL + place?.photos[0]?.name+"/media?key="+GlobalApi?.API_KEY1+"&maxHeightPx=800&maxWidthPx=1200"}
         :(images.evchargingstation)}
        style={{width: '100%', height: 150, borderRadius: 10,alignItems:'center',justifyContent:'center',flex:1,zIndex:-1}}
      />

      <View style={{display: 'flex',flexDirection:'row',justifyContent:'space-between', alignItems:'center'}}>
        <View style={{padding:5, width: '80%'}}>
          <Text style={{fontSize:18,}} className="font-psemibold ">{place.displayName?.text}</Text>
          <Text style={{color:Colors.GRAY,fontSize:15}} className="font-pmedium">{place?.shortFormattedAddress}</Text>
        </View>
        {/* <View style={{padding:12,backgroundColor:'#22c55e',paddingHorizontal:18,paddingVertical:18, borderRadius:10,margin:5}}>
          <FontAwesome name="location-arrow" size={24} color="#ffffff" />
        </View> */}
        <GotoPageButton
        handlePress={() => navigation.navigate('chargingStationProfile',{place})}
          
          // isLoading={isSubmitting}
        />

      </View>
      </LinearGradient>
    </View>
  )
}