import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { images } from '../../../constants';

export default function PaymentSuccessScreen({route}) {
  const { completedTransaction } = route.params; // Receive the completed transaction data
  const navigation = useNavigation();

  const handleDone = () => {
    // Navigate to History and pass the completed transaction data
    navigation.navigate('index', {
      activeButton: 'History',
      newTransaction: completedTransaction,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Successful!</Text>
      <View>
        <Image
          source={images.order}
          resizeMode="contain"
          className="w-[100px] h-[130px] items-center mb-10"
        />
      </View>
      <Text style={styles.message}>Thank you! Your payment has been successfully processed.</Text>
      
      <TouchableOpacity style={styles.homeButton} onPress={handleDone}>
        <Text style={styles.homeButtonText}>Done</Text>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2ba805',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold'
  },
  homeButton: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
