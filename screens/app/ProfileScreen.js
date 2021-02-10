import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import dayjs from 'dayjs'

import logger from '../../utils/logger'
import firebase, { sendSignInLinkToEmail } from '../../services/firebase'
import useStatusBar from '../../hooks/useStatusBar'
import { callbackPaths } from '../../utils/constants'
import { useAuthStore } from '../../store'

import SafeView from '../../components/SafeView'
import TextHeadline from '../../components/TextHeadline'
import AppButton from '../../components/AppButton'
import AppTextInput from '../../components/AppTextInput'


export default function ProfileScreen({ navigation }) {
	useStatusBar('dark-content')

	// Global state
	const user = useAuthStore(state => state.user),
				lastReauthDate = useAuthStore(state => state.lastReauthDate)

	// Local state
	const [ password, setPassword ] = useState(''),
				[ signInOptions, setSignInOptions ] = useState(null),
				[ actionInPipeline, setActionInPipeline ] = useState(null)


	useEffect(() => {
		logger.log('lastReauthDate change triggered!:', { lastReauthDate })

		switch (actionInPipeline) {
			case 'passwordChange':
				handlePasswordChangeSubmit()
				break
		
			default:
				break
		}

		setActionInPipeline(null)

	}, [ lastReauthDate ])


	const handlePasswordChangeSubmit = async () => {
		logger.log(`\n> trying to update ${ user.email }'s password to "${ password }"...`)

		try {
			// Try to update the password without re-authenticating.
			await firebase.auth().currentUser.updatePassword(password)
			logger.log('> Password successfully updated!')

		} catch (error) {
			switch (error.code) {
				case 'auth/weak-password':
					console.warn('Password too weak!')
					break

				case 'auth/requires-recent-login':
					// Send an email with a magic link for re-authentication.
					await sendSignInLinkToEmail(user.email, callbackPaths.authReAuth)
						.catch(error => console.error(error))
					
					setActionInPipeline('passwordChange')
					break

				default:
					console.error(error)
					break
			}
		}
	}


	const getSignInOptions = async () => {
		setSignInOptions(await firebase.auth().fetchSignInMethodsForEmail(user.email))
	}
	useEffect(() => { getSignInOptions() }, [])


	return (
		<SafeView style={ styles.container }>
			<ScrollView>
				<TextHeadline>My profile</TextHeadline>
				<TextHeadline size={ 2 }>{user.email}</TextHeadline>
				
				<AppButton 
					title="Sign Out"
					onPress={ () => firebase.auth().signOut() } 
					style={{ marginTop: 16 }} 
				/>


				<TextHeadline size={ 2 } style={{ marginTop: 80 }}>Your auth providers:</TextHeadline>
				{ signInOptions?.map(( option, key ) => (
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
						value={ password } 
						onChangeText={ text => setPassword(text) }
					/>
					<AppButton 
						title="Set password for my account" 
						type="secondary" 
						onPress={ handlePasswordChangeSubmit } 
						style={{ marginTop: -8 }} 
					/>
				</View>
			</ScrollView>
		</SafeView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20
	}
})