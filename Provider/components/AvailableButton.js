import React, { useState } from 'react'
import { TouchableOpacity, View, Text, StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

export default function AvailableButton() {
    const[isEnabled, setIsEnabled] = useState(false);

    const toggleButton = () => {
        setIsEnabled((prev) => !prev);
    };

  return (
    <View style={styles.container}>
          

            {/* Button to toggle the enabled state with vector icon */}
            <TouchableOpacity style={styles.toggleButton} onPress={toggleButton}>
                <Icon
                    name={isEnabled ? 'toggle-on' : 'toggle-off'} // Toggle between icons
                    size={40}
                    color={isEnabled ? '#00A848' : '#cccccc'}
                />
                {/*<Text style={styles.buttonText}>
                    {isEnabled ? 'Available' : 'Not Available'}
                </Text>*/}
            </TouchableOpacity>
        </View>
  )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 20,
        
    },
    buttonEnabled: {
        backgroundColor: '#00A848', // Green color when enabled
    },
    buttonDisabled: {
        backgroundColor: 'red', 
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#110F0F',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: 200
    },
})
