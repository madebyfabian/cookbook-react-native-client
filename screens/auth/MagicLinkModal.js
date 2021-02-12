import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as Linking from 'expo-linking'

import { FIREBASE_FUNCTIONS_BASEURL } from '@env'
import useStatusBar from '../../hooks/useStatusBar'
import { callbackPaths } from '../../utils/constants'
import { AppButton, TextHeadline } from '../../components'
import AsyncStorage, { KEYS } from '../../utils/AsyncStorage'
import firebase from '../../services/firebase'
import logger from '../../utils/logger'


export default function MagicLinkModal({ route, navigation, ...rest }) {
	useStatusBar('light-content')

	const [ isLoading, setIsLoading ] = useState(false)

	const email = route.params?.email,
				callbackPath = route.params?.callbackPath || callbackPaths.authSignIn

	if (!email)
		throw new Error('No email provided.')

	// Send email on modal load.
	useEffect(() => {
		const unsub = navigation.addListener('focus', () => sendEmail())
		return unsub
	}, [ navigation ])

	// Executes a firebase method that sends an email with a magic authentication link.
	// Also stores the email used in the AsyncStorage to access it later in the auth process.
	// This link uses a firebase function that opens the app.
	const sendEmail = async () => {
		logger.chain.start('execute sendEmail() inside MagicLinkModal.js...')

		setIsLoading(true)

		try {
			if (!Object.values(callbackPaths).includes(callbackPath))
				return console.error('Only use a callbackPath from constants.callbackPaths!')

			// Execute the main functionality.
			await firebase.auth().sendSignInLinkToEmail(email, {
				handleCodeInApp: true,
				url: FIREBASE_FUNCTIONS_BASEURL 
					+ '/auth-app-redirect?redirectUrl=' 
					+ encodeURIComponent(Linking.makeUrl(callbackPath))
			})

			// Save the email in local storage, to retrieve it when user comes back from email link.
			await AsyncStorage.setItem(KEYS.auth.email, email)

			logger.chain.end('email successfully sent.')

		} catch (error) {
			console.error(error)
		}

		setIsLoading(false)
	}
	

  return (
		<View style={ styles.container }>
			<TextHeadline>Check' dein E-Mail-Postfach!</TextHeadline>
			<TextHeadline size={ 2 }>
				Wir haben dir einen magischen Link an 
				<Text style={{ fontWeight: 'bold' }}> { email } </Text> 
				gesendet.
			</TextHeadline>
			<TextHeadline size={ 2 }>Tippe auf diesen, um dich anzumelden.</TextHeadline>
			
			<AppButton 
				title="Nicht bekommen? Nochmal senden" 
				onPress={ sendEmail } 
				isLoading={ isLoading }
				style={{ marginTop: 24 }} 
			/>

			<AppButton
				title="Zurück"
				type="secondary"
				onPress={ () => navigation.goBack() }
				style={{ marginTop: 12 }}
			/>
		</View>
  )
}


const styles = StyleSheet.create({
	container: {
		padding: 20
	}
})
