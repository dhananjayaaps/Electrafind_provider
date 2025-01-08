import { View, Text, Image, Button } from 'react-native';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import openMap from 'react-native-open-maps';
import * as Haptics from 'expo-haptics';
import NavigateButton from '../../../components/NavigateButton';
import Info from '../../screens/map/Info';
import { StyleSheet } from 'react-native';

export default function ChargingStationProfile() {
  const route = useRoute();
  const { station } = route.params;
  const [activeButton, setActiveButton] = useState("Info");

  const town = station?.Location?.split(",").pop()?.trim();
  const rating = station?.Rating || 0; // Default rating to 0 if not available

  const handleButtonPress = (buttonName) => {
    setActiveButton(buttonName);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const navigateToLocation = () => {
    if (station?.Latitude && station?.Longitude) {
      openMap({
        latitude: station.Latitude,
        longitude: station.Longitude,
        zoom: 25,
        query: station.Name,
      });
    }
  };


  return (
    <View>
      <ScrollView>
        <View className="relative">
          <Image
            source={
              station?.ImageUrl
                ? { uri: station.ImageUrl }
                : 'https://images.squarespace-cdn.com/content/v1/5f3b08d4515c242514c95656/f7890c9c-7fcc-439b-b285-5d1328b375c1/commercial-ev-charging-station.jpg'
            }
            style={{
              width: '100%',
              height: 300,
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ position: 'absolute', top: 35, left: 5 }}
            activeOpacity={0.7}
            className={'p-2'}
          >
            <Ionicons
              name={"arrow-back-outline"}
              resizeMode="contain"
              color={"#ffffff"}
              size={30}
              style={{
                padding: 3,
                backgroundColor: '#161622',
                borderRadius: 30,
                opacity: 0.7,
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
          className="bg-white -mt-10 pt-7"
        >
          <View className="px-5 mb-2">
            <Text className="text-3xl font-bold">
              {station.Name}
            </Text>

            <View className="flex-row items-center space-x-1 mt-2">
              <Ionicons name="location" color="gray" width="20" height="20" />
              <Text
                style={{ color: "gray", fontSize: 15 }}
                className="font-pmedium"
              >
                {station.Location}
              </Text>
            </View>

            <View className="flex-row items-center space-x-1 mt-5">
              
            </View>
          </View>
        </View>

        <View>
          <NavigateButton
            title={"Navigate"}
            handlePress={navigateToLocation}
            containerStyles={"mt-1"}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
            marginHorizontal: 20,
            backgroundColor: "#E9E9E9",
            borderRadius: 20,
            borderWidth: 2,
            borderColor: "#000000",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 14,
              paddingHorizontal: 55,
              margin: 2,
              backgroundColor: activeButton === "Info" ? "#000000" : "transparent",
              borderRadius: activeButton === "Info" ? 15 : 0,
            }}
            onPress={() => handleButtonPress("Info")}
          >
            <Text
              style={{
                color: activeButton === "Info" ? "#fff" : "#000",
              }}
              className={"font-psemibold"}
            >
              Info
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 14,
              paddingHorizontal: 55,
              margin: 2,
              backgroundColor: activeButton === "Charge" ? "#000000" : "transparent",
              borderRadius: activeButton === "Charge" ? 15 : 0,
            }}
            onPress={() => handleButtonPress("Charge")}
          >
            <Text
              style={{
                color: activeButton === "Charge" ? "#fff" : "#000",
              }}
              className={"font-psemibold"}
            >
              Charge
            </Text>
          </TouchableOpacity>
        </View>

        {activeButton === "Info" && (
          <View style={{ marginHorizontal: 16, marginVertical: 25 }}>
            <Info placeInfo={station} />
          </View>
        )}

        {activeButton === "Charge" && (
          <View style={styles.cardContainer}>
            {station.Prices &&
              Object.entries(JSON.parse(station.Prices)).map(([level, details]) =>
                details.active ? (
                  <View key={level} style={styles.priceCard}>
                    <Text style={styles.levelTitle}>
                      {`${level.toUpperCase()} Charging`}
                    </Text>
                    <Text style={styles.priceText}>
                      Rs. {details.price} <Text style={styles.priceUnit}>/min</Text>
                    </Text>
                  </View>
                ) : null
              )}
          </View>
        )}

      </ScrollView>
    </View>
  );
  
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 25,
    backgroundColor: '#f8f9fa',  // Light background to make it pop
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5, // For Android shadow effect
  },
  priceCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999',
  },
});
