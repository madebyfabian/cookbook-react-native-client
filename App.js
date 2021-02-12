import React, { useEffect } from 'react'

import Routes, { closeMagicLinkModal } from './routes'
import { useAuthStore, useGeneralStore } from './store'
import { useHandleAuthCallback, useDidUpdateEffect } from './hooks'
import firebase from './services/firebase'


const App = () => {
  const updateAppIsLoading = useGeneralStore(state => state.updateAppIsLoading),
        updateUser = useAuthStore(state => state.updateUser),
        lastReauthDate = useAuthStore(state => state.lastReauthDate),
        updateLastReauthDate = useAuthStore(state => state.updateLastReauthDate)


  // firebase.auth subscribe for user changes.
  useEffect(() => {
    const unsub = firebase.auth().onAuthStateChanged(async authUser => {
      // If the user is now valid, close the MagicLinkModal.
      if (authUser) 
        closeMagicLinkModal()
  
      updateUser(authUser || null)
      updateAppIsLoading(false)
    })

    return unsub
  }, [])


  // Watch lastReauthDate (only when it updates)
  useDidUpdateEffect(() => {
    console.log('lastReauthDate updated to', lastReauthDate)

    // User reauthenticated, so we can close the MagicLinkModal.
    closeMagicLinkModal()
  }, [ lastReauthDate ])


  // Execute routing callbacks.
  useEffect(() => useHandleAuthCallback({ updateLastReauthDate }), [])
  
  
  return (
    <Routes />
  )
}

export default App 