import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState, useCallback }  from 'react'
import { TouchableOpacity, View, StyleSheet, Image } from 'react-native'

const navItems = [
    { id: '1', name: 'Home', icon: require('../assets/Home.png'), route: 'Home' },
    { id: '2', name: 'Location', icon: require('../assets/location.png'), route: 'Location' },
    { id: '3', name: 'Charging', icon: require('../assets/battery.png'), route: 'Charging' },
    { id: '4', name: 'Repair', icon: require('../assets/settings.png'), route: 'Repair' },
    { id: '5', name: 'Earnings', icon: require('../assets/pie-chart.png'), route: 'Earnings' },
];


export default function Navbar() {

    const navigation = useNavigation();
    const [activeRoute, setActiveRoute] = useState('Home');

    useFocusEffect(
        useCallback(() => {
            const unsubscribe = navigation.addListener('state', (e) => {
                const currentRoute = e.data.state.routes[e.data.state.index].name;
                console.log('Current Route:', currentRoute); // Debugging
                setActiveRoute(currentRoute);
            });
            return unsubscribe;
        }, [navigation])
    );
  return (
    <View style = {style.navbar}>
        {navItems.map(item =>(
            <TouchableOpacity
            key={item.id}
            style={style.navItem}
            onPress={() => navigation.navigate(item.route)}
            >
                <Image source={item.icon} style={style.navIcon} />
                {activeRoute === item.route && <View style={style.underline} />}
            </TouchableOpacity>
        ))}

    </View>
  )
}

const style = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#08A045',
        paddingVertical: 10,
        width: '100%',
        height:'10%',
        top:4,
        borderTopRightRadius:20,
        borderTopLeftRadius:20,
    },
    navItem: {
        alignItems: 'center',
        top:10,
        position: 'relative',
    },
 
    underline: {
        height: 3,
        width: 40,
        backgroundColor: 'yellow', // Change to a bright color for testing
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: [{ translateX: -20 }], // Adjusted for centering
    },
})
