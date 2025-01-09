import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router"; // Correct import for router
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

const SignUp = () => {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    // Simple validation for empty fields
    if (!form.email || !form.password || !form.phoneNumber || !form.address || !form.username) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
  
    try {
      setIsSubmitting(true);
  
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserType: "VehicleUser", 
          Name: form.username,
          Email: form.email,
          Password: form.password,
          PhoneNumber: form.phoneNumber,
          Address: form.address,
        }),
      });
  
      // Handle the response
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert("Success", "Registration successful!");
        navigation.navigate("sign-in");
      } else {
        // Show error from the API response
        Alert.alert("Error", data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex justify-center h-full px-4 my-6 mt-0">
          {/* Back Button and Logo */}
          <View className="flex flex-row items-center pt-2 gap-1">
            <TouchableOpacity onPress={() => router.push("/sign-in")}>
              <Ionicons
                name={"arrow-back-outline"}
                resizeMode="contain"
                color={"#ffffff"}
                size={30}
              />
            </TouchableOpacity>

            <View>
              <Image
                source={images.logoverticalshort}
                resizeMode="contain"
                className="w-[550px] h-[60px] items-center "
              />
            </View>
          </View>

          {/* Heading */}
          <View>
            <Text className="text-4xl font-semibold text-white mt-10 font-psemibold">
              Let's get
            </Text>
            <Text className="text-4xl font-semibold text-white mt-4 font-psemibold">
              Started
            </Text>
          </View>

          {/* Form Fields */}
          <FormField
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-6"
            placeholder={"Enter your Name"}
            iconName={"person-outline"}
          />

          <FormField
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-1"
            keyboardType="email-address"
            placeholder={"Enter your email"}
            iconName={"mail-outline"}
          />

          <FormField
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-1"
            placeholder={"Enter your password"}
            iconName={"lock-closed-outline"}
            secureTextEntry={true} // For password masking
          />

          <FormField
            value={form.phoneNumber}
            handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
            otherStyles="mt-1"
            placeholder={"Enter your phone number"}
            keyboardType="phone-pad"
            iconName={"call-outline"}
          />

          <FormField
            value={form.address}
            handleChangeText={(e) => setForm({ ...form, address: e })}
            otherStyles="mt-1"
            placeholder={"Enter your address"}
            iconName={"location-outline"}
          />

          {/* Submit Button */}
          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          {/* Footer */}
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("sign-in")}>
              <Text className="text-lg text-green-500">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
