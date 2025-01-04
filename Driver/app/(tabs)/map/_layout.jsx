import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import MapScreen from '.';
import ChargingStationProfile from './chargingStationProfile';

const Stack = createStackNavigator();

function MapLayout() {
  return (
    <>
      <Stack.Navigator initialRouteName="index" options={{headerShown:false}}>
        <Stack.Screen name="index" component={MapScreen} options={{
            headerShown: false
          }}/>
        <Stack.Screen name="chargingStationProfile" component={ChargingStationProfile} options={{
            headerShown: false}}/>
      </Stack.Navigator>

      <StatusBar style="light"/>
    </>

  );
}

export default MapLayout;
