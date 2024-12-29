import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { isClerkAPIResponseError, useSignIn, useSignUp } from '@clerk/clerk-expo';
import Colors from '@/constants/Colors';

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
      router.push(`/verify/${phoneNumber}?role=${role}`);
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
    const { supportedFirstFactors } = await signIn!.create({
      identifier: phoneNumber,
    })
    const firstPhoneFactor: any = supportedFirstFactors?.find((factor: any) => {
      return factor.strategy === 'phone_code';
    })
    const {phoneNumberId} = firstPhoneFactor;
    await signIn!.prepareFirstFactor({
      strategy: 'phone_code',
      phoneNumberId,
    })
    router.push(`/verify/${phoneNumber}?signin=true`);
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={keyboardVerticalOffset} style={styles.mainContainer}>
      {loading && <View style={styles.loading}>
            <ActivityIndicator size={'large'} color={Colors.orange100}/>
            <Text style={{fontSize: 18, padding: 10, color: Colors.white100, fontFamily: 'park-m'}}>Sending Code...</Text>
          </View>}

      <View style={styles.inputContainer}>
        <View style={{paddingTop: 35}}>
          <TextInput 
            placeholder=' Enter phone number...'
            placeholderTextColor='#ccc'
            cursorColor={Colors.orange100}
            keyboardType='number-pad'
            maxLength={10}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={styles.input}
          />
        </View>

        <View style={{paddingTop: 20}}>
          <TouchableOpacity style={[styles.button, phoneNumber !== '' ? styles.enabled : null]} onPress={sendOTP} disabled={phoneNumber === ''}>
            <Text style={[styles.buttonText, phoneNumber !== '' ? styles.enabled : null]}>Next</Text>
          </TouchableOpacity>
        </View>
        
      </View>

    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    backgroundColor: Colors.primary500,
  },
  inputContainer: {
    height: '95%',
    paddingHorizontal: 10,
    marginHorizontal: 12,
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
  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 10
  },
  enabled: {
    backgroundColor: Colors.orange100,
    color: '#fff'
  },
  buttonText: {
    color: Colors.white100,
    fontSize: 22,
    fontWeight: '500'
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: Colors.primary400,
    justifyContent: 'center',
    alignItems: 'center'
  }
});