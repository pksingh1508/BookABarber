import SingleAppointment from '@/components/customers/SingleAppointment';
import SingleReview from '@/components/customers/SingleReview';
import { TimePicker } from '@/components/customers/TimePicker';
import Colors from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { useService } from '@/store/CurrentService';
import { formatTime, getTodayDate, isValidTime } from '@/utils/necessaryFunction';
import { useUser } from '@clerk/clerk-expo';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Toast from 'react-native-toast-message';


export default function MapScreen() {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [barbers, setBarbers] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any>([]);
  const [appointments, setAppointments] = useState<any>([]);
  const [flag, setFlag] = useState(false);
  const [time, setTime] = useState('');
  const { currentService } = useService();
  const todayDate = getTodayDate();
  const { user } = useUser();
  const phoneNumbser = user?.primaryPhoneNumber?.phoneNumber;
  const router = useRouter();
  const [userLat, setUserLat] = useState(0);
  const [userLgt, setUserLgt] = useState(0);

  useEffect(() => {
    async function getData() {
      const { data } = await supabase.from('barbers').select('*');
      setBarbers(data);
      setLoading(false);
    }
    async function getInitialUserLocation() {
      const { data } = await supabase.from('customers').select('location').eq('phone', phoneNumbser).single();
      setUserLat(data?.location.lat);
      setUserLgt(data?.location.lgt);
    }
    getData();
    getInitialUserLocation();
  },[])

  useEffect(() => {
    async function getReview() {
      const {data} = await supabase.from('review').select('*').eq('barberPhone', selectedLocation?.phone);
      setReviews(data);
    }
    async function getAppointment() {
      const { data } = await supabase.from('appointments').select('*').eq('barberPhone', selectedLocation?.phone).eq('status', 'pending');
      setAppointments(data);
    }
    getReview();
    getAppointment();
  }, [flag])

  const onAppointmentToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Appointment Booked Successfully 👋'
    });
  }
  

  const handleMarkerPress = (barber: any) => {
    setSelectedLocation(barber);
    setModalVisible(true);
    setFlag(!flag);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedLocation(null);
  };

  const onSetTime = (time: Date) => {
    const times = time.toLocaleTimeString('en-US', {
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    })
    setTime(times);
  }

  const bookAppointment = async() => {
    const { data, error } = await supabase
    .from('appointments')
    .insert([
      {
        service: currentService.service,
      startTime: time,
      date: todayDate,
      status: 'pending',
      barberPhone: selectedLocation?.phone,
      customerPhone: phoneNumbser,
      duration: currentService.duration
      },
    ])
    .select()
        
    if(error){
      Alert.alert('Something went wrong', `${error}`);
      return;
    }
    onAppointmentToast();
    router.replace('/customer/appointments');
  }

  if(loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType='hybrid'
        initialRegion={{
          latitude: userLat || 26.716442,
          longitude: userLgt || 83.448663,
          latitudeDelta: 1.0,
          longitudeDelta: 0.2,
        }}
      >
        {barbers.map((barber: any, index: number) => (
          <Marker
            key={index}
            coordinate={{
              latitude: barber.location.lat,
              longitude: barber.location.lgt
            }}
            title={barber.name || `User ${index + 1}`}
            image={require('@/assets/images/location.png')}
            onPress={() => handleMarkerPress(barber)}
          />
        ))}
        <Marker
          coordinate={{
            latitude: userLat,
            longitude: userLgt,
          }}
          title="Your Current Location"
        />
      </MapView>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <LinearGradient
            // Background Linear Gradient
            colors={['rgba(46,47,47,255)', 'rgba(2,2,2,255)']}
            style={styles.background}
          />
            <View>
              <TouchableOpacity onPress={closeModal}>
                <AntDesign name="closecircle" size={34} color='red' style={{textAlign: 'right', padding: 8}}/>
              </TouchableOpacity>
              <View style={{width: '100%', paddingLeft: 10, gap: 5}}>
                <Text style={styles.shopName}>{selectedLocation?.shopName}</Text>
                <Text style={{color: Colors.white, fontSize: 19, fontFamily: 'park-r'}}>Phone: {selectedLocation?.phone}</Text>
              </View>
              <View style={styles.timeContainer}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={styles.openTimeText}>Opening Time: </Text>
                  <Text style={styles.openTimeText}>{selectedLocation?.openTime}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={styles.closeTimeText}>Closing Time: </Text>
                  <Text style={styles.closeTimeText}>{selectedLocation?.closingTime}</Text>
                </View>
              </View>
              <View style={{maxHeight: 160, paddingHorizontal: 11}}>
                <Text style={{color: Colors.white, fontSize: 23, fontFamily: 'park-m', textAlign:'center',
                  paddingBottom: 10
                }}>What People Says:</Text>
                {reviews.length <= 0 ? (
                  <View style={{backgroundColor: Colors.backgroundFade, paddingHorizontal: 12, paddingVertical: 19, borderRadius: 10}}>
                    <Text style={{color: Colors.whiteFade, fontSize: 21, fontFamily: 'park-b', textAlign: 'center'}}>No review yet.</Text>
                  </View>
                ) : (
                  <FlatList 
                    data={reviews}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (<SingleReview {...item}/>)}
                  />
                )}
                
              </View>
              <View style={{maxHeight: 140, marginTop: 5, paddingHorizontal: 12}}>
                <Text style={{color: Colors.white100, fontSize: 23, fontFamily: 'park-m', textAlign:'center',
                  paddingBottom: 10
                }}>Today Appointments:</Text>
                {appointments.length <= 0 ? (
                  <View style={{backgroundColor: Colors.backgroundFade, paddingHorizontal: 12, paddingVertical: 19, borderRadius: 10}}>
                    <Text style={{color: Colors.whiteFade, fontSize: 21, fontFamily: 'park-b', textAlign: 'center'}}>No Appointments.</Text>
                </View>
                ) : (
                  <FlatList 
                    data={appointments}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => (<SingleAppointment {...item}/>)}
                  />
                )}
                
              </View>
              <View style={{marginTop: 30, paddingHorizontal: 10}}>
                <TimePicker onPress={onSetTime} myTime='00:00 AM'/>
              </View>
            </View>

            <View>
              <TouchableOpacity onPress={bookAppointment} style={styles.appointBtn}>
                <MaterialCommunityIcons name="checkbox-multiple-marked-circle" size={24} color="black" />
                <Text style={{fontFamily: 'park-m', fontSize: 16}}>Book Appointment</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%'
  },
  map: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary700,
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.primary500,
    borderRadius: 10,
    // padding: 6,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'space-between'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  shopName: {
    fontSize: 36,
    fontFamily: 'park-m',
    color: Colors.blue,
    textTransform: 'uppercase'
  },
  appointBtn: {
    flexDirection: 'row',
    gap: 9,
    backgroundColor: Colors.orange100,
    paddingVertical: 13,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 10
  },
  openTimeText: {
    color: Colors.blue,
    padding: 9,
    fontSize: 23,
    fontFamily: 'park-m'
  },
  closeTimeText: {
    color: 'orange',
    padding: 9,
    fontSize: 23,
    fontFamily: 'park-m'
  },
  timeContainer: {
    backgroundColor: Colors.backgroundFade,
    marginVertical: 15,
    marginHorizontal: 10,
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 14,
    elevation: 5
  }
});

