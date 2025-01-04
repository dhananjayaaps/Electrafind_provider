import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import CustomButtonGoogle from "../../components/CustomButtonGoogle";
import FormField from "../../components/FormField";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from 'expo-router'

const SignUp = () => {

  const navigation = useNavigation();

  const [form, setForm] = useState({
    username:"",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const submit = () => {
    
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6 mt-0">

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
              {/* <Text className="text-4xl font-semibold text-green-500 font-pbold">ElectraFind</Text> */}

            </View>
          </View>
          

          <View>
            <Text className="text-4xl font-semibold text-white mt-10 font-psemibold">Let's get</Text>
            <Text className="text-4xl font-semibold text-white mt-4 font-psemibold">Started</Text>
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
            handlePress={() => navigation.navigate('verification')} 
            containerStyles="mt-7"
            isLoading={isSubmitting}

          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              or Continue with
            </Text>
          </View>

          <CustomButtonGoogle
            imageSrc={images.google}
            title="Google"
            containerStyles="mt-7 bg-gray-300"
            isLoading={isSubmitting}
            // handlePress={() => router.push('/map')}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-green-500"
            >
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;