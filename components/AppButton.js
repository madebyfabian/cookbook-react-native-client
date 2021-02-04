import React from 'react'
import { TouchableHighlight, StyleSheet, Text } from 'react-native'

import Spinner from './Spinner'


export default function UIButton({ 
	title,
	type = 'primary',
	isLoading = false,
	style,
	onPress
}) {
	let stylesArr = [ styles.button ],
			labelStyleArr = [ styles.label ],
			underlayColor = '#007aff'

	switch (type) {
		case 'primary': 
			stylesArr.push(styles.buttonPrimary)
			break

		case 'secondary': 
			stylesArr.push(styles.buttonSecondary)
			labelStyleArr.push(styles.labelSecondary)
			underlayColor = 'transparent'
			break;
	}

	return (
		<TouchableHighlight 
			title={ title }
			style={[ ...stylesArr, style ]}
			onPress={ onPress }
			underlayColor={ underlayColor }
			activeOpacity={ .65 }
		>
			{ isLoading
				? <Spinner color={ type === 'primary' ? '#fff' : '#555' } /> 
				: <Text style={ labelStyleArr }>{ title }</Text>
			}
		</TouchableHighlight>
	)
}

const styles = StyleSheet.create({
	button: {
		height: 48,
		paddingHorizontal: 16,
		borderRadius: 14,
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonPrimary: {
		backgroundColor: '#007aff',
	},
	buttonSecondary: {
		backgroundColor: '#fff',
		borderWidth: 1.5,
		borderColor: '#ccc'
	},

	label: {
		fontSize: 14,
		fontWeight: 'bold',
		textAlign: 'center',
		color: '#fff',
	},
	labelSecondary: {
		color: '#555'
	}
})