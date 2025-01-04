import { Text, View, Image} from 'react-native'
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from 'react'
import { ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native'
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useRouter, useEffect } from "react";
import axios from "axios";
import { router } from "expo-router";
import Header from '../../screens/charge/Header'
import { StyleSheet } from 'react-native';
import { useClerk,useSignOut,useUser } from "@clerk/clerk-expo";
import { useNavigation } from 'expo-router'
import {useRoute } from '@react-navigation/native';

const TopupScreen = () => {

  const navigation = useNavigation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [image, setImage] = useState(null);
  const [loader, setLoader] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const route = useRoute();
  const [profileImage, setProfileImage] = useState(route.params?.updatedProfileImage || 'default-image-url');
  const [username, setUsername] = useState(route.params?.updatedFirstName || 'defaultUser');
  

  // const pickImage = async () => {
  //   try {
  //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (status !== 'granted') {
  //       alert('Sorry, we need camera roll permissions to make this work!');
  //       return;
  //     }
  
  //     let result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 1,
  //     });
  
  //     console.log("Image Picker Result:", result);
  
  //     if (!result.canceled && result.assets && result.assets.length > 0) {
  //       const imageUri = result.assets[0].uri;
  
  //       console.log("Image URI:", imageUri);
  
  //       if (imageUri) {
  //         setLoader(true);
  //         const base64 = await FileSystem.readAsStringAsync(imageUri, {
  //           encoding: FileSystem.EncodingType.Base64,
  //         });
  //         const base64Image = `data:image/jpeg;base64,${base64}`;
  //         setImage(base64Image);
  
  //         const accessToken = await AsyncStorage.getItem("access_token");
  //         const refreshToken = await AsyncStorage.getItem("refresh_token");
  
  //         const response = await axios.put(
  //           `${SERVER_URI}/update-user-avatar`,
  //           {
  //             avatar: base64Image,
  //           },
  //           {
  //             headers: {
  //               "access-token": accessToken,
  //               "refresh-token": refreshToken,
  //             },
  //           }
  //         );
  
  //         if (response.data) {
  //           setRefetch(true);
  //         }
  //       } else {
  //         alert("Error obtaining image URI.");
  //       }
  //     } else {
  //       alert("Image selection was canceled or no image was selected.");
  //     }
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //     alert("Failed to upload image. Please try again.");
  //   } finally {
  //     setLoader(false);
  //   }
  // };
  

  //logout function
  const logoutHandler = async () => {
    await signOut();
    router.push("sign-in");
    // Navigate to the login screen or perform any other logout actions
  };

  useEffect(() => {
    if (route.params?.updatedProfileImage) {
      setProfileImage(route.params.updatedProfileImage);
    }
    if (route.params?.updatedFirstName) {
      setUsername(route.params.updatedFirstName);
    }
  }, [route.params]);


  return (

    <LinearGradient colors={["#E5ECF9", "#F6F7F9"]} style={{ flex: 1, paddingTop: 80 }}>
      <ScrollView>

        <View style={{alignItems:"center", justifyContent: "center" }}>
          <View 
          style={{
            width: 120, // Slightly larger than the image
            height: 120, // Slightly larger than the image
            borderRadius: 60, // Half of the width/height to make it a circle
            borderWidth: 3, // Thickness of the green circle
            borderColor: "black", // Green circle
            justifyContent: "center", 
            alignItems: "center", 
          }}>
              <TouchableOpacity onPress={() => navigation.navigate('userProfile')}>
            <Image
                source={{ uri: profileImage || "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png" }}
                style={{ width: 110, height: 110, borderRadius: 100 }}
              />
              </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text
                style={{
                  textAlign: "center",
                  fontSize: 25,
                  paddingTop: 10,
                  fontWeight: "600",
                }}
              >
                {username}
          </Text>
        </View>

       
        <View style={{ marginHorizontal: 16, marginTop: 30 }}>
              <Text
                style={{
                  fontSize: 20,
                  marginBottom: 16,
                  
                }}

                className="text-2xl font-pbold"
              >
                Account Details
              </Text>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}

                onPress={() => navigation.navigate('userProfile')}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 30,
                  }}
                >
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: "#dde2ec",
                      padding: 15,
                      borderRadius: 100,
                      width: 55,
                      height: 55,
                    }}
                  >
                    <FontAwesome
                      style={{ alignSelf: "center" }}
                      name="user-o"
                      size={20}
                      color={"black"}
                    />
                  </View>
                  <View>
                    <Text
                      style={{ fontSize: 16}} className="font-psemibold"
                    >
                      Detail Profile
                    </Text>
                    <Text
                      style={{
                        color: "#575757",
                        
                      }}
                      className="font-pregular"
                    >
                      Information Account
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('userProfile')}>
                  <AntDesign name="right" size={26} color={"#CBD5E0"} />
                </TouchableOpacity>
              </TouchableOpacity>

                      {/* vehicle details */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}

                onPress={() => navigation.navigate('carProfile')}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 30,
                  }}
                >
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: "#dde2ec",
                      padding: 15,
                      borderRadius: 100,
                      width: 55,
                      height: 55,
                    }}
                  >
                    <FontAwesome
                      style={{ alignSelf: "center" }}
                      name="car"
                      size={20}
                      color={"black"}
                    />
                  </View>
                  <View>
                    <Text
                      style={{ fontSize: 16}} className="font-psemibold"
                    >
                      Vehicle Profile
                    </Text>
                    <Text
                      style={{
                        color: "#575757",
                        
                      }}
                      className="font-pregular"
                    >
                      Details of your EV
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('userProfile')}>
                  <AntDesign name="right" size={26} color={"#CBD5E0"} />
                </TouchableOpacity>
              </TouchableOpacity>

                      {/* elecreafind home */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
                // onPress={() => router.push("/(routes)/enrolled-courses")}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 30,
                  }}
                >
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: "#dde2ec",
                      padding: 15,
                      borderRadius: 100,
                      width: 55,
                      height: 55,
                    }}
                  >
                    <MaterialCommunityIcons
                      style={{ alignSelf: "center" }}
                      name="home"
                      size={20}
                      color={"black"}
                    />
                  </View>
                  <View>
                    <Text
                      style={{ fontSize: 16}} className="font-psemibold"
                    >
                      ElectraFind Home
                    </Text>
                    <Text
                      style={{
                        color: "#575757",
                        
                      }}
                      className="font-pregular"
                    >
                      Join to our network
                    </Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <AntDesign name="right" size={26} color={"#CBD5E0"} />
                </TouchableOpacity>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
                onPress={() => navigation.navigate('wallet')}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 30,
                  }}
                >
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: "#dde2ec",
                      padding: 15,
                      borderRadius: 100,
                      width: 55,
                      height: 55,
                    }}
                  >
                    <FontAwesome
                      style={{ alignSelf: "center" }}
                      name="money"
                      size={20}
                      color={"black"}
                    />
                  </View>
                  <View>
                    <Text
                      style={{ fontSize: 16}} className="font-psemibold"
                    >
                      Wallet
                    </Text>
                    <Text
                      style={{
                        color: "#575757",
                        
                      }}
                      className="font-pregular"
                    >
                      Top up
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('wallet')}>
                  <AntDesign name="right" size={26} color={"#CBD5E0"} />
                </TouchableOpacity>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}

                onPress={() => navigation.navigate('marketPlace')}
                
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 30,
                  }}
                >
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: "#dde2ec",
                      padding: 15,
                      borderRadius: 100,
                      width: 55,
                      height: 55,
                    }}
                  >
                    <MaterialCommunityIcons
                      style={{ alignSelf: "center" }}
                      name="handshake"
                      size={20}
                      color={"black"}
                    />
                  </View>
                  <View>
                    <Text
                      style={{ fontSize: 16}} className="font-psemibold"
                    >
                      Market Place
                    </Text>
                    <Text
                      style={{
                        color: "#575757",
                        
                      }}
                      className="font-pregular"
                    >
                      Sell your vehicle and vehicle parts
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('marketPlace')}>
                  <AntDesign name="right" size={26} color={"#CBD5E0"} />
                </TouchableOpacity>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}

                onPress={() => navigation.navigate('garagePlace')}
                
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 30,
                  }}
                >
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: "#dde2ec",
                      padding: 15,
                      borderRadius: 100,
                      width: 55,
                      height: 55,
                    }}
                  >
                    <MaterialCommunityIcons
                      style={{ alignSelf: "center" }}
                      name="garage"
                      size={20}
                      color={"black"}
                    />
                  </View>
                  <View>
                    <Text
                      style={{ fontSize: 16}} className="font-psemibold"
                    >
                      Service Stations & Mechanics
                    </Text>
                    <Text
                      style={{
                        color: "#575757",
                        
                      }}
                      className="font-pregular"
                    >
                      Display your ev related business
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('garagePlace')}>
                  <AntDesign name="right" size={26} color={"#CBD5E0"} />
                </TouchableOpacity>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
                onPress={() => logoutHandler()}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 30,
                  }}
                >
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: "#dde2ec",
                      padding: 15,
                      borderRadius: 100,
                      width: 55,
                      height: 55,
                    }}
                  >
                    <Ionicons
                      style={{ alignSelf: "center" }}
                      name="log-out-outline"
                      size={20}
                      color={"black"}
                    />
                  </View>
                  <TouchableOpacity onPress={() => logoutHandler()}> 
                   
                    <Text
                      style={{ fontSize: 16 }}
                      className="font-psemibold"
                    >
                      Log Out
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity>
                  <AntDesign name="right" size={26} color={"#CBD5E0"} />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>

      </ScrollView>

    </LinearGradient>
  )
}

export default TopupScreen

const styles = StyleSheet.create({
  headerContainer:{
    position: 'realtive',
    zIndex: 10,
    padding: 10,
    width: '100%',
    paddingHorizontal: 10,
    height: '15%',
    backgroundColor: '#161622',
    marginBottom:20
    
  },
 
})