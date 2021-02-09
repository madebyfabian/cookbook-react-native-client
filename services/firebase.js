import * as firebase from 'firebase/app'
import 'firebase/auth'
import { FIREBASE_APIKEY, FIREBASE_AUTHDOMAIN } from '@env'


const generateConfig = () => ({
  apiKey: FIREBASE_APIKEY,
  authDomain: FIREBASE_AUTHDOMAIN,
})


// Initialize Firebase App
if (!firebase.apps.length)
  firebase.initializeApp(generateConfig())


export default firebase