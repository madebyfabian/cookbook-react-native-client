import React, { useEffect } from 'react'
import Routes from './routes'
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
    <Routes />
  )
}

export default App 