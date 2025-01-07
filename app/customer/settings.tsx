import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { useAuth, useUser } from '@clerk/clerk-expo';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import LocationPicker from '@/components/barber/LocationPicker';

export default function Settings() {
    const [name, setName] = useState('');
    const { user } = useUser();
    // const { signOut } = useAuth();
    const router = useRouter();
    const phoneNumbser = user?.primaryPhoneNumber?.phoneNumber;
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);

    useEffect(() => {
        async function getData() {
            try {
                const {data} = await supabase.from('customers').select('*').eq('phone', phoneNumbser).single(); 
                if(data) {
                    setName(data?.name);
                    setLatitude(data?.location.lat);
                    setLongitude(data?.location.lgt);
                }
            } catch (err) {
                Alert.alert('Something went wrong while getting data');
            }
        }
        getData();
    },[])

    const save = async() => {
        try {
            await supabase.from('customers').update({
                name: name, 
                location: {
                    lat: latitude,
                    lgt: longitude
                }
            }).eq('phone', phoneNumbser);
            nameSaved();
            router.replace('/customer/home');
        } catch (err) {
            Alert.alert("Something went wrong while saving the Information");
        }
    }
    // const logoutToast = () => {
    //     Toast.show({
    //       type: 'success',
    //       text1: 'Logout Successfully 👋'
    //     });
    // }

    // const logout = async() => {
    //     try {
    //         await signOut();
    //         router.replace('/');
    //         logoutToast();
    //     } catch(err) {
    //         Alert.alert("Error while logout.")
    //     }
    // }

    const nameSaved = () => {
        Toast.show({
          type: 'success',
          text1: 'Information Saved Successfully 👋'
        });
    }

    const locationHandler = (x: number, y: number) => {
        setLatitude(x);
        setLongitude(y);
      }

  return (
    <View style={styles.container}>
        <View style={{flex: 1}}>
            <View style={{padding: 16}}>
                <Text style={styles.nameText}>Name:</Text>
                <TextInput 
                placeholder=' Enter your Name...'
                placeholderTextColor={Colors.white100}
                cursorColor={Colors.orange100}
                keyboardType='default'
                value={name}
                onChangeText={setName}
                style={styles.input}
                />
            </View>
            <View style={{padding: 16, flex: 1, maxHeight: 190}}>
                <Text style={styles.nameText}>Location:</Text>
                <LocationPicker onPress={locationHandler} lat={latitude} lgt={longitude}/>
            </View>
            
        </View>
        <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={save}>
                <View style={styles.saveContainer}>
                    <Text style={styles.saveText}>Save</Text>
                </View>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={logout}>
                <View style={styles.saveContainer}>
                    <Text style={styles.saveText}>Logout</Text>
                </View>
            </TouchableOpacity> */}
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary500,
        justifyContent: 'space-between'
    },
    input: {
        borderColor: Colors.white200,
        borderWidth: 1,
        paddingHorizontal: 5,
        borderRadius: 8,
        fontSize: 20,
        fontFamily: 'park-r',
        color: Colors.white100
    },
    nameText: {
        fontSize: 15,
        fontFamily: 'mon-m',
        color: Colors.white100,
        paddingLeft: 5
    },
    bottomContainer: {
        marginBottom: 25
    },
    saveContainer: {
        marginVertical: 10,
        marginHorizontal: 10,
        backgroundColor: Colors.orange100,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10
    }, 
    saveText: {
        textAlign: 'center',
        fontSize: 23,
        fontFamily: 'park-m',
        color: Colors.white100
    },
    inputContainer: {
        padding: 12
    },
    label: {
        fontSize: 19,
        fontFamily: 'park-m',
        color: Colors.white100
    }
});