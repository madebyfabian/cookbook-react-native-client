import * as firebase from 'firebase/app'
import 'firebase/auth'
import { FIREBASE_APIKEY, FIREBASE_AUTHDOMAIN, FIREBASE_FUNCTIONS_BASEURL } from '@env'
import * as Linking from 'expo-linking'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { callbackPaths, asyncStorageKeys } from '../utils/constants'


if (!firebase.apps.length)
  firebase.initializeApp({ apiKey: FIREBASE_APIKEY, authDomain: FIREBASE_AUTHDOMAIN })



export default firebase


/**
 * Executes a firebase method that sends an email with a magic authentication link.
 * Also stores the email used in the AsyncStorage to access it later in the auth process.
 * This link uses a firebase function that opens the app.
 * @param {string} email The email of the new/existing user.
 * @param {*} callbackPath One of the values inside "constants.callbackPaths"
 */
export const sendSignInLinkToEmail = async ( email, callbackPath ) => {
  console.log('> execute sendSignInLinkToEmail inside firebase.js service...')

  if (!Object.values(callbackPaths).includes(callbackPath))
    return console.error('Only use a callbackPath from constants.callbackPaths!')

  // Execute the main functionality.
  await firebase.auth().sendSignInLinkToEmail(email, {
    handleCodeInApp: true,
    url: FIREBASE_FUNCTIONS_BASEURL 
      + '/auth-app-redirect?redirectUrl=' 
      + encodeURIComponent(Linking.makeUrl(callbackPath))
  })

  // Save the email in local storage, to retrieve it when user comes back from email link.
  await AsyncStorage.setItem(asyncStorageKeys.auth.email, email)

  console.log('  <- email successfully sent.\n\n')
}