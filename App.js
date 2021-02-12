import React, { useEffect } from 'react'

import Routes from './routes'
import useHandleAuthCallback from './hooks/useHandleAuthCallback'
import useAuth from './hooks/useAuth'
import { useAuthStore } from './store'


const App = () => {
  // Global auth hook.
  useAuth()


  // Execute routing callbacks.
  const updateLastReauthDate = useAuthStore(state => state.updateLastReauthDate)
  useEffect(() => useHandleAuthCallback({ updateLastReauthDate }), [])
  
  
  return (
    <Routes />
  )
}

export default App 