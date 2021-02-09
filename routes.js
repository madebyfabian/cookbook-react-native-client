import React from 'react'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { useAuthStore } from './store'
import TabBar from './components/TabBar'

// App Stack Screens
import HomeScreen from './screens/app/HomeScreen'
import HomeDetailScreen from './screens/app/HomeDetailScreen'
import ProfileScreen from './screens/app/ProfileScreen'

// Auth Stack
import WelcomeScreen from './screens/auth/WelcomeScreen'
import RegisterScreen from './screens/auth/RegisterScreen'
import LoginScreen from './screens/auth/LoginScreen'
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen'


// Create Theme.
const navigationTheme = {
  ...DefaultTheme,
  colors: { // override colors
    ...DefaultTheme.colors,
  }
}


const AppTabNavigator = createBottomTabNavigator(),
      AuthStackNavigator = createStackNavigator(),
      HomeStackNavigator = createStackNavigator()


const HomeStack = () => (
  <HomeStackNavigator.Navigator initialRouteName="HomeOverview" headerMode="none" screenOptions={{
    headerTransparent: true
  }}>
    <HomeStackNavigator.Screen 
      name="HomeOverview" 
      component={HomeScreen} 
      options={{ title: 'Cookbook', header: () => null }} 
    />
    <HomeStackNavigator.Screen 
      name="HomeDetail" 
      component={HomeDetailScreen} 
      options={{ title: null }} />
  </HomeStackNavigator.Navigator>
)

const AppStack = () => (
  <AppTabNavigator.Navigator tabBar={props => <TabBar {...props} />}>
    <AppTabNavigator.Screen name="Home" component={HomeStack} />
    <AppTabNavigator.Screen name="Profile" component={ProfileScreen} />
  </AppTabNavigator.Navigator>
)

const AuthStack = () => (
  <AuthStackNavigator.Navigator initialRouteName="Welcome" headerMode="screen">
    <AuthStackNavigator.Screen name="Welcome" component={WelcomeScreen} options={{ title: 'Zurück', header: () => null }} />
    <AuthStackNavigator.Screen name="Login" component={LoginScreen} />
    <AuthStackNavigator.Screen name="Register" component={RegisterScreen} />
    <AuthStackNavigator.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStackNavigator.Navigator>
)


export default function Routes() {
  const user = useAuthStore(state => state.user)

  return (
    <NavigationContainer theme={ navigationTheme }>
      { user ? <AppStack /> : <AuthStack /> }
    </NavigationContainer>
  )
}