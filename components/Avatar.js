import React from 'react'
import { StyleSheet, Text, View } from 'react-native'


export default function Avatar({ user, style, ...rest }) {
	const generateInitials = name => 
		name.split(' ').map(word => word.split('')[0])

  return (
    <View style={[ styles.avatar, (style && style) ]} { ...rest }>
      <Text>{ generateInitials(user.displayName) }</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
		alignItems: 'center',
		height: 40,
		width: 40,
		borderRadius: 40,
		backgroundColor: '#ccc'
  }
})
