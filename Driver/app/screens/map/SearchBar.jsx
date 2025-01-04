import { View, Text, style ,TextInput, TouchableOpacity} from 'react-native'
import React,  { useRef, useState } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useFonts } from 'expo-font';
import { StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function SearchBar({searchedLocation, onFocus}) {

  let [fontsLoaded, fontError] = useFonts({
    'psemibold': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
  });

  const searchRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{
      flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c2c2c2',
    borderRadius: 40,
    padding: 10,
    width: '90%',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    }}>
      
      {/* <IonIcons name="location-sharp" size={24} color="#000000" style={{paddingTop:10}}/> */}

      <GooglePlacesAutocomplete
        placeholder='Search EV charging station'
        textInputProps={{ placeholderTextColor: '#d9d9d9' }}
        fetchDetails={true}
        
        enablePoweredByContainer={false}
        autoFocus={true}
        onFocus={() => {
          searchRef.current?.focus();
          onFocus && onFocus();
        }}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true 
          searchedLocation(details?.geometry?.location);
        }}
        query={{
          key: 'AIzaSyDTYD4DNXMdQCRcjy0-ePWn5OpM0Ggki54',
          language: 'en',
        }}
        styles={{
          textInput: styles.textInput,
          
         
          container: {
            flex: 1,
            zIndex: 10000,
            backgroundColor: '#333333',
          },
          placeholder: {
            color: '#d9d9d9',
            fontFamily: 'psemibold', 
          },
          description: {
            color: '#333333',
            
            
          },
          listView: { backgroundColor: '#333333',borderWidth:2,borderColor:'#333333', borderRadius: 30, },
        }}
      />

      <TouchableOpacity style={styles.searchButton} onPress={() => searchedLocation(searchQuery)}>
        <Ionicons name="search" size={24} color="#ffffff" />
      </TouchableOpacity>
      {searchQuery.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery('')}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({

  textInput: {
    flex: 1,
    paddingHorizontal: 15,
    color: '#ffffff',
    backgroundColor: '#333333',
    
  },
  searchButton: {
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 5,
    marginLeft: 5,
  },
  clearButton: {
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 5,
    marginLeft: 5,
    position: 'absolute',
  },
})