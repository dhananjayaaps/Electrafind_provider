import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormFieldSmall from "../../components/FormFieldSmall";
import CustomButton from "../../components/CustomButton";
import {router} from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from 'expo-router'

const Verification = () => {

  const navigation = useNavigation();

  const [digit1, setDigit1] = useState('');
  const [digit2, setDigit2] = useState('');
  const [digit3, setDigit3] = useState('');
  const [digit4, setDigit4] = useState('');

    const handleVerify = () => { 
      const verificationCode = digit1 + digit2 + digit3 + digit4;
      router.push('Home'); 
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
  
  const submit = () => {
    
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full flex justify-center h-full px-4 my-6 mt-0">
          <View className="flex flex-row items-center pt-2 gap-1">
            <TouchableOpacity onPress={() => router.push('/sign-up')}>
              <Ionicons
                name={"arrow-back-outline"}
                resizeMode="contain"
                color={"#ffffff"}
                size={30}
              />
            </TouchableOpacity>
          </View>
          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Email Verification
          </Text>
          <Text className="text-base text-gray-100 font-pmedium mt-8">
            Enter the verification code sent to your email
          </Text>
          
          <View className="flex-row justify-between mt-7 mb-10">
            <FormFieldSmall
              
              value={digit1}
              maxLength={1}
              handleChangeText={(e) => setDigit1(e)}
              // otherStyles="mt-7 mb-7"
            />

            <FormFieldSmall
              
              value={digit2}
              maxLength={1}
              handleChangeText={(e) => setDigit2(e)}
              // otherStyles="mt-7 mb-7"
            />

            <FormFieldSmall
              
              value={digit3}
              maxLength={1}
              handleChangeText={(e) => setDigit3(e)}
              // otherStyles="mt-7 mb-7"
            />

            <FormFieldSmall
              
              value={digit4}
              maxLength={1}
              handleChangeText={(e) => setDigit4(e)}
              // otherStyles="mt-7 mb-7"
            />

          </View>
          
          <CustomButton
            title="Verify"
            otherStyles="mt-7"
            onPress={handleVerify}
            isLoading={isSubmitting}
            handlePress={() => navigation.navigate('verified')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Verification