import React from 'react'
import { Drawer } from 'expo-router/drawer'
import Colors from '@/constants/Colors';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const Layout = () => {
  return (
    <Drawer screenOptions={{
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: Colors.background100
      },
      headerTintColor: Colors.orange100,
      headerTitleStyle: {
        color: Colors.white100,
        fontFamily: 'park-m',
        fontSize: 24
      },
      drawerStyle: {
        backgroundColor: Colors.background
      },
      drawerActiveBackgroundColor: Colors.blue,
      drawerActiveTintColor: 'black',
      drawerLabelStyle: {
        fontSize: 20,
        fontFamily: 'park-m',
        textAlign: 'center',
        paddingVertical: 8
      },
      drawerInactiveTintColor: Colors.white,
      drawerInactiveBackgroundColor: Colors.primary200,
      drawerItemStyle: {
        marginVertical: 9
      },
      drawerStatusBarAnimation: 'fade',
      drawerHideStatusBarOnOpen: true,
    }}>
      <Drawer.Screen name='home' options={{
        drawerLabel: 'Home',
        title: "Home",
        drawerIcon: ({size, color}) => (<MaterialCommunityIcons name="home-flood" size={size} color={color} />)
      }}/>
      <Drawer.Screen name='settings' options={{
        drawerLabel: 'Settings',
        title: "Settings",
        drawerIcon: ({size, color}) => (<Feather name="settings" size={size} color={color} />)
      }}/>
      <Drawer.Screen name='appointments' options={{
        drawerLabel: 'Appointments',
        title: "Appointments",
        drawerIcon: ({size, color}) => (<MaterialCommunityIcons name="calendar-clock" size={size} color={color} />)
      }}/>
    </Drawer>
  )
}

export default Layout;