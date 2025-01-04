import { ActivityIndicator, Text, TouchableOpacity,Image } from "react-native";


const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  imageSrc,
  onPress

  
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`bg-green-500 rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >

      <Image source={imageSrc}
        style={{width: 20, height: 30, marginRight: 10}}
      />
      <Text className={`text-primary font-psemibold text-xl ${textStyles}`}>
        {title}
      </Text>

      

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;