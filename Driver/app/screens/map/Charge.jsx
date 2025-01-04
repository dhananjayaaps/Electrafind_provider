import { View, Text } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import CardSpace from '../../../components/CardSpace';
import { StyleSheet } from 'react-native';


export default function Charge() {

  const route = useRoute();
  const { place } = route.params;
  console.log('place: ',place);

  return (
    <View>
      <CardSpace>
          <Text style={styles.title}>Charger Count:</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.contactText}>
              {place?.evChargeOptions?.connectorCount ? place.evChargeOptions.connectorCount : 'No information available'}
            </Text>
          </View>
      </CardSpace>

      <CardSpace>
          <Text style={styles.title}>Charger Types:</Text>
          <View style={styles.infoContainer}>
            {place?.evChargeOptions?.connectorAggregation ? (
              place.evChargeOptions.connectorAggregation.map((connector, index) => (
                <Text key={index} style={styles.contactText}>{connector.type.replace("EV_CONNECTOR_TYPE_", "").replace("_", " ")}</Text>
              ))
            ) : (
              <Text style={styles.contactText}>No information available.</Text>
            )}
          </View>
      </CardSpace>

      <CardSpace>
          <Text style={styles.title}>Max Charge Rate:</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.contactText}>
              {place?.evChargeOptions?.connectorAggregation ? (
                Math.max(...place.evChargeOptions.connectorAggregation.map(connector => connector.maxChargeRateKw)) + ' kW'
              ) : 'No information available'}
            </Text>
          </View>
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