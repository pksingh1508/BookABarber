import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import * as Location from 'expo-location';

import Colors from '@/constants/Colors';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

interface LocationPickerProps {
    onPress: (x: number, y: number) => void;
    lat: number;
    lgt: number;
}

export default function LocationPicker({onPress, lat, lgt}: LocationPickerProps) {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);

    const getLocationHandler = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        onPress(location.coords.latitude, location.coords.longitude);
    }

  return (
    <View style={styles.container}>
      <Text style={styles.locationText}>Co-ordinate : {location ? location.coords.latitude : lat}  {location ? location.coords.longitude : lgt}</Text>
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={getLocationHandler} style={styles.btn}>
            <MaterialIcons name="location-pin" size={24} color="black" />
            <Text style={{fontSize: 16}}>Use Current Location</Text>
        </TouchableOpacity>
        {/* TODO: Choose Location using the map.*/}
        {/* <TouchableOpacity style={styles.btn}>
            <FontAwesome5 name="map-marked-alt" size={22} color="black" />
            <Text style={{fontSize: 16}}>Pick on Map</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 15,
        borderRadius: 10,
        gap: 15
    },
    btnContainer: {
        flexDirection: 'row',
        gap: 4,
        justifyContent: 'space-around',
        width: '100%'
    },
    btn: {
        flexDirection: 'row',
        gap: 2,
        backgroundColor: Colors.orange100,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 9
    }, 
    locationText: {
        fontSize: 18,
        fontFamily: 'park-m',
        color: Colors.white100
    }
});