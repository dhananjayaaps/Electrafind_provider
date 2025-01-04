import { ActivityIndicator, Text, TouchableOpacity,Image } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';


const GotoPageButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  
  

  
}) => {

  const handleButtonPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handlePress();
  };

  return (
    <TouchableOpacity
      onPress={handleButtonPress}
      activeOpacity={0.7}
      className={` min-h-[50px] min-w-[60px] flex flex-row justify-center margin-10 mr-2 items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      style={{ backgroundColor: "#161622", borderRadius: 10, borderColor: "#ffffff", borderWidth: 1 }}
      disabled={isLoading}
    >


      <Text className={`text-white font-psemibold text-xl ${textStyles}`}>
        {title}
      </Text>
      
      <FontAwesome name="location-arrow" size={25} color="#ffffff"/>

      

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

export default GotoPageButton;