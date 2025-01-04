// Card.js
import React from 'react';
import { View, StyleSheet } from 'react-native';


const CardSpace = ({ children }) => {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E8E9EB', // Light gray background
    borderRadius: 10,
    padding: 20,
    margin: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 5,
  },
});

export default CardSpace;
