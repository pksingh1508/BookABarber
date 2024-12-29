import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';

interface UserAppointmentProps {
    barberPhone: string;
    customerPhone: string;
    date: string;
    duration: number;
    id: string;
    service: string;
    startTime: string;
    status: string;
    onPress: () => void;
}

export default function UserAppointment({barberPhone, date, duration, service, startTime, status, id, onPress}: UserAppointmentProps) {
  const deleteToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Appointment Deleted Successfully ✔️✔️'
    })
  }
  
  const deleteHandler = async () => {
    try {
      await supabase.from('appointments').delete().eq('id', id);
      deleteToast();
      onPress();
    } catch (err) {
      Alert.alert("Something wrong while deleting the appointments");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={[styles.text, {color: status === 'pending' ? Colors.orange100 : 'green'}]}>{service}</Text>
        <Text style={[styles.text, {color: status === 'pending' ? Colors.orange100 : 'green'}]}>{startTime}</Text>
      </View>
      <View style={styles.top}>
        <Text style={styles.text2}>Shop Mob : {barberPhone}</Text>
        <Text style={styles.text2}>{date}</Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View>
          <Text style={styles.text2}>Time : {duration} minutes</Text>
          <Text style={styles.text2}>Status : {status.toUpperCase()}</Text>
        </View>
        <View>
          {status === 'pending' && (
            <TouchableOpacity onPress={deleteHandler}>
              <MaterialIcons name="delete" size={30} color={Colors.orange100} />
            </TouchableOpacity>
          )}
          
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 19,
    marginVertical: 10,
    backgroundColor: Colors.background,
    borderRadius: 7,
    paddingHorizontal: 17,
    paddingVertical: 18
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  text: {
    fontSize: 25,
    fontFamily: 'park-m',
  },
  text2: {
    fontSize: 15,
    fontFamily: 'park-r',
    color: Colors.white100
  }
});