import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const UserProfile = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('Chamudrasri');
  const [lastName, setLastName] = useState('Sriwarnasinghe');
  const [contactNumber, setContactNumber] = useState('0768858819');
  const [country, setCountry] = useState('Sri Lanka');
  const [company, setCompany] = useState('ElectraFind');
  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // const handleUpdate = () => {
  //   Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
  // };

  const handleUpdate = () => {
    navigation.navigate('index', {
      updatedFirstName: firstName,
      updatedLastName: lastName,
      updatedProfileImage: profileImage
    });
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Edit Profile</Text>

      <View style={{flexDirection: "row", justifyContent: "center", marginBottom: 30 }}>
          <View style={{ position: "relative" }}>
            <Image
              source={{
               uri: profileImage || "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
              }}
              style={{ width: 90, height: 90, borderRadius: 100 }}
            />

            <TouchableOpacity
                    style={{
                      position: "absolute",
                      bottom: 5,
                      right: 0,
                      width: 30,
                      height: 30,
                      backgroundColor: "#D3EDDE",
                      borderRadius: 100,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={pickImage}
                  >
                    <Ionicons name="camera-outline" size={25} />
            </TouchableOpacity>

          </View>
        </View>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        style={styles.input}
        value={contactNumber}
        keyboardType="phone-pad"
        onChangeText={setContactNumber}
      />

      <Text style={styles.label}>Country</Text>
      <TextInput
        style={styles.input}
        value={country}
        onChangeText={setCountry}
      />

      <Text style={styles.label}>Company</Text>
      <TextInput
        style={styles.input}
        value={company}
        onChangeText={setCompany}
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    marginTop: 30,
  },

  backButton: {
    position: 'absolute',
    top: 45,
    left: 15,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 40,
    color: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 0,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#D3EDDE',
  },
  picker: {
    height: 100,
    marginBottom: 100,
  },
  updateButton: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default UserProfile;
