import React from 'react'
import { TextInput, StyleSheet } from 'react-native'

export default function UIButton( props ) {
	return (
		<TextInput 
			{ ...props }
			style={ styles.textInput }
		/>
	)
}

const styles = StyleSheet.create({
	textInput: {
		height: 48,
		paddingHorizontal: 16,
		backgroundColor: '#fff', 
		borderRadius: 14, 
		marginBottom: 24,
		borderWidth: 1.5,
		borderColor: '#ccc'
	}
})