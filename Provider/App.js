import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import pages
import ScanQR from './Pages/ScanQR';
import Earnings from './Pages/Earnings';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import ChargingSessions from './Pages/sessions';
import SessionDetails from './Pages/SessionDetails';
import Profile from './Pages/Profile';

// Create Stack and Bottom Tab Navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: '#110F0F' },
        tabBarActiveTintColor: '#fff',
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: '#110F0F' },
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Charging Sessions') {
            iconName = focused ? 'car-sport' : 'car-sport-outline';
          } else if (route.name === 'QR') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'Earnings') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          // Return the appropriate icon
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Charging Sessions" component={ChargingSessions} />
      <Tab.Screen name="QR" component={ScanQR} />
      <Tab.Screen name="Earnings" component={Earnings} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth-related screens */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />

        {/* Bottom navbar screens */}
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name="SessionDetails" component={SessionDetails} />
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
