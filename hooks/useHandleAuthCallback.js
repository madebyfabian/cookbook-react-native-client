import React, { useState } from 'react'
import * as Linking from 'expo-linking'
import AsyncStorage from '@react-native-async-storage/async-storage'

import firebase from '../services/firebase'
import { callbackPaths, asyncStorageKeys } from '../utils/constants'


export default async function useHandleAuthCallback(style, animated = true) {
	console.log('> useHandleAuthCallback() called.')

	const url = await Linking.getInitialURL()
	if (url)
		_handleUrl({ url })

	Linking.addEventListener('url', _handleUrl)
}

export const useReauthState = () => {
	const [ reauthDone, setReauthDone ] = useState(false)
	return { reauthDone, setReauthDone }
}


const _handleUrl = async e => {
	const currUrl = e.url

	console.log(`\n> called useHandleAuthCallback._handleUrl with:\n `, currUrl)

	// First, check if the current url is any of the PATHS
	const foundPathPair = Object.entries(callbackPaths).find(pair => currUrl.includes(pair[1]))
	if (!foundPathPair)
		return console.log('  Exiting, url does not match any of the defined paths.\n\n')

	switch (foundPathPair[1]) {
		case callbackPaths.authSignIn: {
			console.log('> curr url matches the callbackPaths.authSignIn schema')

			const isSignInWithEmailLink = firebase.auth().isSignInWithEmailLink(currUrl)
			if (!isSignInWithEmailLink)
				return console.log('> curr url is not a valid sign in url')

			try {
				const email = await _getAndRemoveAsyncStorageEmail()

				// Finally, sign in with email and url
				await firebase.auth().signInWithEmailLink(email, currUrl)

				// -> User now automatically gets redirected into the app view.
			} catch (error) {
				console.error(error)
			}

			break
		}

		case callbackPaths.authReAuth: {
			console.log('> curr url matches the callbackPaths.authReAuth schema')

			try {
				// First, create a credential based on the emailLink & user email
				const email = await _getAndRemoveAsyncStorageEmail()
				if (!email)
					throw new Error('Cant get email from AsyncStorage!')

				const cred = firebase.auth.EmailAuthProvider.credentialWithLink(email, currUrl)

				// Finally, re-authenticate user
				await firebase.auth().currentUser.reauthenticateWithCredential(cred)

				// Update the state.
				const { setReauthDone } = useReauthState()
				setReauthDone(true)

				console.log('> Successfully reauthenticated user!')
			} catch (error) {
				console.error(error)
			}

			break
		}
	}
}


const _getAndRemoveAsyncStorageEmail = async () => {
	let email = await AsyncStorage.getItem(asyncStorageKeys.auth.email)
	
	// Remove the email from the AsyncStorage after we got it as a variable.
	// await AsyncStorage.removeItem(asyncStorageKeys.auth.email)

	return email
}