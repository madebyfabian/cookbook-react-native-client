import React, { useEffect } from 'react'

import Routes from './routes'
import useHandleAuthCallback from './hooks/useHandleAuthCallback'
import { useAuthStore } from './store'
import firebase from './services/firebase'


/**
 * Wrap all providers here.
 */
const App = () => {
  // Firebase auth subscribe for user changes.
  const updateUser = useAuthStore(state => state.updateUser)

  useEffect(() => {
    const unsubscribeAuth = firebase.auth().onAuthStateChanged(async authUser => {
      try {
        await (authUser ? updateUser(authUser) : updateUser(null))
      } catch (error) {
        console.error(error)
      }
    })

    return unsubscribeAuth // unsubscribe auth listener on unmount
  }, [])


  // Execute routing callbacks.
  useEffect(() => {
    useHandleAuthCallback()
  }, [])


  return (
    <Routes />
  )
}

export default App 