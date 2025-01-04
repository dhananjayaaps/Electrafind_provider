import { View, Text, Image, StyleSheet, } from 'react-native'
import React from 'react'

export default function Header() {

  return (
    <View  style={styles.container}>
      <Text style={{color: 'black', fontSize: 25, fontWeight: 'bold'}}>CHARGE YOUR EV</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  }
})
