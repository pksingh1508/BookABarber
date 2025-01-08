import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';
import { useService } from '@/store/CurrentService';
import { getTodayDate } from '@/utils/necessaryFunction';

export interface SingleServiceProps {
    id: number;
    name: string;
    duration: string;
    image: string;
}

export default function SingleService({id, name, duration, image}: SingleServiceProps) {
    const router = useRouter();
    const { setCurrentService, resetCurrentService } = useService();
    const date = getTodayDate();
    const pressHandler = () => {
        resetCurrentService();
        setCurrentService({service: name, date: date, duration: Number(duration)});
        router.push('/map');
    }
  return (
    <TouchableOpacity onPress={pressHandler}>
        <View style={styles.container}>
            <View style={{paddingVertical: 10}}>
                <Image source={{uri: image}} width={80} height={80}/>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.duration}>Time : {duration} minutes</Text>
            </View>
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '76%',
        alignItems: 'center',
        backgroundColor: Colors.backgroundFade,
        marginHorizontal: 50,
        marginVertical: 10,
        borderRadius: 15,
        elevation: 7
    },
    textContainer: {
        justifyContent: 'center'
    },
    name: {
        fontSize: 24, 
        fontFamily: 'park-b',
        color: Colors.blue,
        textAlign: 'center'
    },
    duration: {
        fontSize: 15,
        fontFamily: 'park-r',
        color: Colors.white,
        textAlign: 'center',
        paddingVertical: 6
    }
});