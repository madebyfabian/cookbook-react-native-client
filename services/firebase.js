import * as firebase from 'firebase/app'
import 'firebase/auth'


const generateConfig = () => ({
  apiKey: process.env.REACT_NATIVE_FIREBASE_APIKEY,
  authDomain: process.env.REACT_NATIVE_FIREBASE_AUTHDOMAIN,
})


// Initialize Firebase App
if (!firebase.apps.length)
  firebase.initializeApp(generateConfig())


export default firebase