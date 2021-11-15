import 'react-native-gesture-handler'
import React from 'react';
import { StatusBar, LinearGradient } from 'react-native';

import { Provider } from 'react-redux'
import store from './redux/store'

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Home from './screens/Home.js'
import Company from './screens/Company.js'
import Profile from './screens/Profile.js'
import Login from './screens/Login.js'
import Signup from './screens/Signup.js'

const HomeStack = createStackNavigator()
const MainStack = createDrawerNavigator()
const AppStack = createStackNavigator()
const LoginStack = createStackNavigator()

function HomeNavigator() { 
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#db2745',
          height: 50
        },
        headerTitleStyle: {
        },
        headerTintColor: '#fff',
        headerShadowVisible: false
      }}
    >
      <HomeStack.Screen name='HomeScreen' component={Home} options={{title: 'Main companies', headerShown: false}} />
      <HomeStack.Screen name='CompanyScreen' component={Company} options={{title: 'Company'}}/>
    </HomeStack.Navigator>
  )
}

function MainNavigator() {
  return (
    <MainStack.Navigator
      initialRouteName='HomeNavigator'
      screenOptions={{
        headerStyle: {
          backgroundColor: '#db2745',
          height: 50
        },
        headerTitleStyle: {
        },
        headerTintColor: '#fff',
        headerShadowVisible: false
      }}
    >
      <MainStack.Screen name='ProfileScreen' component={Profile} options={{title: 'Your profile'}} />
      <MainStack.Screen name='HomeNavigator' component={HomeNavigator} options={{title: 'Main companies'}}  />
    </MainStack.Navigator>
  )
}

function LoginNavigator() {
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
      <LoginStack.Screen name='SignupScreen' component={Signup} />
    </LoginStack.Navigator>
  )
}

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