// StarRating.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StarRating = ({ rating, maxStars = 5 }) => {
  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    let iconName = 'star-outline';
    if (i <= rating) {
      iconName = 'star';
    } else if (i - rating < 1) {
      iconName = 'star-half';
    }
    stars.push(
      <Ionicons key={i} name={iconName} size={20} color="#ffc400" />
    );
  }
  return <View style={styles.starContainer}>{stars}</View>;
};

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: 'row',
  },
});

export default StarRating;
