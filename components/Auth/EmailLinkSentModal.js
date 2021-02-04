import React, { useState } from 'react'
import { StyleSheet, Text, Modal, View } from 'react-native'
import * as Linking from 'expo-linking'
import AsyncStorage from '@react-native-async-storage/async-storage'

import firebase from '../../services/firebase'
import useStatusBar from '../../hooks/useStatusBar'
import { APP_PATHS } from '../../hooks/useHandleAuthCallback'
import constants from '../../utils/constants'

import SafeView from '../../components/SafeView'
import TextHeadline from '../../components/TextHeadline'
import AppButton from '../../components/AppButton'


export default function EmailLinkSentModal({ isVisible, ...rest }) {
	useStatusBar('light-content')

	const [ email ] = useState(''),
				[ isLoading, setIsLoading ] = useState(false)

	const sendEmail = async () => {
		try {
			console.log('> Sending signInLink email...')

			setIsLoading(true)

			const baseURL = process.env.REACT_NATIVE_FIREBASE_FUNCTIONS_BASEURL
			await firebase.auth().sendSignInLinkToEmail(email, {
				handleCodeInApp: true,
				url: baseURL + '/auth-app-redirect?redirectUrl=' + encodeURIComponent(Linking.makeUrl(APP_PATHS.authSignInCallback))
			})

			// Save the email in local storage, to retrieve it when user comes back from email link.
			AsyncStorage.setItem(constants.asyncStorageKeys.auth.email, email)

			setIsLoading(false)

		} catch (error) {
			console.error(error)
		}
	}


  return (
		<View>
			<Modal 
				visible={ isVisible } 
				animationType="slide" 
				presentationStyle="formSheet"
				onShow={ sendEmail }>

				<SafeView style={ styles.container }>
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
				</SafeView>
			</Modal>
		</View>
  )
}

const styles = StyleSheet.create({
	container: {
		padding: 20
	}
})
