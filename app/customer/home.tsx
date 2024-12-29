import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '@/constants/Colors';
import Drawer from 'expo-router/drawer';
import {services} from '@/assets/data/services';
import SingleService from '@/components/customers/SingleService';
import { useUser } from '@clerk/clerk-expo';
import { supabase } from '@/lib/supabase';

export default function Page() {
  const [userName, setUserName] = useState('');
  const { user } = useUser();
  const phoneNumbser = user?.primaryPhoneNumber?.phoneNumber;

  useEffect(() => {
    async function getUserName() {
      const {data} = await supabase.from('customers').select('name').eq('phone', phoneNumbser).single();
      if(!data?.name) {
        setUserName('Buddy');
      } else {
        setUserName(data?.name);
      }
    }
    getUserName();
  },[])

  return (
    <View style={styles.container}>
      <Drawer.Screen options={{title: `Hi, ${userName}`}}/>
      <Text style={styles.serviceText}>Choose Any Services...</Text>
      <FlatList 
        data={services}
        renderItem={({item}) => (<SingleService {...item}/>)}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary500,
    paddingBottom: 15
  }, 
  serviceText: {
    fontSize: 25,
    fontFamily: 'park-m',
    textAlign: 'center',
    color: Colors.white100,
    paddingVertical: 12
  }
});