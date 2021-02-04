import * as firebase from 'firebase/app'
import 'firebase/auth'


// Initialize Firebase App
if (!firebase.apps.length)
  firebase.initializeApp({
    apiKey: process.env.REACT_NATIVE_FIREBASE_APIKEY,
    authDomain: process.env.REACT_NATIVE_FIREBASE_AUTHDOMAIN,
  })


export default firebase