import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '@/constants/Colors';
import { TimePicker } from '@/components/customers/TimePicker';
import LocationPicker from '@/components/barber/LocationPicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/clerk-expo';
import Drawer from 'expo-router/drawer';
import { LinearGradient } from 'expo-linear-gradient';

export default function Settings() {
  const [barberDetails, setBarberDetails] = useState<any>();
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const { user } = useUser();
  const phoneNumbser = user?.primaryPhoneNumber?.phoneNumber;

  const saveToast = () => {
    Toast.show({
      type: 'success',
      text1: "Information Saved Successfully ✅"
    })
  }

  useEffect(() => {
    async function getData() {
      try {
        const { data } = await supabase.from('barbers').select('*').eq('phone', phoneNumbser).single();
        if(data) {
          setName(data.name);
          setShopName(data.shopName);
          setOpeningTime(data.openTime);
          setClosingTime(data.closingTime);
          setLatitude(data.location.lat);
          setLongitude(data.location.lgt);
        }
      } catch (err) {
        Alert.alert("Something went wrong while fetching the barber data");
      }
    }
    getData();
  }, [])

  const openingTimeHandler = (time: Date) => {
    const times = time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    setOpeningTime(times);
  }
  const closingTimeHandler = (time: Date) => {
    const times = time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    setClosingTime(times);
  }
  const locationHandler = (x: number, y: number) => {
    setLatitude(x);
    setLongitude(y);
  }

  const saveHandler = async () => {
    try {
      const { data } = await supabase.from('barbers').update({
        name: name,
        shopName: shopName,
        openTime: openingTime,
        closingTime: closingTime,
        location: {
          lat: latitude,
          lgt: longitude
        }
      }).eq('phone', phoneNumbser).select();
      saveToast();
    } catch (err) {
      Alert.alert("something went wrong while saving the information.")
    }
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['rgba(46,47,47,255)', 'rgba(2,2,2,255)']}
        style={styles.background}
      />
      <Drawer.Screen options={{
        headerRight: () => (
          <TouchableOpacity style={{paddingRight: 20}} onPress={saveHandler}>
            <MaterialCommunityIcons name="content-save-check" size={28} color={Colors.orange100} />
          </TouchableOpacity>
        )
      }}/>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput 
          placeholder=' Enter Your Name'
          placeholderTextColor={Colors.whiteFade}
          cursorColor={Colors.orange100}
          keyboardType='default'
          value={name}
          onChangeText={setName}
          style={styles.input}
          />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>ShopName</Text>
        <TextInput 
          placeholder=' Enter Your ShopName'
          placeholderTextColor={Colors.whiteFade}
          cursorColor={Colors.orange100}
          keyboardType='default'
          value={shopName}
          onChangeText={setShopName}
          style={styles.input}
          />
      </View>
      <View style={[styles.inputContainer, {gap: 5}]}>
        <Text style={styles.label}>Opening Time</Text>
        <TimePicker onPress={openingTimeHandler} myTime={openingTime}/>
      </View>
      <View style={[styles.inputContainer, {gap: 5}]}>
        <Text style={styles.label}>Closing Time</Text>
        <TimePicker onPress={closingTimeHandler} myTime={closingTime}/>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Location</Text>
        <LocationPicker onPress={locationHandler} lat={latitude} lgt={longitude}/>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  inputContainer: {
    padding: 12
  },
  input: {
    borderColor: Colors.white200,
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 9,
    borderRadius: 8,
    fontSize: 20,
    fontFamily: 'park-r',
    color: Colors.white100
  },
  label: {
    fontSize: 19,
    fontFamily: 'park-m',
    color: Colors.white100
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%'
  }
});