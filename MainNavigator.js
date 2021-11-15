import React from 'react';

import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { connect } from 'react-redux'

import Profile from './screens/Profile'
import Home from './screens/Home'
import Company from './screens/Company'

import LoginNavigator from './LoginNavigator'

const HomeStack = createStackNavigator()
const MainStack = createDrawerNavigator()

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

class MainNavigator extends React.Component {
    render() {
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
                { this.props.user ?
                  (<MainStack.Screen name='Login' component={Profile} options={{title: 'Your profile'}} />)
                  :
                  (<MainStack.Screen name='LoginNavigator' component={LoginNavigator} options={{title: 'Log in', headerShown: false}} />)
                }
                <MainStack.Screen name='HomeNavigator' component={HomeNavigator} options={{title: 'Main companies'}}  />
            </MainStack.Navigator>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps)(MainNavigator)