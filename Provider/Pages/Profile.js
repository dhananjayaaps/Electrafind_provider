import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

export default function Profile() {
  const navigation = useNavigation();

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`${API_URL}/stations/mystation`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`,  // Add API key to request headers if needed
            },
        });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
      setUpdatedProfile(data);
      setImage(data.ImageUrl);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      let uploadedImageUrl = image;

      if (image !== profile.ImageUrl) {
        const formData = new FormData();
        formData.append('file', {
          uri: image,
          type: 'image/jpeg',
          name: 'profile_image.jpg',
        });

        const imageUploadResponse = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        if (!imageUploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const imageUploadData = await imageUploadResponse.json();
        uploadedImageUrl = imageUploadData.url;
      }

      const payload = {
        Name: updatedProfile.Name,
        AvailableStartTime: updatedProfile.AvailableStartTime,
        AvailableEndTime: updatedProfile.AvailableEndTime,
        Latitude: updatedProfile.Latitude,
        Longitude: updatedProfile.Longitude,
        ImageUrl: uploadedImageUrl,
      };

      const response = await fetch(`${API_URL}/stations/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer YOUR_TOKEN_HERE',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      Alert.alert('Success', 'Profile updated successfully!');
      setProfile({ ...profile, ...payload });
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <TouchableOpacity onPress={handleImagePick}>
        <Image
          source={{ uri: image }}
          style={styles.profileImage}
        />
        <Text style={styles.changePhotoText}>Change Photo</Text>
      </TouchableOpacity>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={profile.Email} editable={false} />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={updatedProfile.Name}
          onChangeText={(text) =>
            setUpdatedProfile((prev) => ({ ...prev, Name: text }))
          }
          editable={isEditing}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Available Start Time</Text>
        <TextInput
          style={styles.input}
          value={updatedProfile.AvailableStartTime}
          onChangeText={(text) =>
            setUpdatedProfile((prev) => ({ ...prev, AvailableStartTime: text }))
          }
          editable={isEditing}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Available End Time</Text>
        <TextInput
          style={styles.input}
          value={updatedProfile.AvailableEndTime}
          onChangeText={(text) =>
            setUpdatedProfile((prev) => ({ ...prev, AvailableEndTime: text }))
          }
          editable={isEditing}
        />
      </View>

      <MapView
        style={styles.map}
        region={{
          latitude: updatedProfile.Latitude || 6.9271,
          longitude: updatedProfile.Longitude || 79.8612,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={(e) => {
          if (isEditing) {
            setUpdatedProfile((prev) => ({
              ...prev,
              Latitude: e.nativeEvent.coordinate.latitude,
              Longitude: e.nativeEvent.coordinate.longitude,
            }));
          }
        }}
      >
        <Marker
          coordinate={{
            latitude: updatedProfile.Latitude || 6.9271,
            longitude: updatedProfile.Longitude || 79.8612,
          }}
        />
      </MapView>

      {isEditing ? (
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#110F0F',
    flexGrow: 1,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  profileImage: {
    height: 150,
    width: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 15,
  },
  changePhotoText: {
    textAlign: 'center',
    color: '#aaa',
    marginBottom: 15,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  map: {
    height: 200,
    borderRadius: 8,
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#3a8dff',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff3a3a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#110F0F',
  },
  loadingText: {
    color: '#fff',
    fontSize: 20,
  },
});
