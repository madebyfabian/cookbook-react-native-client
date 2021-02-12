import React, { useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import * as Yup from 'yup'

import useStatusBar from '../../hooks/useStatusBar'
import useAuth from '../../hooks/useAuth'
import firebase from '../../services/firebase'
import { SafeView, AppButton, AppTextInput, TextHeadline } from '../../components'


const validationSchema = Yup.object().shape({
	email: Yup.string().required('Please enter a valid email').email().label('Email')
})

export default function WelcomeScreen({ navigation }) {
	useStatusBar('dark-content')

	const auth = useAuth()

	const [ formData, setFormData ] = useState({ email: '' }),
				[ isLoading, setIsLoading ] = useState(false)

	const handleOnEmailContinue = async () => {
		try {
			await validationSchema.validate(formData)

			// Check sign in methods for this email.
			setIsLoading(true)
			const methods = await firebase.auth().fetchSignInMethodsForEmail(formData.email)
			setIsLoading(false)

			// If there is no user with this email.
			if (!methods.length)
				return navigation.navigate('Register', { email: formData.email })
			
			// If the user has ONLY email link sign in.
			if (methods.length === 1 && methods[0] === firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD)
				return navigation.navigate('MagicLinkModal', { 
					email: formData.email
				})
			
			// User has email link + other auth methods activated.
			return navigation.navigate('Login', { email: formData.email, signInOptions: methods })

		} catch (err) {
			console.error(err)
		}
	}

	const handleOnGoogleContinue = async () => {
		try {
			await auth.doAuthWithGoogle()
		} catch (error) {
			console.error(error)
		}
	}

	
	return (
		<View style={ styles.container }>
			<SafeView>
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

					<AppButton 
						title="Weiter mit Google" type="secondary"
						onPress={ handleOnGoogleContinue } 
					/>
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
	}
})
