import React, { createRef } from 'react'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from 'react-native-screens/native-stack'
import { enableScreens } from 'react-native-screens'

import { useAuthStore, useGeneralStore } from './store'
import { TabBar, Spinner } from './components'

// App Stack Screens
import HomeScreen from './screens/app/HomeScreen'
import HomeDetailScreen from './screens/app/HomeDetailScreen'
import ProfileScreen from './screens/app/ProfileScreen'

// Auth Stack
import WelcomeScreen from './screens/auth/WelcomeScreen'
import RegisterScreen from './screens/auth/RegisterScreen'
import LoginScreen from './screens/auth/LoginScreen'
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen'
import MagicLinkModal from './screens/auth/MagicLinkModal'


/**
 * A ref + helper-functions that can be used outside of a Screen/Component to navigate.
 */
export const navigationRef = createRef()

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function getCurrentRouteName() {
  return navigationRef.current?.getCurrentRoute()?.name
}

export function goBack() {
  navigationRef.current?.goBack()
}

export function closeMagicLinkModal() {
  if (getCurrentRouteName() === 'MagicLinkModal')
    goBack()
}


// Enable native navigator.
enableScreens()


// Create Theme.
const navigationTheme = {
  ...DefaultTheme,
  colors: { // override colors
    ...DefaultTheme.colors,
  }
}


const AppTabNavigator = createBottomTabNavigator(),
      AuthStackNavigator = createStackNavigator(),
      HomeStackNavigator = createStackNavigator(),
      RootStackNavigator = createNativeStackNavigator()


const AppHomeStack = () => (
  <HomeStackNavigator.Navigator 
    initialRouteName="HomeOverview" 
    headerMode="none" 
    screenOptions={{ headerTransparent: true }}>

    <HomeStackNavigator.Screen name="HomeOverview" component={HomeScreen} options={{ title: 'Cookbook', header: () => null }} />
    <HomeStackNavigator.Screen name="HomeDetail" component={HomeDetailScreen} options={{ title: null }} />
  </HomeStackNavigator.Navigator>
)

const AppStack = () => (
  <AppTabNavigator.Navigator tabBar={props => <TabBar {...props} />}>
    <AppTabNavigator.Screen name="Home" component={AppHomeStack} />
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


const RootStack = ({ user }) => (
  <RootStackNavigator.Navigator>
    { user 
      ? <RootStackNavigator.Screen name="App" component={ AppStack } options={{ headerShown: false }} />
      : <RootStackNavigator.Screen name="Auth" component={ AuthStack } options={{ headerShown: false }} />
    }

    <RootStackNavigator.Screen
      name="MagicLinkModal"
      component={ MagicLinkModal }
      options={{ gestureEnabled: false, stackPresentation: 'formSheet' }}
    />
  </RootStackNavigator.Navigator>
)


export default function Routes() {
  const user = useAuthStore(state => state.user),
        appIsLoading = useGeneralStore(state => state.appIsLoading)

  if (appIsLoading)
    return <Spinner />

  return (
    <NavigationContainer theme={ navigationTheme } ref={ navigationRef }>
      <RootStack user={ user } />
    </NavigationContainer>
  )
}