import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

import useStatusBar from '../../hooks/useStatusBar'
import AppButton from '../../components/AppButton'


export default function WelcomeScreen({ navigation }) {
	useStatusBar('dark-content')

	return (
		<View style={ styles.container }>
			<View>
				<Text>Expo Firebase Starter</Text>
				<AppButton 
					style={{ backgroundColor: 'green' }}
					title="Login"
					onPress={ () => navigation.navigate('Login') } 
				/>
				<AppButton 
					title="Register"
					type="secondary"
					onPress={ () => navigation.navigate('Register') } 
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
})
