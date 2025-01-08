import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';

interface SingleAppointmentProps {
    startTime: string;
    duration: number;
}

export default function SingleAppointment({startTime, duration}: SingleAppointmentProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{startTime}</Text>
      <FontAwesome5 name="long-arrow-alt-down" size={24} color={Colors.white300} style={styles.arrow}/>
      <Text style={styles.text}>{duration} minutes</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundFade,
    marginRight: 10,
    width: 150,
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: 'center',
    gap: 7
  },
  text: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'park-m'
  },
  arrow: {
    textAlign: 'center'
  }
});