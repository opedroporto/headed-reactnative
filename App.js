import 'react-native-gesture-handler'
import * as React from 'react';
import { StatusBar } from 'react-native';

import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'

import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

import LoginNavigator from './navigators/LoginNavigator'
import MainNavigator from './navigators/MainNavigator';

const AppNavigatorStack = createStackNavigator()

function MyApp() {
  const initialRouteName = store.getState().user.accessToken !== undefined? 'MainNavigator' : 'LoginNavigator'
  return (
    <NavigationContainer>
      <AppNavigatorStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRouteName}
      >
        <AppNavigatorStack.Screen name='LoginNavigator' component={LoginNavigator} />
        <AppNavigatorStack.Screen name='MainNavigator' component={MainNavigator} />
      </AppNavigatorStack.Navigator>
      <StatusBar backgroundColor='#db2745' barStyle='default'/>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MyApp/>
      </PersistGate>   
    </Provider>
  )
}