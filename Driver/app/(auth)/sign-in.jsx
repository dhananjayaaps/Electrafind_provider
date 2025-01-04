import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Alert, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Install with `npm install @react-native-async-storage/async-storage`

import { useNavigation } from "expo-router";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import CustomButtonGoogle from "../../components/CustomButtonGoogle";
import { images } from "../../constants";
import { API_URL, API_KEY } from '@env';

const SignIn = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = "https://your-api-url.com"; // Replace with your API URL

  const handleSignIn = async () => {
    if (!form.email || !form.password) {
      return Alert.alert("Error", "Please fill in both email and password.");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: form.email,
          Password: form.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Save token and user details in AsyncStorage
        await AsyncStorage.setItem("token", result.token);
        await AsyncStorage.setItem("user", JSON.stringify(result.user));

        Alert.alert("Success", "Logged in successfully!");
        navigation.navigate("dashboard"); // Replace 'dashboard' with your target screen
      } else {
        Alert.alert("Error", result.message || "Failed to log in.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An error occurred during login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex justify-center h-full px-4 my-6 mt-0">
          <View className="flex flex-row items-center pt-2 gap-1">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back-outline" color="#ffffff" size={30} />
            </TouchableOpacity>
            <View>
              <Image
                source={images.logoverticalshort}
                resizeMode="contain"
                className="w-[550px] h-[60px] items-center"
              />
            </View>
          </View>

          <View>
            <Text className="text-4xl font-semibold text-white mt-10">Hey, </Text>
            <Text className="text-4xl font-semibold text-white mt-3">Welcome</Text>
            <Text className="text-4xl font-semibold text-white mt-3">Back!</Text>
          </View>

          <FormField
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            placeholder="Enter your email"
            otherStyles="mt-7"
            keyboardType="email-address"
            iconName="mail-outline"
          />

          <FormField
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            placeholder="Enter your password"
            otherStyles="mt-1"
            iconName="lock-closed-outline"
            secureTextEntry
          />

          <CustomButton
            title="Sign In"
            containerStyles="mt-7"
            isLoading={isSubmitting}
            handlePress={handleSignIn}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100">or Continue with</Text>
          </View>

          <CustomButtonGoogle
            imageSrc={images.google}
            title="Google"
            containerStyles="mt-7 bg-gray-300"
            isLoading={isSubmitting}
            onPress={() => Alert.alert("Google Sign-In", "Coming soon!")}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100">Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("sign-up")}>
              <Text className="text-lg text-green-500">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
