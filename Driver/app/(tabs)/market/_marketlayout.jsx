import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import MarketScreen from '.';
import VehicleDetailProfile from './vehicleDetailProfile';

const Stack = createStackNavigator();

function MarketLayout() {
  return (
    <>
      <Stack.Navigator initialRouteName="index" options={{headerShown:false}}>
        <Stack.Screen name="index" component={MarketScreen} options={{
            headerShown: false
          }}/>
        <Stack.Screen name="vehicleDetailProfile" component={VehicleDetailProfile} options={{
            headerShown: false}}/>
      </Stack.Navigator>

      <StatusBar style="light"/>
    </>

  );
}

export default MarketLayout;
