import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';

export default function MainPage() {
  return (
    <View style={styles.container}>
      <View style={{paddingTop: 180}}/>
      <View style={styles.middleContainer}>
        <Text style={styles.heading}>I am a</Text>
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary500
  },
  middleContainer: {
    padding: 30
  },
  heading: {
    color: Colors.orange100,
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
    height: 100,
    backgroundColor: Colors.primary400,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.orange100
  },
  itemText: {
    color: Colors.white100,
    fontSize: 25,
    fontFamily: 'park-r'
  }
});