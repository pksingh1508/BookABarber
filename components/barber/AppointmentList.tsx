import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors';


interface SingleAppointmentProps {
    id: string;
    status: string;
    startTime: string;
    service: string;
    duration: number;
    customerPhone: string;
}

export default function AppointmentList({id, status, startTime, service, duration, customerPhone}: SingleAppointmentProps) {
return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.heading}>{service}</Text>
        <Text style={styles.heading}>{startTime}</Text>
      </View>
      <View style={{gap: 9, paddingVertical: 9}}>
        <Text style={styles.text}>TIME : {duration} minutes</Text>
        <Text style={styles.text}>STATUS : ✅ {status.toUpperCase()}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundFade,
        margin: 12,
        borderRadius: 5,
        padding: 12,
        elevation: 7
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    heading: {
        fontSize: 29,
        fontFamily: 'park-m',
        color: 'green'
    },
    text: {
        fontSize: 17,
        fontFamily: 'park-m',
        color: Colors.white
    },
    modalContainer: {
        flex: 1
    },
    blurContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    modalContent: {
        backgroundColor: Colors.background,
        borderRadius: 7,
        padding: 12,
        width: '100%'
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        gap: 8,
        marginVertical: 19
    },
    btn: {
        flexDirection: 'row',
        gap: 9,
        backgroundColor: Colors.orange100,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12
    },
    btnText: {
        fontSize: 20,
        fontFamily: 'park-m'
    }
});