import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CustomSplashScreen from "./splashscreen"; // Splash Screen component
import AuthLayout from "./(auth)/_layout"; // Authentication layout
import MapLayout from "./(tabs)/map/_layout"; // Map layout
import * as SecureStore from "expo-secure-store";

const Stack = createStackNavigator();

export default function RootLayout() {

  return (
    
    <NavigationContainer>
      <Stack.Navigator
        // initialRouteName={isLoggedIn ? "MapLayout" : "AuthLayout"}
        initialRouteName="AuthLayout"
        screenOptions={{
          headerShown: false, // Hide headers globally
        }}
      >
        {/* Authentication flow */}
        <Stack.Screen name="AuthLayout" component={AuthLayout} />

        {/* Main app flow */}
        <Stack.Screen name="MapLayout" component={MapLayout} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
