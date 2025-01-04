import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function ManualPaymentScreen({ route }) {
  const { newTransaction } = route.params; // Receive transaction data from SummaryScreen
  const [paymentReference, setPaymentReference] = useState('');
  const navigation = useNavigation();

  const handlePayment = () => {
    // Handle the payment logic here
    alert('Payment processed successfully!');
    const completedTransaction = {
      ...newTransaction,
      status: 'COMPLETE',
    };

    // Navigate to PaymentSuccessScreen, passing the completed transaction
    navigation.navigate('paymentsuccessful', { completedTransaction });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manual Payment</Text>

      <View style={styles.subcontainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Total Amount Due</Text>
          <Text style={styles.totalCostText}>{newTransaction.amount}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Payment Reference</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter payment reference"
            value={paymentReference}
            onChangeText={setPaymentReference}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
        <Text style={styles.paymentButtonText}>Submit Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 44,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  totalCostText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  paymentButton: {
    backgroundColor: '#000000',
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 100,
  },
});
