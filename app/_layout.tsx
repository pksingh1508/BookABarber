import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo'
import * as SecureStore from 'expo-secure-store'
import Colors from '@/constants/Colors';

import Toast from 'react-native-toast-message';
import React from 'react';
import { View } from 'react-native';

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key)
      if (item) {
        console.log(`${key} was used 🔐 \n`)
      } else {
        console.log('No values stored under key: ' + key)
      }
      return item
    } catch (error) {
      console.error('SecureStore get item error: ', error)
      await SecureStore.deleteItemAsync(key)
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}


const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!
if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded] = useFonts({
    "park-r": require('../assets/fonts/Parkinsans-Regular.ttf'),
    "park-m": require('../assets/fonts/Parkinsans-Medium.ttf'),
    "park-b": require('../assets/fonts/Parkinsans-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  

  if (!loaded) {
    return <View />;
  }

  return (
    <Stack>
      <Stack.Screen name='index' options={{headerShown: false}}/>
      <Stack.Screen name='otp' options={{
        title: 'Verify Phone Number',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: Colors.white300,
          fontSize: 21,
          fontFamily: 'park-m'
        },
        headerStyle: {
          backgroundColor: Colors.background100,
        },
        headerTintColor: Colors.orange100,
      }}/>
      <Stack.Screen name='map' options={{
        headerTitleAlign: 'center',
        headerTitle: "Nearby Barber Shops",
        headerStyle: {
          backgroundColor: Colors.background100,
        },
        headerTintColor: Colors.orange100,
        headerTitleStyle: {
          color: Colors.white100,
          fontSize: 19,
          fontFamily: 'park-m'
        }
      }}/>
      <Stack.Screen name='verify/[phone]' options={{headerShown: true, headerTitleAlign: 'center'}}/>
      <Stack.Screen name='barber' options={{headerShown: false}}/>
      <Stack.Screen name='customer' options={{headerShown: false}}/>
    </Stack>
  );
}

const RootLayoutNav = () => {

  return (
    <>
      <StatusBar style='light'/>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
          <RootLayout />
          <Toast 
            visibilityTime={2000}
          />
      </ClerkProvider>
    </>  
  );
}
export default RootLayoutNav;

