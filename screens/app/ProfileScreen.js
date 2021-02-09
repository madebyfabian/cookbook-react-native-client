import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'

import firebase, { sendSignInLinkToEmail } from '../../services/firebase'
import useStatusBar from '../../hooks/useStatusBar'
import { callbackPaths } from '../../utils/constants'
import { useAuthStore } from '../../utils/store'

import SafeView from '../../components/SafeView'
import TextHeadline from '../../components/TextHeadline'
import AppButton from '../../components/AppButton'
import AppTextInput from '../../components/AppTextInput'
import { useReauthState } from '../../hooks/useHandleAuthCallback'


export default function ProfileScreen({ navigation }) {
	useStatusBar('dark-content')

	const user = useAuthStore(state => state.user),
				{ reauthDone, setReauthDone } = useReauthState()

	const [ pw, setPw ] = useState(''),
				[ signInOptions, setSignInOptions ] = useState(null)

	const getSignInOptions = async () => {
		setSignInOptions(await firebase.auth().fetchSignInMethodsForEmail(user.email))
	}
	useEffect(() => { getSignInOptions() }, [])


	const handlePasswordChangeSubmit = async () => {
		console.log(`> trying to update ${ user.email }'s password to "${ pw }"...`)

		if (!reauthDone)
			// Send an email with a magic link for re-authentication.
			return sendSignInLinkToEmail(user.email, callbackPaths.authReAuth)
							.catch(error => console.error(error))

		try {
			await firebase.auth().currentUser.updatePassword(pw)
			console.log('Password successfully updated!')
			setReauthDone(false)

		} catch (error) {
			switch (error.code) {
				case 'auth/weak-password':
					console.warn('Password too weak!')
					break

				default:
					console.error(error)
					break
			}
		}
	}
	//useDidUpdateEffect(() => { handlePasswordChangeSubmit() }, [ reauthDone ])


	return (
		<SafeView style={ styles.container }>
			<TextHeadline>My profile</TextHeadline>
			<TextHeadline size={ 2 }>{user.email}</TextHeadline>
			
			<AppButton 
				title="Sign Out"
				onPress={ () => firebase.auth().signOut() } 
				style={{ marginTop: 16 }} 
			/>


			<TextHeadline size={ 2 } style={{ marginTop: 80 }}>Your auth providers:</TextHeadline>
			{ signInOptions && signInOptions.map(( option, key ) => (
				<Text key={ key }>- {option}</Text>
			)) }

			
			<TextHeadline size={ 2 } style={{ marginTop: 80 }}>Update/set password:</TextHeadline>
			<View>
				<AppTextInput 
					name="password"
					placeholder="Enter password"
					autoCapitalize="none"
					autoCorrect={ false }
					autoCompleteType="password"
					value={ pw } 
					onChangeText={ text => setPw(text) }
				/>
				<AppButton 
					title="Set password for my account" 
					type="secondary" 
					onPress={ handlePasswordChangeSubmit } 
					style={{ marginTop: -8 }} 
				/>
			</View>

		</SafeView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20
	}
})