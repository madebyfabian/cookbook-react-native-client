import React, { useContext, useEffect, useState } from 'react'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { auth } from '../services/firebase'
import { AuthUserContext } from './AuthUserProvider'
import Spinner from '../components/Spinner'
import TabBar from '../components/TabBar'
import Colors from '../utils/colors'

// App Stack Screens
import HomeScreen from '../screens/app/HomeScreen'
import HomeDetailScreen from '../screens/app/HomeDetailScreen'
import ProfileScreen from '../screens/app/ProfileScreen'
import _TestScreen from '../screens/app/_TestScreen'

// Auth Stack
import WelcomeScreen from '../screens/auth/WelcomeScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'
import LoginScreen from '../screens/auth/LoginScreen'
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen'


// Create Theme.
const navigationTheme = {
  ...DefaultTheme,
  colors: { // override colors
    ...DefaultTheme.colors,
    /*
    primary: Colors.primary,
    text: Colors.primary,
    border: Colors.mediumGrey,
    background: Colors.ghostWhite
    */
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
    <AppTabNavigator.Screen name="_Test" component={_TestScreen} />
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
  const { user, setUser } = useContext(AuthUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = auth.onAuthStateChanged(async authUser => {
      try {
        await (authUser ? setUser(authUser) : setUser(null));
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    });

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}