import { View, Text , Image} from 'react-native'
import React, { useContext } from 'react'
import { StyleSheet} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import {images} from '../../../constants';
import { UserLocationContext } from '../../Context/UserLocationContext';
import MapViewStyle from '../../Utils/MapViewStyle'
import Markers from './Markers';





export default function AppMapView({placeList, onMarkerTouch}) {

  const {location,setLocation}=useContext(UserLocationContext);

  return location?.latitude&&(
    <View>
      <MapView style={styles.map}
        //provider={PROVIDER_GOOGLE}
        customMapStyle={MapViewStyle}
        showsUserLocation={true}
        region={{
          //change to the location of the user
          latitude: location?.latitude,
          longitude: location?.longitude,
          latitudeDelta: 0.0422,
          longitudeDelta: 0.0421,
        }}
        >
          {location? <Marker
            coordinate={{
              latitude: location?.latitude,
              longitude: location?.longitude,
              //change to the location of the user
            }}
            
            // description="Your Location"
          >
            {/* <Image source={require('../../assets/images/car-marker.png')} style={{height: 50, width: 50}} /> */}
            {/* <Image source={images.carMarker} style={{height: 50, width: 0}} /> */}
          </Marker>:null}

          {placeList&&placeList.map((item,index)=>(
            <Markers key={index}
            index={index}
            place={item}
            onMarkerTouch={onMarkerTouch}
            />
          )
          
          )}

        </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    
    width: '100%',
    height: '100%',
  },
  
});

