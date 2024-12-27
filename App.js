import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './Pages/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home1 from './Pages/Home1';
import ScanQR from './Pages/ScanQR';
import Success from './Pages/Success';
import Chargings from './Pages/Chargings';
import Earnings from './Pages/Earnings';
import Login from './Pages/Login';
import Signup from './Pages/Signup';

export default function App() {
  
  // Make sure to call the function here
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Charging" component={ScanQR}/>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Home1" component={Home1} />
        <Stack.Screen name="success" component={Success}/>
        <Stack.Screen name="chargings" component={Chargings} />
        <Stack.Screen name="Earnings" component={Earnings} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#110F0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
