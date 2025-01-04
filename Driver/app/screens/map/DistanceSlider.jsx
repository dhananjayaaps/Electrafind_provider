import { View, Text } from 'react-native'
import React from 'react'
import Slider from '@react-native-community/slider'
import { useState } from 'react'

export default function DistanceSlider() {

  const [distance, setDistance] = useState(0);

  return (
    <View style={{padding:10, width:'100%'}}>
      <Text style={{ textAlign: "center", color:"#ffffff"}}>Distance: KM</Text>
      <Slider
        style={{width: '100%', height: 25}}
        value={distance}
        minimumValue={0}
        maximumValue={50}
        minimumTrackTintColor="#00A848"
        maximumTrackTintColor="white"
        thumbTintColor='#00A848'
        onValueChange={(value) => setDistance(value)}
        step={1}
        allowTouchTrack 
        thumbStyle={{ height: 20, width: 20, backgroundColor: 'black' }}

      />
    </View>
  )
}