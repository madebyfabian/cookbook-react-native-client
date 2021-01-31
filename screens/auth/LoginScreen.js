import React, { useState } from 'react'
import { Text, StyleSheet, View, ScrollView } from 'react-native'
import * as Yup from 'yup'
import * as Linking from 'expo-linking'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { auth } from '../../services/firebase'
import { APP_PATHS } from '../../hooks/useHandleAuthCallback'
import SafeView from '../../components/SafeView'
import AppButton from '../../components/AppButton'
import AppTextInput from '../../components/AppTextInput'
import useAPI from '../../services/api'
import constants from '../../utils/constants'


const validationSchema = Yup.object().shape({
	email: Yup.string().required('Please enter a valid email').email().label('Email')
})

export default function LoginScreen({ navigation }) {
	const [ loginError, setLoginError ] = useState('')
	const [ hideLoginForm, setHideLoginForm ] = useState(false)
	const [ formData, setFormData ] = useState({
		email: ''
	})
	const { BASE_URL } = useAPI()

	const handleOnSignIn = async () => {
		console.log('> handleOnSignIn')
		setLoginError('')

		try {
			await validationSchema.validate(formData)

			// Login with magic link.
			try {
				await auth.sendSignInLinkToEmail(formData.email, {
					handleCodeInApp: true,
					url: BASE_URL + '/auth-app-redirect?redirectUrl=' + encodeURIComponent(Linking.makeUrl(APP_PATHS.authSignInCallback))
				})

				setHideLoginForm(true)

				// Save the email in local storage, to retrieve it when user comes back from email link.
				AsyncStorage.setItem(constants.asyncStorageKeys.auth.email, formData.email)
			} catch (error) {
				setLoginError(error.message)
				setHideLoginForm(false)
			}

			// Login with email + password.
			/* await loginWithEmail(formData.email, formData.password)
				.catch(err => setRegisterError(err.message) )*/
		} catch (error) {
			setLoginError(err.errors.join(',')) 
		}
	}

	return (
		<SafeView style={ styles.container }>
			<AppButton title="⬅️ Back" type="secondary" onPress={ () => navigation.goBack() } />

			<ScrollView>
				<Text style={ styles.headline }>Hej!</Text>
				<Text style={ styles.subheadline }>Login to continue</Text>

				{ !hideLoginForm && (
					<View style={ styles.content }>
						<AppTextInput 
							name="email"
							textContentType="username"
							placeholder="Your email"
							autoCompleteType="email"
							keyboardType="email-address"
							autoCapitalize="none"
							spellCheck={ false }
							autoCorrect={ false }
							value={ formData.email } 
							onChangeText={ text => setFormData({ ...formData, email: text }) }
						/>

						<Text style={ styles.error }>{ loginError }</Text>

						<AppButton title="✨ Login with magic link" type="primary" onPress={ handleOnSignIn } />
					</View>
				) }

				{ hideLoginForm && (
					<Text>A magic link was ✨ sent to your email ({ formData.email }).</Text>
				) }
			</ScrollView>
		</SafeView>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 24,
		paddingVertical: 12
	},
	headline: {
		fontWeight: 'bold',
		fontSize: 42,
		marginBottom: 12,
		marginTop: 32
	},
	subheadline: {
		fontSize: 24,
		opacity: .65
	},
	content: {
		marginVertical: 32
	},
	error: {
		color: 'red'
	}
})