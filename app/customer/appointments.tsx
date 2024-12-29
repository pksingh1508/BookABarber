import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '@/constants/Colors';
import { useUser } from '@clerk/clerk-expo';
import { supabase } from '@/lib/supabase';
import UserAppointment from '@/components/customers/UserAppointment';
import Drawer from 'expo-router/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export default function Appointments() {
  const { user } = useUser();
  const phoneNumbser = user?.primaryPhoneNumber?.phoneNumber;
  const [res, setRes] = useState<any>([]);
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
    async function getData() {
      try {
        const {data} = await supabase.from('appointments').select('*').eq('customerPhone', phoneNumbser);
        setRes(data);
      } catch(err) {
        Alert.alert("Something went wrong...");
      }
    } 
    getData();
  },[flag])

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
      {res.length <= 0 ? (
        <View style={{alignItems: 'center', justifyContent: 'center', height: '90%'}}>
          <Text style={{color: Colors.orange100, fontSize: 23, fontFamily: 'park-m'}}>No Appointments.</Text>
        </View>
      ) : (
        <FlatList 
          data={res}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (<UserAppointment {...item} onPress={changeFlag}/>)}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary500,
    paddingTop: 25
  }
});