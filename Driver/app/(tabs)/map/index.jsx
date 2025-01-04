import {  ScrollView, Text, View,TouchableWithoutFeedback, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useContext, useEffect, useState } from 'react'
import { UserLocationContext } from '../../Context/UserLocationContext'
import GlobalApi from '../../Utils/GlobalApi'

import React from 'react'
import AppMapView from '../../screens/map/AppMapView'
import Header from '../../screens/map/Header'
import { StyleSheet } from 'react-native'
import SearchBar from '../../screens/map/SearchBar'
import PlaceListView from '../../screens/map/PlaceListView'
import { SelectMarkerContext } from '../../Context/SelectMarkerContext'


export default function MapScreen() {

  const {location,setLocation}=useContext(UserLocationContext);
  const [placeList,setPlaceList]=useState([]);
  const [selectedMarker,setSelectedMarker]=useState([]);
  const [isPlaceListVisible, setIsPlaceListVisible] = useState(true);

  //newly added
  const [isMarkerTouched, setIsMarkerTouched] = useState(false);
  
  // useEffect(() => {
  //   // location&&GetNearByPlace();
  //   if(location){

  //     GetNearByPlace(location);
  //   }
  // }, [location])

  useEffect(()=>{
    location&&GetNearByPlace();
  },[location])

  const GetNearByPlace=()=>{
    const data={
      "includedTypes": ["electric_vehicle_charging_station"],
      "maxResultCount": 20,
      "locationRestriction": {
        "circle": {
          "center": {
            "latitude": location?.latitude,
            "longitude": location?.longitude
          },
          "radius": 50000.0
        }
      }
    }


    GlobalApi.NewNearByPlace(data).then(resp=>{
      // console.log(resp);
      // console.log(JSON.stringify(resp.data));
      setPlaceList(resp.data?.places)
    })
  }

  const handleMapTouch = () => {
    Keyboard.dismiss();
    setIsPlaceListVisible(false); // Hide the PlaceListView when the map is touched
  };

  const handleMarkerTouch = () => {
    setIsPlaceListVisible(true);
    setIsMarkerTouched(true);
  };

  const handleSearchFocus = () => {
    setIsPlaceListVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      <SelectMarkerContext.Provider value={{selectedMarker, setSelectedMarker, isMarkerTouched, setIsMarkerTouched, }}>
      
        <View>

          <View style={styles.headerContainer}>
            <Header onSearchFocus={handleSearchFocus}/>
          </View>
          
          <TouchableWithoutFeedback onPress={handleMapTouch}>
            <View>
          {placeList&& <AppMapView placeList={placeList}  onMarkerTouch={handleMarkerTouch}/>}
          </View>
          </TouchableWithoutFeedback>

          <View style={styles.placeListContainer}>
            {isPlaceListVisible && placeList &&<PlaceListView placeList={placeList}/>}
          </View>

        </View>

      </SelectMarkerContext.Provider>
      
    </SafeAreaView>
    
  )
}

const styles = StyleSheet.create({
  headerContainer:{
    position: 'absolute',
    zIndex: 10,
    padding: 40,
    width: '100%',
    paddingHorizontal: 10,
    height: 120,
    backgroundColor: '#161622',
    alignContent: 'center',
    justifyContent: 'center',
  },

  safeArea: {
    flex: 1,
    
  },
  container: {
    flex: 1,
  },

  placeListContainer:{
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    width: '100%'
  }
  
})



