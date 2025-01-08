import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/clerk-expo';
import Colors from '@/constants/Colors';
import AppointmentList from '@/components/barber/AppointmentList';
import Drawer from 'expo-router/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

export default function Page() {
  const [appointments, setAppointments] = useState<any>([]);
  const { user } = useUser();
  const phoneNumbser = user?.primaryPhoneNumber?.phoneNumber;
  const [flag, setFlag] = useState(false);
  
  const refreshToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Page Refresh Successfully ✔️ ✔️'
    })
  }

  const changeFlag = () => {
    setFlag(!flag);
    refreshToast();
  }

  useEffect(() => {
    async function getAppointment() {
      try{
        const { data } = await supabase.from('appointments').select('*').eq('barberPhone', phoneNumbser).eq("status", 'done');
        setAppointments(data);
      } catch(err) {
        Alert.alert("Something went wrong...");
      }
    }
    getAppointment();
  }, [flag]);

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['rgba(46,47,47,255)', 'rgba(2,2,2,255)']}
        style={styles.background}
      />
      <Drawer.Screen 
        options={{
          headerRight: () => (
            <TouchableOpacity style={{paddingRight: 20}} onPress={changeFlag}>
              <MaterialCommunityIcons name="refresh" size={29} color={Colors.orange100} />
            </TouchableOpacity>
          )
        }}
      />
      <View style={{paddingTop: 20}}/>
      {appointments.length <= 0 ? (
        <View style={{alignItems: 'center', justifyContent: 'center', height: '90%'}}>
          <Text style={{color: Colors.blue, fontSize: 23, fontFamily: 'park-m'}}>No Completed Appointment.</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (<AppointmentList {...item}/>)}
        />
      )}
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary500
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%'
  }
});