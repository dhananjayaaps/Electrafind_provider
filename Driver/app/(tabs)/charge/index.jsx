import { SafeAreaView, Text, View, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../screens/charge/Header';
import Recent from '../../screens/charge/Recent';
import History from '../../screens/charge/History';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

export default function ChargeScreen({route}) {
  const [activeButton, setActiveButton] = useState(route.params?.activeButton || "Recent");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const navigation = useNavigation();

  const fetchSessions = async () => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        throw new Error('No token found in AsyncStorage');
      }

      // Make the API call with the token in the Authorization header
      console.log('API_URL:', API_URL);
      const response = await fetch(`${API_URL}/sessions/mysessions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Response:', response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log('Fetched sessions:', data);
      const reveresed = data.reverse();
      return reveresed;
    } catch (error) {
      // console.error('Error fetching sessions:', error);
      return [];
    }
  };


  useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await fetchSessions();
        setSessions(response);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };
  
    loadSessions();

  }, [activeButton]);
  

  useEffect(() => {
    // Load transactions from AsyncStorage when the component mounts
    const loadTransactions = async () => {
      try {
        const savedTransactions = await AsyncStorage.getItem('transactions');
        if (savedTransactions !== null) {
          setTransactions(JSON.parse(savedTransactions));
        }
      } catch (error) {
        console.error('Failed to load transactions:', error);
      }
    };

    loadTransactions();
  }, []);

  useEffect(() => {
    if (route.params?.newTransaction) {
      const updatedTransactions = [route.params.newTransaction, ...transactions];
      setTransactions(updatedTransactions);

      // Save the updated transactions to AsyncStorage
      const saveTransactions = async () => {
        try {
          await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        } catch (error) {
          console.error('Failed to save transactions:', error);
        }
      };

      saveTransactions();
    }
  }, [route.params?.newTransaction]);

  const handleButtonPress = (buttonName) => {
    setActiveButton(buttonName);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderSession = ({ item }) => (
    <TouchableOpacity
      style={styles2.sessionCard}
      // navigation.navigate('options')
      onPress={() => navigation.navigate('options', { session: item })}
    >
      <Text style={styles2.sessionText}>
        <Text style={styles2.bold}>Session ID:</Text> {item.sessionId}
      </Text>
      {/* <Text style={styles2.sessionText}>
        <Text style={styles2.bold}>User:</Text> {item.userName}
      </Text> */}
      <Text style={styles2.sessionText}>
        <Text style={styles2.bold}>Charge Type:</Text> {item.chargeType || 'N/A'}
      </Text>
      <Text style={styles2.sessionText}>
        <Text style={styles2.bold}>Status:</Text> {item.status}
      </Text>
      {item.status === 'Ongoing' && item.remainingTime !== undefined && (
        <Text
          style={[
            styles2.sessionText,
            item.remainingTime < 60 ? { color: '#FF4500' } : null, // Red text for < 1 minute
          ]}
        >
          <Text style={styles2.bold}>Remaining Time:</Text>{' '}
          {item.remainingTime > 0
            ? `${Math.floor(item.remainingTime / 60)}:${
                item.remainingTime % 60 < 10
                  ? '0' + (item.remainingTime % 60)
                  : item.remainingTime % 60
              }`
            : 'Expired'}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (activeButton === "Recent") {
      return <Recent />;
    } else if (activeButton === "History") {
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
            <View style={styles.noSessionsContainer}>
              <Text style={styles2.noSessionsText}>No charging sessions found.</Text>
              <TouchableOpacity style={styles.button} onPress={fetchSessions}>
                <Text style={styles2.buttonText}>Reload</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );      
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Header />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              activeButton === "Recent" && styles.activeButton,
            ]}
            onPress={() => handleButtonPress("Recent")}
          >
            <Text
              style={[
                styles.buttonText,
                activeButton === "Recent" && styles.activeButtonText,
              ]}
            >
              Recent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              activeButton === "History" && styles.activeButton,
            ]}
            onPress={() => handleButtonPress("History")}
          >
            <Text
              style={[
                styles.buttonText,
                activeButton === "History" && styles.activeButtonText,
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={[{ key: activeButton }]} // Dummy data to trigger rendering
        renderItem={() => (
          <View style={styles.contentContainer}>
            {renderContent()}
          </View>
        )}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    zIndex: 10,
    paddingVertical: 40,
    paddingBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    marginHorizontal: 20,
    backgroundColor: "#E9E9E9",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000000",
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 55,
    margin: 2,
    borderRadius: 0,
  },
  activeButton: {
    backgroundColor: "#000000",
    borderRadius: 15,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
  },
  activeButtonText: {
    color: "#fff",
  },
  noHistoryText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
  clearButton: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    marginHorizontal: 20,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatListContent: {
    flexGrow: 1,
  },
  contentContainer: {
    marginHorizontal: 16,
    marginVertical: 25,
  },
  
});

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3e7e8',
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
    backgroundColor: '#000624',
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