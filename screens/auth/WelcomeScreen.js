import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import * as Yup from 'yup'

import firebase from '../../services/firebase'
import useStatusBar from '../../hooks/useStatusBar'

import SafeView from '../../components/SafeView'
import AppTextInput from '../../components/AppTextInput'
import AppButton from '../../components/AppButton'
import TextHeadline from '../../components/TextHeadline'
import EmailLinkSentModal from '../../components/Auth/EmailLinkSentModal'


const validationSchema = Yup.object().shape({
	email: Yup.string().required('Please enter a valid email').email().label('Email')
})

export default function WelcomeScreen({ navigation }) {
	useStatusBar('dark-content')

	const [ formData, setFormData ] = useState({ email: '' }),
				[ shouldSendEmailLink, setShouldSendEmailLink ] = useState(false),
				[ isLoading, setIsLoading ] = useState(false)

	const handleOnEmailContinue = async () => {
		try {
			await validationSchema.validate(formData)

			// Check sign in methods for this email.
			setIsLoading(true)
			const signInOptions = await firebase.auth().fetchSignInMethodsForEmail(formData.email)
			console.log(signInOptions)
			setIsLoading(false)

			if (!signInOptions.length)
				// There is no user with this email.
				return navigation.navigate('Register', { email: formData.email })

			if (signInOptions.length === 1) {
				if (signInOptions[0] === firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD)
					// User has ONLY email link sign in.
					return setShouldSendEmailLink(true)

				if (signInOptions[0] === firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD)
					// User has ONLY set a password.
					return navigation.navigate('Login', { email: formData.email, signInOptions })

				console.warn('This account is missing a sign in method. It has:', signInOptions)
			}
			

		} catch (err) {
			console.error(err)
		}
	}


	return (
		<View style={ styles.container }>
			<EmailLinkSentModal isVisible={ shouldSendEmailLink } />

			<SafeView >
				<TextHeadline>Hej!</TextHeadline>
				<TextHeadline size={ 2 }>Willkommen auf Cookit!</TextHeadline>
				
				<View style={ styles.inner }>
					<AppTextInput 
						name="email"
						textContentType="username"
						placeholder="Deine E-Mail-Adresse"
						autoCompleteType="email"
						keyboardType="email-address"
						autoCapitalize="none"
						spellCheck={ false }
						autoCorrect={ false }
						value={ formData.email } 
						onChangeText={ text => setFormData({ ...formData, email: text }) }
					/>

					<AppButton isLoading={ isLoading } title="Weiter mit E-Mail" onPress={ handleOnEmailContinue } />

					<Text style={ styles.seperator }>oder</Text>

					<AppButton style={ styles.button } title="Weiter mit Google" type="secondary" />
					<AppButton style={ styles.button } title="Weiter mit Apple" type="secondary" />
					<AppButton style={ styles.button } title="Weiter mit TikTok" type="secondary" />
				</View>
			</SafeView>
		</View>
		
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20
	},
	inner: {
		flex: 1,
		justifyContent: 'center'
	},
	seperator: {
		marginVertical: 40,
		textAlign: 'center',
		opacity: .5
	},
	button: {
		marginVertical: 8
	}
})
