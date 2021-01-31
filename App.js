import React, { useEffect } from 'react';
import { AuthUserProvider } from './navigation/AuthUserProvider'
import Routes from './navigation/Routes'
import useHandleAuthCallback from './hooks/useHandleAuthCallback'

/**
 * Wrap all providers here.
 */
const App = () => {
  // Get's executed on app load.
  useEffect(() => {
    useHandleAuthCallback()
  }, [])

  return (
    <AuthUserProvider>
      <Routes />
    </AuthUserProvider>
  )
}

export default App 