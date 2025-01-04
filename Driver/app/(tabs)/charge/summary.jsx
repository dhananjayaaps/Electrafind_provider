import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SummaryScreen({ route }) {
  const { totalTime, totalCost, startTime, endTime } = route.params; // Receive total time and cost from TimerScreen
  const navigation = useNavigation();

  const handlePayment = () => {
    const newTransaction = {
      id: (Math.random() * 10000).toFixed(0), // Random ID for simplicity
      date: new Date().toLocaleString(),
      reference: 'Generated Reference', // Replace with your reference logic
      amount: `LKR ${totalCost.toFixed(2)}`,
      startTime,
      endTime,
      duration: totalTime, // Assuming totalTime is in minutes
      status: 'PENDING',
      energyDelivered: '50.25 kWh', // Replace with the actual energy delivered
      stopReason: '-',
    };

    // Navigate to ManualPaymentScreen, passing the transaction data
    navigation.navigate('manualpayment', { newTransaction });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Charging Summary</Text>

      <View style={styles.subcontainer}>
      {/* Station Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Station Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Operator</Text>
            <Text style={styles.value}>EleXA</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Station name</Text>
            <Text style={styles.value}>PTT Serithai</Text>
          </View>
        </View>

        {/* Charging Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Charging Information</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Start Charging</Text>
            <Text style={styles.value}>{startTime}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>End Charging</Text>
            <Text style={styles.value}>{endTime}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Total Time (minutes)</Text>
            <Text style={styles.value}>{totalTime}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Usage (kWh)</Text>
            <Text style={styles.value}>50.25 kWh</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Total cost (Rs.)</Text>
            <Text style={styles.value}>{totalCost.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonsection}>
        <TouchableOpacity style={styles.doneButton} onPress={handlePayment}>
          <Text style={styles.doneButtonText}>Manual Payment</Text>
        </TouchableOpacity>
        <Text style={styles.buttonsectiontext}>or</Text>
        <TouchableOpacity style={styles.doneButton} onPress={() => navigation.navigate('index')}>
          <Text style={styles.doneButtonText}>Card Payment</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    width: '100%',
  },
  subcontainer: {
    paddingVertical: 40,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    backgroundColor: '#E7F5ED',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '90%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 40,
    width: '80%',
    
  },
  buttonsection: {
    marginTop: 40,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },

  buttonsectiontext: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginHorizontal: 20,
  },
  doneButton: {
    backgroundColor: '#000000',
    paddingVertical: 20,
    width: '45%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 18,
    color: '#555',
  },
  value: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  }
});
