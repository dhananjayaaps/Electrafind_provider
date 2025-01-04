import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image } from 'react-native';
import { Link } from 'expo-router';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {images} from '../../constants';
import CustomButton from '../../components/CustomButton';
import React from 'react';
import { useNavigation } from 'expo-router';

const Verified = () =>
 {

  const navigation = useNavigation();

  return (
    <SafeAreaView className = "bg-primary h-full" >
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">

          <Image source={images.verified} className="max-w-[480px] w-full h-[400px]" resizeMode="contain"/>

          {/* <Image source={images.cards} className="max-w-[380px] w-full h-[300px]" resizeMode="contain"/> */}

          <View className="relative mt-5"> 
            <Text className="text-3xl text-white font-bold text-center">Verified!
            </Text>
          </View>

          {/* <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">Where creativity meets innovation: embark on a journey of limitless exploration with Electrafind</Text> */}

          <CustomButton
            title="Get electrified!"
            handlePress={() => router.push('map')}     
            containerStyles="w-full mt-20"    
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor='#161622' style='light' />

    </SafeAreaView>

  );
};

export default Verified;