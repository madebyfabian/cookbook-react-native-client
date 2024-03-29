import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'

import logger from '../../utils/logger'
import firebase from '../../services/firebase'
import { useAuthStore } from '../../store'
import useStatusBar from '../../hooks/useStatusBar'
import useDidUpdateEffect from '../../hooks/useDidUpdateEffect'
import useAuth from '../../hooks/useAuth';

import { SafeView, TextHeadline, AppButton, AppTextInput } from '../../components'


export default function ProfileScreen({ navigation }) {
	useStatusBar('dark-content')

	const auth = useAuth()

	// Global state
	const user = useAuthStore(state => state.user),
				lastReauthDate = useAuthStore(state => state.lastReauthDate)

	// Local state
	const [ password, setPassword ] = useState(''),
				[ signInOptions, setSignInOptions ] = useState(null),
				[ actionInPipeline, setActionInPipeline ] = useState(null)


	// If lastReauthDate changed, try to complete action that's in pipeline.
	useDidUpdateEffect(() => {
		// logger.log('lastReauthDate change triggered!:', lastReauthDate)

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
		logger.chain.start(`Trying to update ${ user.email }'s password to "${ password }"...`)

		try {
			// Try to update the password without re-authenticating.
			await firebase.auth().currentUser.updatePassword(password)
			logger.chain.end('> Password successfully updated!')

		} catch (error) {
			switch (error.code) {
				case 'auth/weak-password':
					logger.chain.end('Password too weak!')
					break

				case 'auth/requires-recent-login':
					setActionInPipeline('passwordChange')

					// Reauthentication
					auth.doTriggerReAuth()
					logger.chain.end('Triggered reauth.')

					/*navigation.navigate('MagicLinkModal', { 
						email: user.email, 
						callbackPath: callbackPaths.authReAuth 
					})*/

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


	const _test_handleGoogleReauthenticate = async () => {
		auth.doTriggerReAuth()
	}


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


				<TextHeadline size={ 2 } style={{ marginTop: 80 }}>Reauthenticate</TextHeadline>
				<AppButton
					title="Reauthenticate now"
					type="secondary"
					onPress={ _test_handleGoogleReauthenticate }
				/>

				
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