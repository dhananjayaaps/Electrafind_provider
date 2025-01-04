import { SafeAreaView, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../screens/charge/Header';
import Recent from '../../screens/charge/Recent';
import History from '../../screens/charge/History';

export default function ChargeScreen({route}) {
  const [activeButton, setActiveButton] = useState(route.params?.activeButton || "Recent");
  const [transactions, setTransactions] = useState([]);

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

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('transactions');
      setTransactions([]);
      Alert.alert('Success', 'Transaction history has been cleared.');
    } catch (error) {
      console.error('Failed to clear history:', error);
      Alert.alert('Error', 'Failed to clear transaction history.');
    }
  };

  const renderContent = () => {
    if (activeButton === "Recent") {
      return <Recent />;
    } else if (activeButton === "History") {
      return (
        <View>
          {transactions.length === 0 ? (
            <Text style={styles.noHistoryText}>History not available</Text>
          ) : (
            <History transactions={transactions} />
          )}
          {/* Show Clear History Button only in History view */}
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearHistory}
          >
            <Text style={styles.clearButtonText}>Clear History</Text>
          </TouchableOpacity>
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
