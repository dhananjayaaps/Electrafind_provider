import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import SignIn from './sign-in';
import SignUp from './sign-up';



const AuthLayout = () => {

  const Stack = createStackNavigator();

  return (
    <>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* SignIn Screen */}
          <Stack.Screen
            name="sign-in"
            component={SignIn}
          />
          {/* SignUp Screen */}
          <Stack.Screen
            name="sign-up"
            component={SignUp}
          />
          
        </Stack.Navigator>
        <StatusBar backgroundColor="#161622" style="light" />
      </>
  );
};

export default AuthLayout;
