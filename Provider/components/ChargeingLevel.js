import React, { useState } from 'react'
import { TouchableOpacity, View, StyleSheet, Text} from 'react-native'

export default function ChargeingLevel({level}) {
    const [isAvailable, setIsAvailable] = useState(null);

    const handlePress = (status) => {
        setIsAvailable(status);
    }
  return (
    <View style={styles.level}>
            <Text style={styles.levelText}>{level}</Text>
            <View style={styles.buttonContainer}>
                {/* Available Button */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        isAvailable === true && styles.availableButton, // Green background if selected
                    ]}
                    onPress={() => handlePress(true)}
                >
                    <Text style={styles.buttonText}>AVAILABLE</Text>
                </TouchableOpacity>

                {/* Not Available Button */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        isAvailable === false && styles.notAvailableButton, // Red background if selected
                    ]}
                    onPress={() => handlePress(false)}
                >
                    <Text style={styles.buttonText}>NOT AVAILABLE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
  
}

const styles = StyleSheet.create({
    level: {
        alignItems: 'center',
        marginVertical: 20,
    },
    levelText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        backgroundColor: 'grey',
        height: 50,
        //width:190,
        borderRadius: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginHorizontal: 5,
        height: 40,
        //width:80,
        top:4
    },
    availableButton: {
        backgroundColor: '#00A848', // Green for Available
    },
    notAvailableButton: {
        backgroundColor: '#E6323A', // Red for Not Available
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        //fontSize:7
        
    },
})
