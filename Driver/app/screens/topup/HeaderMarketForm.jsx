import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { images } from '../../../constants'


export default function HeaderMarketForm() {
  return (
    
      <View  style={styles.container}>
        <Image 
            source={images.logoverticalshort}
            style={{width:250,height:70,objectFit:'contain',marginTop:0}}
          />
        
      </View>
    
  )
}

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  
})