import React from 'react';

import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { connect } from 'react-redux'

import Profile from './screens/Profile'
import Home from './screens/Home'
import Company from './screens/Company'
import Login from './screens/Login'
import LoginNavigator from './LoginNavigator';

const HomeStack = createStackNavigator()
const MainDrawer = createDrawerNavigator()

class HomeNavigator extends React.Component{
  render() {
    this.props.navigation.setOptions({headerShown: true})
    return (
      <HomeStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#db2745',
            height: 50
          },
          headerTintColor: '#fff',
          headerShadowVisible: false,
        }}
      >
        <HomeStack.Screen name='HomeScreen' component={Home} options={{title: 'Main companies', headerShown: false}} />
        <HomeStack.Screen name='CompanyScreen' component={Company} options={{title: 'Company'}}/>
      </HomeStack.Navigator>
    )
  }
}

class MainNavigator extends React.Component {
    render() {
        return (
          <React.Fragment>
            { this.props.user.accessToken ? (
              <MainDrawer.Navigator
                initialRouteName='HomeNavigator'
                screenOptions={{
                      headerStyle: {
                      backgroundColor: '#db2745',
                      height: 50
                    },
                    headerTintColor: '#fff',
                    headerShadowVisible: false,
                    unmountOnBlur: true,
                }}
              >
                <MainDrawer.Screen name='ProfileScreen' component={Profile} options={{title: 'Your profile'}} />
                <MainDrawer.Screen name='HomeNavigator' component={HomeNavigator} options={{title: 'Main companies'}} />
              </MainDrawer.Navigator>
            ) : (
              <MainDrawer.Navigator
                initialRouteName='HomeNavigator'
                screenOptions={{
                      headerStyle: {
                      backgroundColor: '#db2745',
                      height: 50
                    },
                    headerTintColor: '#fff',
                    headerShadowVisible: false,
                    unmountOnBlur: true,
                }}
              >
                <MainDrawer.Screen name='LoginNavigator' component={LoginNavigator} options={{title: 'Log in', headerShown: false}} />
                <MainDrawer.Screen name='HomeNavigator' component={HomeNavigator} options={{title: 'Main companies'}} />
              </MainDrawer.Navigator>
            )}
          </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps)(MainNavigator)