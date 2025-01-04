import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import { icons } from "../constants";

const FormFieldSmall = ({
  
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  maxLength,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    //  <View className={`${otherStyles}`}>
    //     <Text className="text-base text-gray-100 font-pmedium">{title}</Text> 

      <View className="w-1/5 h-16 px-7 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-green-500 flex flex-row items-center">
        <TextInput
          className="w-full flex-1 text-white font-psemibold number-base justify-content-center text-center"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          keyboardType="number-pad"
          maxLength={1}

          
        />

        
      </View>
    //  </View>
  );
};

export default FormFieldSmall;