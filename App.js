import 'react-native-gesture-handler'
import React from 'react';
import { StatusBar, LinearGradient } from 'react-native';

import { Provider } from 'react-redux'
import store from './redux/store'

import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

import LoginNavigator from './LoginNavigator'
import MainNavigator from './MainNavigator';

const AppStack = createStackNavigator()

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppStack.Navigator screenOptions={{headerShown: false}}>
          <AppStack.Screen name='LoginNavigator' component={LoginNavigator} />
          <AppStack.Screen name='MainNavigator' component={MainNavigator} />
        </AppStack.Navigator> 
        <StatusBar backgroundColor='#db2745' barStyle='default'/>
      </NavigationContainer>
    </Provider>
  )
}