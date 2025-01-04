import { ActivityIndicator, Text, TouchableOpacity,Image } from "react-native";
import { FontAwesome } from '@expo/vector-icons';



const GotoPageButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  
  

  
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={` min-h-[40px] max-w-[400px] flex flex-row justify-center mr-5 ml-5 mt-2 items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      style={{ borderRadius: 20, borderColor: "#161622", borderWidth: 2 }}
      disabled={isLoading}
    >


      <Text className={`text-primary font-psemibold text-xl ${textStyles} `}>
        {title}
      </Text>
      
      {/* <FontAwesome name="location-arrow" size={28} color="#000000"/> */}

      

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