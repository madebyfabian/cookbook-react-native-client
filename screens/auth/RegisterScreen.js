import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import * as Yup from 'yup'
import AsyncStorage, { KEYS } from '../../utils/AsyncStorage'

import useStatusBar from '../../hooks/useStatusBar'
import { callbackPaths } from '../../utils/constants'
import { SafeView, AppButton, AppTextInput, TextHeadline } from '../../components'


const validationSchema = Yup.object().shape({
	name: Yup.string().required().label('Name'),
	email: Yup.string().required('Please enter a valid email').email().label('Email')
})

export default function RegisterScreen({ route, navigation }) {
	useStatusBar('light-content')

	const [ registerError, setRegisterError ] = useState(''),
				[ formData, setFormData ] = useState({
					name: '', 
					email: route.params?.email || ''
				})

	const handleOnSignUp = async () => {
		setRegisterError('')

		try {
			await validationSchema.validate(formData)

			// Save "displayName" of user to AsyncStorage to retrieve it later after registering.
			await AsyncStorage.setItem(KEYS.auth.displayName, formData.name)

			// Finally, register user, by showing the modal.
			navigation.navigate('MagicLinkModal', { 
				email: formData.email,  
				callbackPath: callbackPaths.authRegister
			})

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
					placeholder="Dein Spitzname"
					autoCompleteType="name"
					autoFocus={ true }
					autoCorrect={ false }
					spellCheck={ false }
					value={ formData.name } 
					onChangeText={ text => setFormData({ ...formData, name: text }) }
				/>

				<AppTextInput 
					style={ styles.input }
					name="email"
					placeholder="Deine E-Mail"
					autoCompleteType="email"
					keyboardType="email-address"
					autoCapitalize="none"
					spellCheck={ false }
					autoCorrect={ false }
					value={ formData.email } 
					onChangeText={ text => setFormData({ ...formData, email: text }) }
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