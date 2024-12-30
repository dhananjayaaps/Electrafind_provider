import React, { useState } from 'react'
import { View, StyleSheet,Text, TextInput, Image} from 'react-native'

export default function InputFields({label, placeholder, fontSize = 16}) {
    const[inputValue, setInputValue] = useState('');
  return (
   <View style={styles.inputContainer}>
      {label ? <Text style={[styles.label, { fontSize }]}>{label}</Text> : null}
    <View style={styles.inputWrapper}>
    <TextInput
    style={[styles.input]}
     //keyboardType={keyboardType}
    placeholder={placeholder}
    placeholderTextColor="#000"
    value={inputValue}
    onChangeText={setInputValue}
    />

    {inputValue ?(
        <View style={styles.checkContainer}>
        <Image source={require('../assets/check.png')} style={styles.check} />
        </View>
    ) : null}

    </View>
    </View>

  )
}

const styles = StyleSheet.create({
    check: {
        width: 25,
        height: 25,
        marginLeft: 10,
        left:-5
    },
    inputContainer: {
        marginBottom: 20,
        
    },
    label: {
        color: '#fff',
        marginBottom: 5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ADF2CB',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        width:'65%',
        left: 55,
    },
    input: {
        flex: 1,
        color: '#000',
        
    },

    checkContainer: {
        width: 20,
        height: 20,
        borderRadius:2,
        backgroundColor: '#00A947',
        alignItems: 'center',
        justifyContent: 'center',
    }
})
