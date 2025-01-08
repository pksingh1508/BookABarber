import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, Stack, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';


export default function MainPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const { isSignedIn } = useAuth();

  useEffect(() => {
      setLoading(true);
      async function redirect() {
        if(isSignedIn) {
          const phone = user?.primaryPhoneNumber?.phoneNumber;
          const { data } = await supabase.from('customers').select().eq('phone', phone).single();
          if(data === null) {
            router.replace('/barber');
          } else {
            // @ts-ignore
            router.replace('/customer');
          }
        } else {
          setLoading(false);
        }
      }
      redirect();
    }, [isSignedIn])

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['rgba(46,47,47,255)', 'rgba(2,2,2,255)']}
        style={styles.background}
      />
      {loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flexDirection: 'row', gap: 5}}>
            <ActivityIndicator size={'large'} color={Colors.orange300}/>
            <Text style={{fontSize: 20, color: Colors.orange300, fontFamily: 'park-b'}}>Checking...</Text>
          </View>
        </View>
      ) : (
        <View>
          <View style={{paddingTop: 180}}/>
          <View style={styles.middleContainer}>
            <Text style={styles.heading}>I am a ,</Text>
            <View style={styles.itemContainer}>
              <Link href={'/otp?role=barber'}>
                <View style={styles.item}>
                  <Text style={styles.itemText}>Barber</Text>
                </View>
              </Link>
              <Link href={'/otp?role=customer'}>
                <View style={styles.item}>
                  <Text style={styles.itemText}>Customer</Text>
                </View>
              </Link>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  middleContainer: {
    padding: 30
  },
  heading: {
    color: Colors.green,
    fontSize: 50,
    paddingVertical: 20,
    fontFamily: 'park-b'
  },
  itemContainer: {
    flexDirection: 'column',
    gap: 30
  },
  item: {
    width: '100%',
    height: 90,
    backgroundColor: Colors.backgroundFade,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    elevation: 7
  },
  itemText: {
    color: Colors.blue,
    fontSize: 40,
    fontFamily: 'park-m'
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
});