import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { isClerkAPIResponseError, useSignIn, useSignUp } from '@clerk/clerk-expo';
import Colors from '@/constants/Colors';
import { PhoneCodeFactor } from "@clerk/types";
import { LinearGradient } from 'expo-linear-gradient';

export default function OTP() {
  const {role} = useLocalSearchParams<{role: string}>();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : 0;
  const { signUp, setActive} = useSignUp();
  const {signIn} = useSignIn();

  const sendOTP = async () => {
    setLoading(true);
    try { 
      const cleanedNumber = phoneNumber.replace(/\D/g, '');
      const e164PhoneNumber = `+91${cleanedNumber}`;
      await signUp!.create({phoneNumber: e164PhoneNumber});
      const resp = await signUp!.preparePhoneNumberVerification();
      router.push(`/verify/${phoneNumber}?role=${role}&signin=false`);
    } catch (error) {
      if(isClerkAPIResponseError(error)) {
        if(error.errors[0].code === 'form_identifier_exists'){
          console.log('user exists');
          await trySignIn();
        } else {
          setLoading(false);
          Alert.alert('Error', error.errors[0].message);
        }
      }
    }
  }

  const trySignIn = async () => {
    try {
      const cleanedNumber = phoneNumber.replace(/\D/g, '');
      const e164PhoneNumber = `+91${cleanedNumber}`;
      
      const { supportedFirstFactors } = await signIn!.create({
        identifier: e164PhoneNumber,
      });
  
      const firstPhoneFactor = supportedFirstFactors?.find(
        (factor): factor is PhoneCodeFactor => factor.strategy === 'phone_code'
      );
      
      if (!firstPhoneFactor) {
        throw new Error('Phone authentication not supported');
      }
      
      await signIn!.prepareFirstFactor({
        strategy: 'phone_code',
        phoneNumberId: firstPhoneFactor.phoneNumberId,
      });
  
      router.push(`/verify/${phoneNumber}?role=${role}&signin=true`);
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate sign in');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }


  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        // Background Linear Gradient
        colors={['rgba(2,2,2,255)','rgba(46,47,47,255)']}
        style={styles.background}
      />
      {loading && <View style={styles.loading}>
            <ActivityIndicator size={'large'} color={Colors.orange100}/>
            <Text style={{fontSize: 18, padding: 10, color: Colors.white100, fontFamily: 'park-m'}}>Sending OTP...</Text>
          </View>}

      <View style={styles.inputContainer}>
        <View style={{paddingTop: 35}}>
          <TextInput 
            placeholder=' Enter phone number...'
            placeholderTextColor={Colors.whiteFade}
            cursorColor={Colors.orange100}
            keyboardType='number-pad'
            maxLength={10}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
            autoFocus={true}
          />
        </View>

        <View style={{paddingTop: 20}}>
          <TouchableOpacity style={[styles.button, phoneNumber.length == 10 ? styles.enabled : null]} onPress={sendOTP} disabled={phoneNumber.length <= 9}>
            <Text style={[styles.buttonText, phoneNumber.length == 10 ? styles.enabled : null]}>Send OTP</Text>
          </TouchableOpacity>
        </View>
        
      </View>

    </View>
  )
}

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    backgroundColor: Colors.primary500,
  },
  inputContainer: {
    height: '96%',
    paddingHorizontal: 10,
    marginHorizontal: 12,
    justifyContent: 'space-between'
  },
  input: {
    borderColor: Colors.whiteFade,
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 9,
    borderRadius: 8,
    fontSize: 20,
    fontFamily: 'park-r',
    color: Colors.white,
    textAlign: 'center',
    letterSpacing: 1.5
  },
  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 10
  },
  enabled: {
    backgroundColor: Colors.orange,
    color: 'black',
    fontSize: 24,
    fontFamily: 'park-m'
  },
  buttonText: {
    color: Colors.white100,
    fontSize: 24,
    fontFamily: 'park-m'
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: Colors.primary400,
    justifyContent: 'center',
    alignItems: 'center'
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
});