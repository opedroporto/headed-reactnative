import 'react-native-gesture-handler'
import * as React from 'react';
import { StatusBar } from 'react-native';

import { Provider } from 'react-redux'
import store from './redux/store'

import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

import LoginNavigator from './LoginNavigator'
import MainNavigator from './MainNavigator';

const AppNavigatorStack = createStackNavigator()

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigatorStack.Navigator screenOptions={{headerShown: false}}>
          <AppNavigatorStack.Screen name='LoginNavigator' component={LoginNavigator} />
          <AppNavigatorStack.Screen name='MainNavigator' component={MainNavigator} />
        </AppNavigatorStack.Navigator>
        <StatusBar backgroundColor='#db2745' barStyle='default'/>
      </NavigationContainer>
    </Provider>
  )
}