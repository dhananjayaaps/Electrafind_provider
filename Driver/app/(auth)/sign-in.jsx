import { useState } from "react";
import { Alert, View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { API_URL } from "@env"; 

const SignIn = () => {
  const navigation = useNavigation(); 

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("API_URL", API_URL);
      const response = await axios.post(`${API_URL}/users/login`, {
        Email: form.email,
        Password: form.password,
      });
      console.log("Sign-in response:", response);

      const { user, token } = response.data;

      // Save user data in AsyncStorage
      await AsyncStorage.setItem("userId", String(user.userId));
      await AsyncStorage.setItem("email", user.email);
      await AsyncStorage.setItem("name", user.name);
      await AsyncStorage.setItem("userToken", token);

      Alert.alert("Success", "Sign-in successful!");
      navigation.replace("MapLayout"); // Ensure you're navigating to a valid route in your stack
    } catch (error) {
      // console.error("Sign-in error:", error);
      Alert.alert("Error", "Failed to sign in. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full flex justify-center h-full px-4 my-6 mt-0">
        <TouchableOpacity onPress={() => navigation.navigate("sign-up")}>
          <Ionicons name="arrow-back-outline" color="#ffffff" size={30} />
        </TouchableOpacity>

        <Text className="text-4xl font-semibold text-white mt-10">Hey,</Text>
        <Text className="text-4xl font-semibold text-white mt-3">Welcome Back!</Text>

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
          secureTextEntry={true}
        />

        <CustomButton
          title="Sign In"
          containerStyles="mt-7"
          isLoading={isSubmitting}
          handlePress={handleSignIn}
        />

        <View className="flex justify-center pt-5 flex-row gap-2">
          <Text className="text-lg text-gray-100">Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('sign-up')}>
            <Text className="text-lg text-green-500">Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
