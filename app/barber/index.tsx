import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/clerk-expo';
import SingleAppointment from '@/components/barber/SingleAppointment';
import Colors from '@/constants/Colors';
import Drawer from 'expo-router/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

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
        const { data } = await supabase.from('appointments').select('*').eq('barberPhone', phoneNumbser).eq("status", 'pending');
        setAppointments(data);
      } catch(err) {
        Alert.alert("Something went wrong...");
      }
    }
    getAppointment();
  }, [flag]);

  return (
    <View style={styles.container}>
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
          <Text style={{color: Colors.orange100, fontSize: 23, fontFamily: 'park-m'}}>No Appointments Today.</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (<SingleAppointment {...item} onPress={changeFlag}/>)}
        />
      )}
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary500
  }
});