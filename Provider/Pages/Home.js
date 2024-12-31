import React from 'react'
import { TouchableOpacity, View,  StyleSheet, Image, Text, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native';

const data = [
    { id: '1', name: 'HOME', icon: require('../assets/Home.png') },
    { id: '2', name: 'LOCATION', icon: require('../assets/location.png') },
    { id: '3', name: 'CHARGINGS', icon: require('../assets/battery.png') },
    { id: '4', name: 'REPAIR', icon: require('../assets/settings.png') },
    { id: '5', name: 'EARNINGS', icon: require('../assets/pie-chart.png') },
]
export default function Home() {

  const navigation = useNavigation();

    const handleUser = () => {
         console.log('User clicked');
    }

    const handleNavigation = (item) => {
      if(item.name === 'HOME'){
        navigation.navigate('Home1');
      }else if(item.name === 'CHARGINGS'){
        navigation.navigate('Charging');
      }
      else if(item.name === 'LOCATION'){
        navigation.navigate('allsessions');
      }
      else if(item.name === 'EARNINGS'){
        navigation.navigate('Earnings');
      }
      else{
        console.log(`${item.name} pressed`);
      }
    }

    const renderItem = ({ item }) =>(
        <TouchableOpacity style={styles.button} onPress ={() => handleNavigation(item)}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.buttonText}>{item.name}</Text>

        </TouchableOpacity>
    )

  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity style={styles.users} onPress ={handleUser}>
            <Image source={require('../assets/user 1.png')} style={styles.user}/>
       </TouchableOpacity>

       <Text style={styles.text}>Hi, Welcome back!</Text>
        </View>
      

     <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.buttonList}
     />

    </View>
  )
}

const styles = StyleSheet.create({

    container:{
        flex: 1,
        backgroundColor: '#110F0F',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 50,  
        marginBottom: 30,  
      },

    user:{
        width: 50,
        height: 50,
        borderRadius: 25,  
        marginBottom: 10,
        left:150
    },

    text:{
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: 'bold',
        left:-60
      
    },

    buttonList: {
        flexGrow: 1,
        justifyContent: 'center',  
      },

    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#08A045',  
        padding: 20,
        marginBottom: 25,
        borderRadius: 10,
        width:300,
        top:-50
      },

      icon: {
        width: 24,  
        height: 24,
        marginRight: 10,
        left:40
      },

      buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        left:60
      },
  
})
