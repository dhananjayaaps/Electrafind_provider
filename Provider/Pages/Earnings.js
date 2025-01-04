import React, { useEffect, useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Earnings() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = async () => {
    const token = await AsyncStorage.getItem('userToken');

    try {
      const response = await fetch(`${API_URL}/sessions/earnings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch sessions');

      const data = await response.json();
      setSessions(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleUser = () => {
    console.log('User clicked');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : null} 
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.header}>
            {/* <TouchableOpacity style={styles.users} onPress={handleUser}>
              <Image source={require('../assets/user 1.png')} style={styles.user} />
            </TouchableOpacity>
            <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', left: -220 }}>
              Earnings
            </Text> */}
          </View>

          <View style={styles.square}>
            <Text style={styles.text}>Date</Text>
            <Text style={styles.text}>Time</Text>
            <Text style={styles.text}>Cost (Rs.)</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
          ) : error ? (
            <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
          ) : (
            sessions.map((session, index) => (
              <View key={index} style={styles.data}>
                <Text style={styles.text1}>
                  {new Date(session.endTime).toLocaleDateString()}
                </Text>
                <Text style={styles.text1}>
                  {new Date(session.startTime).toLocaleTimeString()} - {new Date(session.endTime).toLocaleTimeString()}
                </Text>
                <Text style={styles.text1}>{session.cost.toFixed(2)}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#110F0F',
  },

  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
  },

  user: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
    left: 290,
  },

  square: {
    backgroundColor: '#FFFFFF',
    width: '98%',
    height: 60,
    padding: 20,
    marginBottom: 20,
    left: 2,
    top: -35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  text: {
    fontSize: 16,
    top: -2,
  },

  data: {
    width: '98%',
    height: 60,
    padding: 20,
    marginBottom: 20,
    left: 2,
    top: -35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  text1: {
    fontSize: 16,
    top: -2,
    color: '#fff',
    left: -5,
  },
});
