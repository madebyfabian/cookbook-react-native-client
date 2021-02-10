import React, { useEffect } from 'react'

import Routes, { getCurrentRouteName, goBack } from './routes'
import useHandleAuthCallback from './hooks/useHandleAuthCallback'
import { useAuthStore } from './store'
import firebase from './services/firebase'
import { useGeneralStore } from './store'


/**
 * Wrap all providers here.
 */
const App = () => {
  const updateAppIsLoading = useGeneralStore(state => state.updateAppIsLoading),
        updateUser = useAuthStore(state => state.updateUser)

  // Firebase auth subscribe for user changes.
  useEffect(() => {
    const unsub = firebase.auth().onAuthStateChanged(async authUser => {
      if (authUser && getCurrentRouteName() === 'MagicLinkModal')
        goBack()
  
      updateUser(authUser || null)
      updateAppIsLoading(false)
    })

    return unsub
  }, [])

  // Execute routing callbacks.
  useEffect(useHandleAuthCallback, [])
  
  
  return (
    <Routes />
  )
}

export default App 