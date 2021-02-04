import * as firebase from 'firebase/app'
import 'firebase/auth'

import firebaseConfig from '../firebase.config.local.json'


// Initialize Firebase App
if (!firebase.apps.length)
  firebase.initializeApp(firebaseConfig)


export default firebase