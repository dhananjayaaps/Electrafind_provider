import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";  // Correct import for router
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {

  const navigation = useNavigation(); 

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {
    // Handle submit logic here (e.g., API calls)
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex justify-center h-full px-4 my-6 mt-0">
          <View className="flex flex-row items-center pt-2 gap-1">
            <TouchableOpacity onPress={() => router.push('/sign-in')}>
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

          <View>
            <Text className="text-4xl font-semibold text-white mt-10 font-psemibold">
              Let's get
            </Text>
            <Text className="text-4xl font-semibold text-white mt-4 font-psemibold">
              Started
            </Text>
          </View>

          <FormField
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-6"
            placeholder={"Enter your username"}
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
          />

          <CustomButton
            title="Sign Up"
            handlePress={() => router.push('/verification')}  // Use router.push for navigation
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('sign-in')}>
            <Text className="text-lg text-green-500">Sign up</Text>
          </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
