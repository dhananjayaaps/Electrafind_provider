import { View, Text } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import CardSpace from '../../../components/CardSpace';
import { StyleSheet } from 'react-native';
import StarRating from '../../../components/StarRating';
import { Ionicons } from '@expo/vector-icons';

export default function Info() {

  const route = useRoute();
  const { station } = route.params;
  console.log('station log: ',station);
  const rating = station?.Rating || 0; // Default rating to 0 if not available

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={18}
        color={"gold"}
      />
    ));
  };

  return (
    <View>

      <CardSpace>
        <Text style={styles.title}>Rating:</Text>
          <View style={styles.infoContainer}>
            {station?.rating ? (
              <StarRating rating={station.rating} />
            ) : (
              <View className="flex-row items-center space-x-1 mt-2">
                <Ionicons name="star" color="gray" width="20" height="20" />
                {renderStars(rating)}
                <Text style={{ color: "gray", fontSize: 15 }} className="ml-2">
                  {rating || "0"} / 5
                </Text>
              </View>
            )}
        </View>
      </CardSpace>

      <CardSpace>
        <Text style={styles.title}>Contact Info:</Text>
        <View style={styles.infoContainer}>
          {/* Display Email if it exists */}
          {station?.Email ? (
            <Text style={styles.contactText}>Email: {station.Email}</Text>
          ) : (
            <Text style={styles.contactText}>No email available.</Text>
          )}

          {/* Display Phone if it exists */}
          {station?.Phone ? (
            <Text style={styles.contactText}>Phone: {station.Phone}</Text>
          ) : (
            <Text style={styles.contactText}>No phone number available.</Text>
          )}
        </View>
      </CardSpace>

      <CardSpace>
      <Text style={styles.title}>Opening Hours:</Text>
        {station?.AvailableStartTime? (
          <View>
            <Text style={styles.hoursText}>{station.AvailableStartTime} - {station.AvailableEndTime}</Text>
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