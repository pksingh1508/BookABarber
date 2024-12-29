import Colors from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export const TimePicker = ({onPress, myTime}: {onPress: (time: Date) => void, myTime: string}) => {
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState<Date>();

    const openPicker = () => {
        setShowTimePicker(true);
    }
    const handleTimeChange = (event: any, selectedTime: any) => {
        const currentTime = selectedTime;
        setSelectedTime(currentTime);
        onPress(selectedTime);
        setShowTimePicker(false);
      };
    return (
        <View style={[styles.container]}>
            <TouchableOpacity onPress={openPicker} style={styles.chooseBtn}>
                <MaterialIcons name="timer" size={21} color="black" />
                <Text style={{fontSize: 16, fontFamily: 'park-m'}}>Choose Time:</Text>
            </TouchableOpacity>
            {showTimePicker && (
                <DateTimePicker
                testID='dateTimePicker'
                mode='time'
                display='spinner'
                is24Hour={false}  // Turn off 24-hour format
                value={selectedTime || new Date()}
                onChange={handleTimeChange}
              />
            )}
            <Text style={styles.time}>
                {selectedTime ? (
                    selectedTime.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    })
                ) : (
                    <Text>{myTime}</Text>
                )}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        // marginTop: 20,
        backgroundColor: Colors.background,
        marginHorizontal: 1,
        paddingHorizontal: 25,
        paddingVertical: 20,
        borderRadius: 10
    },
    chooseBtn: {
        flexDirection: 'row',
        backgroundColor: Colors.orange100,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10
    },
    time: {
        color: Colors.orange100,
        fontSize: 25,
        fontFamily: 'park-m',
        verticalAlign: 'middle'
    }
})