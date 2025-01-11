// import { Platform, Text, View, StyleSheet } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { useFonts } from 'expo-font';
// import * as Location from 'expo-location';
// import { UserLocationContext } from './Context/UserLocationContext';
// import { ClerkProvider, ClerkLoaded, SignedOut, SignedIn, useAuth } from "@clerk/clerk-expo";
// import { StatusBar } from 'expo-status-bar';
// import { VehicleProvider } from './Context/VehicleContext';
// import Home from './index';
// import * as SecureStore from 'expo-secure-store';
// import { NavigationContainer } from '@react-navigation/native';
// import TabsLayout from './(tabs)/_layout';
// import CustomSplashScreen from './splashscreen';
// import * as SplashScreen from 'expo-splash-screen';
// import AuthLayout from './(auth)/_layout';
// import { GarageProvider } from './Context/GarageContext';

// SplashScreen.preventAutoHideAsync();

// const tokenCache = {
//   async getToken(key) {
//     try {
//       const item = await SecureStore.getItemAsync(key);
//       if (item) {
//         console.log(`${key} was used 🔐 \n`);
//       } else {
//         console.log("No values stored under key: " + key);
//       }
//       return item;
//     } catch (error) {
//       console.error("SecureStore get item error: ", error);
//       await SecureStore.deleteItemAsync(key);
//       return null;
//     }
//   },
//   async saveToken(key, value) {
//     try {
//       return SecureStore.setItemAsync(key, value);
//     } catch (err) {
//       return;
//     }
//   },
// };

// const RootLayout = () => {
//   const [appIsReady, setAppIsReady] = useState(false);
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setErrorMsg('Permission to access location was denied');
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       setLocation(location.coords);
//     })();
//   }, []);

//   let text = 'Waiting..';
//   if (errorMsg) {
//     text = errorMsg;
//   } else if (location) {
//     text = JSON.stringify(location);
//   }

//   const [fontsLoaded, error] = useFonts({
//     "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
//     "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
//     "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
//     "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
//     "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
//     "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
//     "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
//     "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
//     "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
//   });

//   useEffect(() => {
//     if (error) throw error;

//     if (fontsLoaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded, error]);

//   if (!appIsReady) {
//     return <CustomSplashScreen setAppIsReady={setAppIsReady} />;
//   }

//   if (!fontsLoaded) {
//     return null;
//   }

//   return (
    

//           <VehicleProvider>
//             <GarageProvider>
//               <NavigationContainer independent={true}>
//                 <SignedIn>
                
//                   <TabsLayout />
//                 </SignedIn>
//                 <SignedOut>
                  
//                   <AuthLayout />
                  
//                 </SignedOut>
//               </NavigationContainer>
//             </GarageProvider>
//           </VehicleProvider>
//   );
// };

// export default RootLayout;

import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { GarageProvider } from './Context/GarageContext';
import { VehicleProvider } from './Context/VehicleContext';
// Screens
import CustomSplashScreen from "./splashscreen"; // Custom Splash Screen component
import AuthLayout from "./(auth)/_layout"; // Authentication layout
import MapLayout from "./(tabs)/map/_layout"; // Map layout
import TabsLayout from "./(tabs)/_layout";

const Stack = createStackNavigator();

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setIsLoggedIn(!!token); // If token exists, user is logged in
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    // Show a loading screen while checking login status
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A86B" />
      </View>
    );
  }

  return (
    <VehicleProvider>
      <GarageProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isLoggedIn ? "MapLayout" : "AuthLayout"}
            screenOptions={{
              headerShown: false, // Hide headers globally
            }}
          >
            {/* Authentication flow */}
            <Stack.Screen name="AuthLayout" component={AuthLayout} />

            {/* Main app flow */}
            <Stack.Screen name="MapLayout" component={TabsLayout} />
          </Stack.Navigator>
        </NavigationContainer>
      </GarageProvider>
    </VehicleProvider>
    
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
