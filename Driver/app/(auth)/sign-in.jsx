import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, Touchable } from "react-native";
import { TouchableOpacity } from "react-native";

import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import CustomButtonGoogle from "../../components/CustomButtonGoogle";
import FormField from "../../components/FormField";
import { Ionicons } from "@expo/vector-icons";

import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking"
import React from "react";
import { useNavigation } from 'expo-router'


export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  
  useWarmUpBrowser(); //import useWarmUpBrowser from "../../hooks/useWarmUpBrowser";

  const navigation = useNavigation();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const submit = () => {
    
  };

  const onPress = async() => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({ redirectUrl: Linking.createURL("/dashboard", { scheme: "myapp" })});

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        
        <View
          className="w-full flex justify-center h-full px-4 my-6 mt-0">
          
          <View className="flex flex-row items-center pt-2 gap-1">
            <TouchableOpacity onPress={() => router.push('/')}>
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
            <Text className="text-4xl font-semibold text-white mt-10 font-psemibold">Hey, </Text>
            <Text className="text-4xl font-semibold text-white mt-3 font-psemibold">Welcome</Text>
            <Text className="text-4xl font-semibold text-white mt-3 font-psemibold">Back!</Text>
          </View>

          <FormField
            
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            placeholder={"Enter your email"}
            otherStyles="mt-7"
            keyboardType="email-address"
            iconName={"mail-outline"}
          />

          <FormField
            
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            placeholder={"Enter your password"}
            otherStyles="mt-1"
            iconName={"lock-closed-outline"}
            secureTextEntry={true}
          />

          

          <CustomButton
            title="Sign In"
            containerStyles="mt-7"
            isLoading={isSubmitting}
            handlePress={() =>  navigation.navigate('sign-up')}
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
            onPress={onPress}
              

          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            {/* <Link
              href="/sign-up"
              className="text-lg font-psemibold text-green-500"
            > */}
            <TouchableOpacity onPress={() => navigation.navigate('sign-up')}>
              <Text className="text-lg text-green-500">Sign up</Text>
            </TouchableOpacity>
              
            
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;