import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import * as Yup from 'yup'

import firebase from '../../services/firebase'
import useStatusBar from '../../hooks/useStatusBar'

import SafeView from '../../components/SafeView'
import AppButton from '../../components/AppButton'
import AppTextInput from '../../components/AppTextInput'
import TextHeadline from '../../components/TextHeadline'


const validationSchema = Yup.object().shape({
	name: Yup.string().required().label('Name'),
	email: Yup.string().required('Please enter a valid email').email().label('Email'),
	password: Yup.string().required().min(6, 'Password must have at least 6 characters').label('Password'),
	confirmPassword: Yup.string().oneOf([ Yup.ref('password') ], 'Confirm Password must match Password').required()
})

export default function RegisterScreen({ navigation }) {
	useStatusBar('light-content')

	const [ registerError, setRegisterError ] = useState('')
	const [ formData, setFormData ] = useState({
		name: '', 
		email: '', 
		password: '', 
		confirmPassword: ''
	})

	const handleOnSignUp = async () => {
		try {
			setRegisterError('')
			await validationSchema.validate(formData)

			// Register user.
			firebase.auth()
				.createUserWithEmailAndPassword(formData.email, formData.password)
				.catch(err => setRegisterError(err.message))
		} catch (err) { 
			setRegisterError(err.errors.join(',')) 
		}
	}

	return (
		<SafeView style={ styles.container }>
			<TextHeadline>Willkommen!</TextHeadline>
			<TextHeadline size={ 2 }>Erstelle einen neuen Account.</TextHeadline>

			<View style={ styles.inner }>
				<AppTextInput 
					style={ styles.input }
					name="name"
					placeholder="Enter name"
					autoCompleteType="name"
					autoFocus={ true }
					value={ formData.name } 
					onChangeText={ text => setFormData({ ...formData, name: text }) }
				/>

				<AppTextInput 
					style={ styles.input }
					name="email"
					placeholder="Enter email"
					autoCompleteType="email"
					keyboardType="email-address"
					autoCapitalize="none"
					spellCheck={ false }
					autoCorrect={ false }
					value={ formData.email } 
					onChangeText={ text => setFormData({ ...formData, email: text }) }
				/>

				<AppTextInput 
					style={ styles.input }
					name="password"
					placeholder="Enter password"
					autoCapitalize="none"
					autoCorrect={ false }
					autoCompleteType="password"
					value={ formData.password } 
					onChangeText={ text => setFormData({ ...formData, password: text }) }
				/>

				<AppTextInput 	
					style={ styles.input }
					name="password"
					placeholder="Confirm password"
					autoCapitalize="none"
					autoCorrect={ false }
					autoCompleteType="password"
					value={ formData.confirmPassword } 
					onChangeText={ text => setFormData({ ...formData, confirmPassword: text }) }
				/>

				<Text style={ styles.error }>{ registerError }</Text>

				<AppButton title="Register" onPress={ handleOnSignUp } />
			</View>
		</SafeView>
	)
}

const styles = StyleSheet.create({
	container: {
    padding: 15
  },
	inner: {
		flex: 1,
		justifyContent: 'center',
	},
  error: {
		color: 'red'
	},
	input: { padding: 15, backgroundColor: 'white', borderRadius: 12, marginBottom: 24 }
})