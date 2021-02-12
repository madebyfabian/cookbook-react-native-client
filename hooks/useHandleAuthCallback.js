import * as Linking from 'expo-linking'
import AsyncStorage, { KEYS } from '../utils/AsyncStorage'

import firebase from '../services/firebase'
import { callbackPaths } from '../utils/constants'
import logger from '../utils/logger'


export default function useHandleAuthCallback({ updateLastReauthDate }) {
	// logger.chain.start('called useHandleAuthCallback()')

	const handleUrl = async ( currUrl ) => {
		// First, check if the current url is any of the PATHS
		const foundPathPair = Object.entries(callbackPaths).find(pair => currUrl.includes(pair[1]))
		if (!foundPathPair)
			return
	
		// logger.chain.start(`called useHandleAuthCallback._handleUrl with:\n `, currUrl)
	
		const callbackPath = foundPathPair[1]
	
		switch (callbackPath) {
			case callbackPaths.authSignIn: 
			case callbackPaths.authRegister: {
				// logger.chain.add('curr url matches the callbackPaths.authSignIn/callbackPaths.authRegister schema')
	
				const isSignInWithEmailLink = firebase.auth().isSignInWithEmailLink(currUrl)
				if (!isSignInWithEmailLink)
					return // logger.chain.end('curr url is not a valid sign in url')
	
				try {
					const email = await AsyncStorage.getAndRemoveItem(KEYS.auth.email)
					if (!email)
						throw new Error('Cant get email from AsyncStorage!')
	
					await firebase.auth().signInWithEmailLink(email, currUrl)
	
					if (callbackPath === callbackPaths.authRegister) 
						await firebase.auth().currentUser.updateProfile({ 
							displayName: await AsyncStorage.getAndRemoveItem(KEYS.auth.displayName) 
						})

					logger.log('User authenticated!')
	
					// -> User now automatically gets redirected into the app view.
				} catch (error) {
					console.error(error)
				}
	
				break
			}
	
			case callbackPaths.authReAuth: {
				// logger.chain.add('> curr url matches the callbackPaths.authReAuth schema')
	
				try {
					// First, create a credential based on the emailLink & user email
					const email = await AsyncStorage.getAndRemoveItem(KEYS.auth.email)
					if (!email)
						throw new Error('Cant get email from AsyncStorage!')
	
					const cred = firebase.auth.EmailAuthProvider.credentialWithLink(email, currUrl)
	
					// Finally, re-authenticate user
					const { user } = await firebase.auth().currentUser.reauthenticateWithCredential(cred)
					updateLastReauthDate(user?.metadata.b / 1000)
	
					logger.log('User successfully reauthenticated!')

				} catch (error) {
					console.error(error)
				}
	
				break
			}
		}
	}


	// If the URL is set and the app starts freshly
	Linking.getInitialURL()
		.then(url => url && handleUrl(url))

	Linking.addEventListener('url', e => handleUrl(e.url))
	// logger.chain.add('expo-linking\'s "url" event listener added.')

	return () => {
		// logger.chain.end('destroyed useHandleAuthCallback()')
		Linking.removeEventListener('url', handleUrl)
	}
}


