import * as firebase from 'firebase/app'
import 'firebase/auth'
import { 
  FIREBASE_APIKEY, 
  FIREBASE_AUTHDOMAIN,
  FIREBASE_PROJECTID,
  FIREBASE_APPID
} from '@env'

if (!firebase.apps.length)
  firebase.initializeApp({ 
    apiKey: FIREBASE_APIKEY, 
    authDomain: FIREBASE_AUTHDOMAIN,
    projectId: FIREBASE_PROJECTID,
    appId: FIREBASE_APPID
  })

firebase.auth().useDeviceLanguage()


export default firebase