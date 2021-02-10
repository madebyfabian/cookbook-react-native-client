import React, { useEffect } from 'react'

import Routes from './routes'
import useHandleAuthCallback from './hooks/useHandleAuthCallback'
import { useAuthStore } from './store'
import firebase from './services/firebase'
import { useGeneralStore } from './store'


/**
 * Wrap all providers here.
 */
const App = () => {
  const updateAppIsLoading = useGeneralStore(state => state.updateAppIsLoading)

  // Firebase auth subscribe for user changes.
  const updateUser = useAuthStore(state => state.updateUser),
        updateLastReauthDate = useAuthStore(state => state.updateLastReauthDate)


  useEffect(() => {
    const unsubscribeAuth = firebase.auth()
      .onAuthStateChanged(async authUser => {
        updateUser(authUser || null)
        updateAppIsLoading(false)
      })

    return unsubscribeAuth // unsubscribe auth listener on unmount
  }, [])


  useEffect(() => {
    const unsubscribeAuth = firebase.auth()
      .onIdTokenChanged(async authUser => {
        updateLastReauthDate(authUser?.metadata.b / 1000)
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