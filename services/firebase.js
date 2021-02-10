import * as firebase from 'firebase/app'
import 'firebase/auth'
import { FIREBASE_APIKEY, FIREBASE_AUTHDOMAIN } from '@env'

if (!firebase.apps.length)
  firebase.initializeApp({ apiKey: FIREBASE_APIKEY, authDomain: FIREBASE_AUTHDOMAIN })

export default firebase