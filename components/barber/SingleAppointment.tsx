import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Colors from '@/constants/Colors';
import { Entypo } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';


interface SingleAppointmentProps {
    id: string;
    status: string;
    startTime: string;
    service: string;
    duration: number;
    customerPhone: string;
    onPress: () => void;
}

export default function SingleAppointment({id, status, startTime, service, duration, customerPhone, onPress}: SingleAppointmentProps) {
    const [modalVisible, setModalVisible] = useState(false);

    const declineToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Appointment Decline Successfully 👍'
        })
    }
    const completedToast = () => {
        Toast.show({
            type: 'success',
            text1: 'Appointment Completed Successfully 👍'
        })
    }

    const closeModal = () => {
        setModalVisible(false);
    }

    const decline = async() => {
        try {
            await supabase.from('appointments').delete().eq('id', id);
            onPress();
            closeModal();
            declineToast();
        } catch (err) {
            Alert.alert("Some wrong while deleting");
        }
    }

    const markCompleted = async () => {
        try {
            await supabase.from('appointments').update({status: 'done'}).eq('id', id);
            onPress();
            closeModal();
            completedToast();
        } catch (err) {
            Alert.alert('Something error while marking completed.')
        }
    }

return (
    <TouchableOpacity style={styles.container} onPress={() => setModalVisible(true)}>
      <View style={styles.top}>
        <Text style={styles.heading}>{service}</Text>
        <Text style={styles.heading}>{startTime}</Text>
      </View>
      <View style={{gap: 9, paddingVertical: 9}}>
        <Text style={styles.text}>TIME : {duration} minutes</Text>
        <Text style={styles.text}>STATUS : {status}</Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
            <BlurView intensity={40} style={[StyleSheet.absoluteFill, styles.blurContainer]}>
                <View style={styles.modalContent}>
                    <View style={styles.top}>
                        <Text style={styles.heading}>{service}</Text>
                        <Text style={styles.heading}>{startTime}</Text>
                    </View>
                    <Text style={[styles.text, {paddingVertical: 10}]}>Customer Phone : {customerPhone}</Text>
                    <View style={styles.btnContainer}>
                        <TouchableOpacity onPress={decline} style={styles.btn}>
                            <Entypo name="cross" size={29} color="black" />
                            <Text style={styles.btnText}>Decline</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={markCompleted} style={styles.btn}>
                            <Entypo name="check" size={28} color="black" />
                            <Text style={styles.btnText}>Completed</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </View>
      </Modal>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        margin: 12,
        borderRadius: 5,
        padding: 12
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    heading: {
        fontSize: 29,
        fontFamily: 'park-m',
        color: Colors.orange100
    },
    text: {
        fontSize: 17,
        fontFamily: 'park-m',
        color: Colors.white100
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