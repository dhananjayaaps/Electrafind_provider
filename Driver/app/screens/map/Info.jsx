import { View, Text } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import CardSpace from '../../../components/CardSpace';
import { StyleSheet } from 'react-native';
import StarRating from '../../../components/StarRating';

export default function Info() {

  const route = useRoute();
  const { place } = route.params;
  console.log('place: ',place);

  return (
    <View>

      <CardSpace>
        <Text style={styles.title}>Rating:</Text>
          <View style={styles.infoContainer}>
            {place?.rating ? (
              <StarRating rating={place.rating} />
            ) : (
              <Text style={styles.contactText}>No rating available.</Text>
            )}
        </View>
      </CardSpace>

      <CardSpace>
        <Text style={styles.title}>Contact Info:</Text>
        <View style={styles.infoContainer}>
          {place?.nationalPhoneNumber ? (
            <Text style={styles.contactText}>Phone: {place.nationalPhoneNumber}</Text>
          ) : (
            <Text style={styles.contactText}>No contact information available.</Text>
          )}
        </View>
      </CardSpace>

      <CardSpace>
      <Text style={styles.title}>Opening Hours:</Text>
        {place?.currentOpeningHours?.weekdayDescriptions ? (
          <View>
            {place.currentOpeningHours.weekdayDescriptions.map((description, index) => (
              <Text key={index} style={styles.hoursText}>{description}</Text>
            ))}
          </View>
        ) : (
          <Text style={styles.hoursText}>No opening hours available.</Text>
        )}
      </CardSpace>  
      
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  hoursText: {
    fontSize: 16,
    marginBottom: 5,
  },
  contactText: {
    fontSize: 16,
    marginBottom: 5,
  },
  infoContainer: {
    flexDirection: 'column',
  }

});