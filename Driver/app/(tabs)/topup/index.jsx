import { Text, View, Image } from "react-native";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import axios from "axios"; // For API calls
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {RNRestart} from 'react-native-restart';
import { Alert } from "react-native";

const TopupScreen = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState("");
  const [username, setUsername] = useState("defaultUser");
  const [loading, setLoading] = useState(false);

  // Fetch user details from your backend
  const fetchUserDetails = async () => {
    // console.log("Fetching user details...");
    try {
      setLoading(true);
      // get the token from AsyncStorage
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get(`${API_URL}/users/profile`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User details response:", response.data);

      setProfileImage(response.data.ImageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png");
      setUsername(response.data.Name || "defaultUser");
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const logoutHandler = async () => {
    try {
      // Clear user data from AsyncStorage
      await AsyncStorage.clear();
  
      // Notify the user of successful logout
      Alert.alert("Logout Successful", "You have been logged out.", [
        {
          text: "OK",
          onPress: () => {
            // Reset navigation stack and navigate to "sign-in"
            navigation.reset({
              index: 0, // Set the initial route index
              routes: [{ name: "AuthLayout" }], // Replace the stack with the "sign-in" route
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={{ flex: 1, paddingTop: 80 }}>
      <ScrollView>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 3,
              borderColor: "black",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate("UserProfile")}>
              <Image
                source={{
                  uri: profileImage || "https://via.placeholder.com/150",
                }}
                style={{ width: 110, height: 110, borderRadius: 100 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text
            style={{
              textAlign: "center",
              fontSize: 25,
              paddingTop: 10,
              fontWeight: "600",
            }}
          >
            {username}
          </Text>
        </View>

        <View style={{ marginHorizontal: 16, marginTop: 30 }}>
          <Text style={{ fontSize: 20, marginBottom: 16 }}>Account Details</Text>

          {/* Profile Details */}
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => navigation.navigate("UserProfile")}
          >
            <View style={styles.optionContent}>
              <FontAwesome name="user-o" size={20} color={"black"} />
              <View>
                <Text style={styles.optionTitle}>Detail Profile</Text>
                <Text style={styles.optionSubtitle}>Information Account</Text>
              </View>
            </View>
            <AntDesign name="right" size={26} color={"#CBD5E0"} />
          </TouchableOpacity>

          {/* Vehicle Profile */}
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => navigation.navigate("CarProfile")}
          >
            <View style={styles.optionContent}>
              <FontAwesome name="car" size={20} color={"black"} />
              <View>
                <Text style={styles.optionTitle}>Vehicle Profile</Text>
                <Text style={styles.optionSubtitle}>Details of your EV</Text>
              </View>
            </View>
            <AntDesign name="right" size={26} color={"#CBD5E0"} />
          </TouchableOpacity>

          {/* Wallet */}
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => navigation.navigate("Wallet")}
          >
            <View style={styles.optionContent}>
              <FontAwesome name="money" size={20} color={"black"} />
              <View>
                <Text style={styles.optionTitle}>Wallet</Text>
                <Text style={styles.optionSubtitle}>Top up</Text>
              </View>
            </View>
            <AntDesign name="right" size={26} color={"#CBD5E0"} />
          </TouchableOpacity>

          {/* Marketplace */}
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => navigation.navigate("Marketplace")}
          >
            <View style={styles.optionContent}>
              <MaterialCommunityIcons name="handshake" size={20} color={"black"} />
              <View>
                <Text style={styles.optionTitle}>Marketplace</Text>
                <Text style={styles.optionSubtitle}>
                  Sell your vehicle and parts
                </Text>
              </View>
            </View>
            <AntDesign name="right" size={26} color={"#CBD5E0"} />
          </TouchableOpacity>

          {/* Garage */}
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => navigation.navigate("GaragePlace")}
          >
            <View style={styles.optionContent}>
              <MaterialCommunityIcons name="garage" size={20} color={"black"} />
              <View>
                <Text style={styles.optionTitle}>
                  Service Stations & Mechanics
                </Text>
                <Text style={styles.optionSubtitle}>
                  Display your EV-related business
                </Text>
              </View>
            </View>
            <AntDesign name="right" size={26} color={"#CBD5E0"} />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity style={styles.optionContainer} onPress={logoutHandler}>
            <View style={styles.optionContent}>
              <Ionicons name="log-out-outline" size={20} color={"black"} />
              <View>
                <Text style={styles.optionTitle}>Log Out</Text>
              </View>
            </View>
            <AntDesign name="right" size={26} color={"#CBD5E0"} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default TopupScreen;

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  optionSubtitle: {
    color: "#575757",
  },
});
