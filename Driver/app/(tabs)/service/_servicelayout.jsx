import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import GarageScreen from '.';
import GarageDetailProfile from './Profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

function ServiceLayout() {
  return (
    <>
      <Stack.Navigator initialRouteName="index" options={{headerShown:false}}>
        <Stack.Screen name="index" component={GarageScreen} options={{
            headerShown: false
          }}/>
        <Stack.Screen name="Profile" component={GarageDetailProfile} options={{
            headerShown: false}}/>
      </Stack.Navigator>

      <StatusBar backgroundColor="#161622" style="light"/>
    </>

  );
}

export default ServiceLayout;
