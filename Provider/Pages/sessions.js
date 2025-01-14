import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { Audio } from 'expo-av';

export default function ChargingSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState();

  const navigation = useNavigation();

  const fetchSessions = async () => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        throw new Error('No token found in AsyncStorage');
      }

      // Make the API call with the token in the Authorization header
      // console.log('API_URL:', API_URL);
      const response = await fetch(`${API_URL}/sessions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log('Fetched sessions:', data);
      return data;
    } catch (error) {
      // console.error('Error fetching sessions:', error);
      return [];
    }
  };

  async function playBeep() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('../assets/beep.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  const stopBeep = async () => {
    if (sound) {
      await sound.stopAsync(); // Stop the sound playback
      await sound.unloadAsync(); // Unload the sound to free resources
      sound = null; // Reset the reference
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await fetchSessions();

        setSessions(response.reverse());
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };
  
    loadSessions();
  
    const interval = setInterval(() => {
      loadSessions(); 
      // console.log(sessions)
    }, 2000);
  
    return () => clearInterval(interval);
  }, []);
  

  // Update remaining time for ongoing sessions every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions((prevSessions) =>
        prevSessions.map((session) => {
          if (session.status === 'Ongoing' && session.endTime) {
            const remainingTime = Math.max(
              Math.floor((new Date(session.endTime) - Date.now()) / 1000),
              0
            ); // Calculate remaining time in seconds
            return { ...session, remainingTime };
          }
          return session;
        })
      );
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [sessions]);

  // if sound is not null, stop it after 5 seacounds
  useEffect(() => {
    if (sound) {
      setTimeout(() => {
        stopBeep();
      }, 5000);
    }
  }, [sound]);


  const renderSession = ({ item }) => {
    let elapsedTimeInSeconds = Math.floor(
      (Date.now() - new Date(item.startTime).getTime()) / 1000
    );
    let fixedChargingTimeInSeconds = item.fixedChargingTime * 60;
    let timeDifference = elapsedTimeInSeconds - fixedChargingTimeInSeconds;
  
    let timeDisplay;
    if (timeDifference <= 0) {
      let remainingSeconds = Math.abs(timeDifference);
      timeDisplay = `${Math.floor(remainingSeconds / 60)}:${
        remainingSeconds % 60 < 10 ? "0" + (remainingSeconds % 60) : remainingSeconds % 60
      } remaining`;
  
      // Trigger beep and notification for last 30 seconds
      if (remainingSeconds <= 30 && remainingSeconds >= 29) {
        if(!sound){
          playBeep();
        }
        Alert.alert(
          "Charging Session Alert",
          "30 seconds remaining before exceeding the fixed charging time!",
          [
            {
              text: "OK",
              onPress: () => stopBeep(),
            },
          ]
        );
      }
    } else {
      timeDisplay = `${Math.floor(timeDifference / 60)}:${
        timeDifference % 60 < 10 ? "0" + (timeDifference % 60) : timeDifference % 60
      } exceeded`;
    }
  
    return (
      <TouchableOpacity
        style={styles.sessionCard}
        onPress={() => navigation.navigate("SessionDetails", { session: item })}
      >
        <Text style={styles.sessionText}>
          <Text style={styles.bold}>Session ID:</Text> {item.sessionId}
        </Text>
        <Text style={styles.sessionText}>
          <Text style={styles.bold}>User:</Text> {item.userName}
        </Text>
        <Text style={styles.sessionText}>
          <Text style={styles.bold}>Charge Type:</Text> {item.chargeType || "N/A"}
        </Text>
        <Text style={styles.sessionText}>
          <Text style={styles.bold}>Status:</Text> {item.status}
        </Text>
        {item.status === "Ongoing" && (
          <Text
            style={[
              styles.sessionText,
              { color: timeDifference > 0 ? "#FF4500" : "#08A045" }, // Red for exceeded, green for remaining
            ]}
          >
            <Text style={styles.bold}>
              {timeDifference > 0 ? "Exceeded Time:" : "Remaining Time:"}
            </Text>{" "}
            {timeDisplay}
          </Text>
        )}
      </TouchableOpacity>
    );
  };
  

  return (
    <View style={styles.container}>
      {/* <Text style={styles.headerText}>All Charging Sessions</Text> */}
      {loading ? (
        <ActivityIndicator size="large" color="#08A045" />
      ) : sessions.length > 0 ? (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.sessionId.toString()}
          renderItem={renderSession}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noSessionsText}>No charging sessions found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#110F0F',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  sessionCard: {
    backgroundColor: '#333',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  sessionText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  noSessionsText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
