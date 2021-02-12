import React, { useState } from 'react'
import { Text, StyleSheet, View, ScrollView } from 'react-native'
import * as Yup from 'yup'

import firebase from '../../services/firebase'
import { SafeView, AppButton, AppTextInput, TextHeadline } from '../../components'


const validationSchema = Yup.object().shape({
	email: Yup.string().email().label('Email'),
	password: Yup.string().label('Password')
})

export default function LoginScreen({ route, navigation }) {
	const [ loginError, setLoginError ] = useState('')
	const [ formData, setFormData ] = useState({ email: route.params.email, password: '' })


	const doSignInWithMagicLink = async () => {
		const inputsValid = await validateInputs()
		if (!inputsValid)
			return

		navigation.navigate('MagicLinkModal', {
			email: formData.email
		})	
	}

	const doSignInWithPassword = async () => {
		const inputsValid = await validateInputs()
		if (!inputsValid)
			return

		firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)
			.catch(err => setLoginError(err.message) )
	}

	const validateInputs = async () => {
		setLoginError('')
		
		try {
			await validationSchema.validate(formData)
			return true
		} catch (err) {
			setLoginError(err.errors.join(',')) 
			return false
		}
	}


	return (
		<SafeView style={ styles.container }>
			<TextHeadline>Willkommen zurück!</TextHeadline>

			<View style={ styles.content }>
				<AppButton 
					title="✨ Mit magischem Anmeldelink anmelden" 
					type="primary" 
					onPress={ doSignInWithMagicLink } 
				/>

				<Text style={ styles.seperator }>oder</Text>

				<AppTextInput 
					name="password"
					placeholder="Dein Passwort"
					autoCompleteType="password"
					autoCapitalize="none"
					autoCorrect={ false }
					value={ formData.password } 
					onChangeText={ text => setFormData({ ...formData, password: text }) }
				/>
				
				<AppButton 
					title="Mit Passwort anmelden" 
					type="secondary"
					onPress={ doSignInWithPassword }
				/>

				<Text style={ styles.error }>{ loginError }</Text>
			</View>
		</SafeView>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 24,
		paddingVertical: 12
	},
	content: {
		marginVertical: 32
	},
	seperator: {
		marginVertical: 40,
		textAlign: 'center',
		opacity: .5
	},
	error: {
		color: 'red'
	}
})