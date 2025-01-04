import { Text, View } from 'react-native';
import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './sign-in';
import SignUp from './sign-up';
import Verification from './verification';
import Verified from './verified';

const Stack = createStackNavigator();

const AuthLayout = () => {
  return (
    <>
      
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen
          name="sign-in"
          component={SignIn}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="sign-up"
          component={SignUp}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="verification"
          component={Verification}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="verified"
          component={Verified}
          options={{
            headerShown: false
          }}
        />
        </Stack.Navigator>
      

      <StatusBar backgroundColor="#161622" style="light"/>
    </>
  )
}

export default AuthLayout