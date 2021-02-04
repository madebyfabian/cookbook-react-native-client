import React from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

import SafeView from './SafeView'

export default function Spinner({ size = 'small', color = '#222' }) {
  return (
    <SafeView style={ styles.container }>
      <ActivityIndicator size="small" size={ size } color={ color } />
    </SafeView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
