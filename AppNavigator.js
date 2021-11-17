import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack'

import LoginNavigator from './LoginNavigator'
import MainNavigator from './MainNavigator';

const AppNavigatorStack = createStackNavigator()

export default function AppNavigator() {
  return (
      <AppNavigatorStack.Navigator screenOptions={{headerShown: false}}>
          <AppNavigatorStack.Screen name='LoginNavigator' component={LoginNavigator} />
          <AppNavigatorStack.Screen name='MainNavigator' component={MainNavigator} />
      </AppNavigatorStack.Navigator>
  )
}
