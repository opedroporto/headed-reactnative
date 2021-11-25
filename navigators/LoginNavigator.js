import 'react-native-gesture-handler'
import React from 'react';

import { createStackNavigator } from '@react-navigation/stack'

import Login from '../screens/Login'
import Signup from '../screens/Signup'
import Email from '../screens/Email'

const LoginStack = createStackNavigator()

export default class LoginNavigator extends React.Component {
  render() {
    return (
      <LoginStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#db2745',
            height: 50
          },
          headerTitleStyle: {
          },
          headerTintColor: '#fff',
          headerShadowVisible: false,
          headerShown: false
        }}
      >
        <LoginStack.Screen name='LoginScreen' component={Login} />
        <LoginStack.Screen name='EmailScreen' component={Email} />
        <LoginStack.Screen name='SignupScreen' component={Signup} />
      </LoginStack.Navigator>
    )
  }
}