import { View, Text, Image ,Button} from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { useRoute } from '@react-navigation/native';
import GlobalApi from '../../Utils/GlobalApi';
import images from '../../../constants/images';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NavigateButton from '../../../components/NavigateButton';
import openMap from 'react-native-open-maps';
import { useState } from 'react';
import Info from '../../screens/map/Info';
import Charge from '../../screens/map/Charge';
import Swiper from 'react-native-swiper';
import * as Haptics from 'expo-haptics'



//render the ev charging stations details and make a profile for each charging station

export default function ChargingStationProfile() {

  const PLACE_PHOTO_BASE_URL = "https://places.googleapis.com/v1/"

  
  const [activeButton, setActiveButton] = useState("Info");

  const navigation = useNavigation();

  const handleButtonPress = (buttonName) => {
    setActiveButton(buttonName);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const navigateToLocation = () => {
    if (place?.location) {
      openMap({
        latitude: place.location.latitude,
        longitude: place.location.longitude,
        zoom: 25,
        query: place.displayName,
      });
    }
  }

  const route = useRoute();
  const { place } = route.params;
  // console.log('charging: ',place);

  return (
    <View>
      <ScrollView>
        <View className="relative">
          <Image source={ place?.photos?
              {uri:PLACE_PHOTO_BASE_URL + place?.photos[0]?.name+"/media?key="+GlobalApi?.API_KEY1+"&maxHeightPx=800&maxWidthPx=1200"}
            :(images.evchargingstation)}
            style={{width: '100%', height: 300,alignItems:'center',justifyContent:'center',flex:1}}/>

            

            {/* images swiper
            <Swiper
              showsPagination={true}
              autoplay={true}
              autoplayTimeout={3}
              >
              {(place?.photos?.slice(0, 3) || [images.evchargingstation]).map((photo, index) => (
                <View key={index}>
                  {photo.uri ? renderPhoto(photo) : <Image source={photo} style={{width: '100%', height: 300,alignItems:'center',justifyContent:'center',flex:1}} />}
                </View>
              ))}
            </Swiper> */}

            <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 35, left: 5, }} activeOpacity={0.7} className={'p-2'}>
              <Ionicons
                name={"arrow-back-outline"}
                resizeMode="contain"
                color={"#ffffff"}
                size={30}
                style={{padding: 3, backgroundColor: '#161622', borderRadius: 30, opacity: 0.7,
                }}
              />
            </TouchableOpacity>

        </View>

        <View style={{borderTopLeftRadius: 40, borderTopRightRadius: 40}} className="bg-white -mt-10 pt-7">
          <View className="px-5 mb-2">
            <Text className="text-3xl font-bold">{place.displayName?.text}</Text>
            <View className="flex-row items-center space-x-1 mt-2">
              <Ionicons name="location" color="gray" width="20" height="20"/>
              <Text style={{color:"gray",fontSize:15}} className="font-pmedium">Nearby . {place?.shortFormattedAddress}</Text>
            </View>
            <View className="flex-row items-center space-x-1">
              <Ionicons name="settings" color="gray" width="20" height="20"/>
              <Text style={{color:"gray",fontSize:15}} className="font-pmedium">Status . {place?.businessStatus}</Text>
            </View>
            <View className="flex-row items-center space-x-1">
              <Ionicons name="time" color="gray" width="20" height="20"/>
              <Text style={{color:"gray",fontSize:15}} className="font-pmedium">{place?.currentOpeningHours?.openNow !== undefined ? (
                  <Text>
                    {place.currentOpeningHours.openNow ? "Currently Open" : "Currently Closed"}
                  </Text>
                    ) : (
                      <Text>No opening hours available.</Text>
                    )}
                </Text>
            </View>
          </View>
        </View>

        <View>
          <NavigateButton
            title={"Navigate"}
            handlePress={navigateToLocation}
            containerStyles={"mt-1"}
          />
        </View>
        
        <View style={{flexDirection: "row", justifyContent: "center", marginTop: 20, marginHorizontal: 20, backgroundColor: "#E9E9E9", borderRadius: 20, borderWidth: 2,borderColor: "#000000",  }}>

          <TouchableOpacity style={{flex: 1,alignItems: 'center',justifyContent: 'center',paddingVertical: 14, paddingHorizontal: 55, margin: 2, backgroundColor: activeButton === "Info" ? "#000000" : "transparent", borderRadius: activeButton === "Info" ? 15 : 0}}
            onPress={() => handleButtonPress("Info")} 
          >
            <Text style={{color: activeButton === "Info" ? "#fff" : "#000",}} className={"font-psemibold"}>Info</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{flex: 1,alignItems: 'center',justifyContent: 'center',paddingVertical: 14, paddingHorizontal: 55, margin: 2, backgroundColor: activeButton === "Charge" ? "#000000" : "transparent", borderRadius: activeButton === "Charge" ? 15 : 0}}
            onPress={() => handleButtonPress("Charge")} 
          >
            <Text style={{color: activeButton === "Charge" ? "#fff" : "#000",}} className={"font-psemibold"}>Charge</Text>
          </TouchableOpacity>

        </View>
        
        {
          activeButton === "Info" && (
            <View style={{marginHorizontal: 16, marginVertical: 25}}>
              <Info placeInfo={place}/>
            </View>
          )
        }

        {
          activeButton === "Charge" && (
            <View style={{marginHorizontal: 16, marginVertical: 25}}>
              <Charge placeInfo={place}/>
            </View>
          )
        }

      </ScrollView>
    </View>
  )
}