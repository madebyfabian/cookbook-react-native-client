import React, { useEffect } from 'react'

import Routes, { closeMagicLinkModal } from './routes'
import { useAuthStore } from './store'
import useHandleAuthCallback from './hooks/useHandleAuthCallback'
import useDidUpdateEffect from './hooks/useDidUpdateEffect'
import useAuth from './hooks/useAuth'


const App = () => {
  useAuth()

  // Watch lastReauthDate (only when it updates)
  const lastReauthDate = useAuthStore(state => state.lastReauthDate),
        updateLastReauthDate = useAuthStore(state => state.updateLastReauthDate)

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