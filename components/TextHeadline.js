import React from 'react'
import { Text, StyleSheet } from 'react-native'


export default function TextHeadline({ size = 1, children }, ...rest ) {
  return (
    <Text style={[ styles.headline, styles[ `headline_${ size }` ] ]}>
			{ children }
		</Text>
  )
}

const styles = StyleSheet.create({
  headline: {
		marginBottom: 12
	},

	headline_1: {
		fontSize: 40,
		marginTop: 32,
		letterSpacing: -1,
		fontWeight: '800'
	},

	headline_2: {
		fontSize: 24,
		opacity: .65,
		fontWeight: '300'
	}
})
