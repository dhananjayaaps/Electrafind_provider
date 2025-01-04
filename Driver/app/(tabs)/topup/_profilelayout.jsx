import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import TopupScreen from '.';
import UserProfile from './userProfile';
import EditProfile from './editUserProfile';
import MarketPlace from './marketPlace';
import GaragePlace from './garagePlace';
import Wallet from './wallet'
import CarProfile from './carProfile';
import EditCarProfile from './editCarProfile';

// const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

function ProfileLayout() {
  return (
    <>
      <Stack.Navigator initialRouteName="index" options={{headerShown:false}}>
        <Stack.Screen name="index" component={TopupScreen} options={{
            headerShown: false
          }}/>
        <Stack.Screen name="userProfile" component={UserProfile} options={{
            headerShown: false}}/>

        <Stack.Screen name="editUserProfile" component={EditProfile} options={{
            headerShown: false}}/>
        
        <Stack.Screen name="marketPlace" component={MarketPlace} options={{
            headerShown: false}}/>

        <Stack.Screen name="garagePlace" component={GaragePlace} options={{
            headerShown: false}}/>

        <Stack.Screen name="wallet" component={Wallet} options={{
            headerShown: false}}/>

        <Stack.Screen name="carProfile" component={CarProfile} options={{
            headerShown: false}}/>

        <Stack.Screen name="editCarProfile" component={EditCarProfile} options={{
            headerShown: false}}/>
          
      </Stack.Navigator>

      <StatusBar backgroundColor="#161622" style="light"/>
    </>

  );
}

export default ProfileLayout;
