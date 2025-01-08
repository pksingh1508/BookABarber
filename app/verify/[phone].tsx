import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router';
import { isClerkAPIResponseError, useSignIn, useSignUp } from '@clerk/clerk-expo';
import Colors from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';

export default function Page() {
  const {phone, signin, role} = useLocalSearchParams<{phone: string, signin: string, role: string}>();
  const [code, setCode] = useState('');
  const { signUp, setActive} = useSignUp();
  const {signIn} = useSignIn();
  const [showTimer, setShowTimer] = useState(true);
  const [second, setSecond] = useState(100);
  const [loading, setLoading] = useState(false);

    useEffect(() => {
      if(code.length === 6) {
        if(signin === 'true') {
          verifySignIn();
        } else {
          verifyCode();
        }
      }
    }, [code])

    useEffect(() => {
      const myid = setInterval(() => {
        setSecond(prevSecond => {
          if (prevSecond <= 1) {
            clearInterval(myid);
            setShowTimer(false);
            return 0;
          }
          return prevSecond - 1;
        });
      }, 1000);
    
      // Clean up the interval when the component unmounts
      return () => clearInterval(myid);
    }, []);

    const verifyCode = async() => {
      setLoading(true);
      try {
        await signUp!.attemptPhoneNumberVerification({
          code,
        })
        await addUserToSupabase();
        await setActive!({ session: signUp!.createdSessionId })
        setLoading(false);
      } catch (err: any) {
        console.error(JSON.stringify(err, null, 2));
        if(isClerkAPIResponseError(err)) {
          Alert.alert('Error', err.errors[0].message);
        }
        setLoading(false);
      }
    };

    const addUserToSupabase = async() => {
      if(role === 'barber') {
        const {data, error} = await supabase.from('barbers').insert({role: role, phone: `+91${phone}`}).select();
        console.log('barber data', data);
      } else {
        const {data, error} = await supabase.from('customers').insert({role: role, phone: `+91${phone}`}).select();
        console.log("customer data", data);
      }
    };

    const verifySignIn = async() => {
      try {
        await signIn!.attemptFirstFactor({
          strategy: 'phone_code',
          code,
        });
        await setActive!({ session: signIn!.createdSessionId });
      } catch (err) {
        console.log(err);
        if(isClerkAPIResponseError(err)) {
          Alert.alert('Error', err.errors[0].message);
        }
      }
    };

    const resendCode = async () => {
      try {
        if (signin === 'true') {
          const { supportedFirstFactors } = await signIn!.create({
            identifier: phone,
          });
  
          const firstPhoneFactor: any = supportedFirstFactors?.find((factor: any) => {
            return factor.strategy === 'phone_code';
          });
  
          const { phoneNumberId } = firstPhoneFactor;
  
          await signIn!.prepareFirstFactor({
            strategy: 'phone_code',
            phoneNumberId,
          });
        } else {
          await signUp!.create({
            phoneNumber: phone,
          });
          const res = await signUp!.preparePhoneNumberVerification();
          console.log("resend code ", res);
          
        }
      } catch (err) {
        console.log('error', JSON.stringify(err, null, 2));
        if (isClerkAPIResponseError(err)) {
          Alert.alert('Error', err.errors[0].message);
        }
      }
    };

  if(loading) {
    return (
      <View style={{flex: 1, backgroundColor: Colors.primary500, alignContent: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['rgba(2,2,2,255)','rgba(46,47,47,255)']}
        style={styles.background}
      />
      <Stack.Screen options={{
        headerTitle: `+91${phone}`,
        headerStyle: {
          backgroundColor: 'black'
        },
        headerTitleStyle: {
          color: Colors.white100,
          fontFamily: 'park-m',
          fontSize: 22
        },
        headerTintColor: Colors.orange100
      }}/>
      <Text style={[styles.text, {marginTop: 25}]}>We have sent you an SMS with a code to the number above.</Text>
      <Text style={styles.text}>To complete you phone number verification, Please enter the 6-digit activation code.</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder=' Enter 6 digit Code'
          placeholderTextColor={Colors.whiteFade}
          cursorColor={Colors.orange100}
          keyboardType='number-pad'
          maxLength={10}
          value={code}
          onChangeText={setCode}
          style={styles.input}
        />

        <View style={{paddingTop: 20}}>
          {showTimer ? (
            <View style={{}}>
              <Text style={{textAlign: "center", fontSize: 25, fontFamily: 'park-m', color: Colors.orange100}}>{second}</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.button} onPress={resendCode}>
              <Text style={styles.buttonText}>Resend Code?</Text>
            </TouchableOpacity>
          )}
          
        </View>
        
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: Colors.primary400
  },
  inputContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 12,
    marginTop: 25
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
    padding: 10,
    borderRadius: 10
  },
  enabled: {
    backgroundColor: Colors.orange100,
    color: '#fff'
  },
  buttonText: {
    color: Colors.orange300,
    fontSize: 17,
    fontWeight: '500'
  },
  text: {
    paddingHorizontal: 21,
    fontSize: 17,
    color: Colors.white,
    textAlign: 'center',
    paddingVertical: 9
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
});
