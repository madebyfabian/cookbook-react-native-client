import React, { useState } from 'react'
import * as Linking from 'expo-linking'
import AsyncStorage, { KEYS } from '../utils/AsyncStorage'

import firebase from '../services/firebase'
import { callbackPaths } from '../utils/constants'


export default async function useHandleAuthCallback() {
	const url = await Linking.getInitialURL()
	if (url)
		_handleUrl({ url })

	Linking.addEventListener('url', _handleUrl)

	return () => Linking.removeEventListener('url', _handleUrl)
}


const _handleUrl = async e => {
	const currUrl = e.url

	// First, check if the current url is any of the PATHS
	const foundPathPair = Object.entries(callbackPaths).find(pair => currUrl.includes(pair[1]))
	if (!foundPathPair)
		return

	console.log(`\n> called useHandleAuthCallback._handleUrl with:\n `, currUrl)

	const callbackPath = foundPathPair[1]

	switch (callbackPath) {
		case callbackPaths.authSignIn: 
		case callbackPaths.authRegister: {
			console.log('> curr url matches the callbackPaths.authSignIn/callbackPaths.authRegister schema')

			const isSignInWithEmailLink = firebase.auth().isSignInWithEmailLink(currUrl)
			if (!isSignInWithEmailLink)
				return console.log('> curr url is not a valid sign in url')

			try {
				const email = await AsyncStorage.getAndRemoveItem(KEYS.auth.email)
				if (!email)
					throw new Error('Cant get email from AsyncStorage!')

				await firebase.auth().signInWithEmailLink(email, currUrl)

				if (callbackPath === callbackPaths.authRegister) 
					firebase.auth().currentUser.updateProfile({ 
						displayName: await AsyncStorage.getAndRemoveItem(KEYS.auth.displayName) 
					})

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
				const email = await AsyncStorage.getAndRemoveItem(KEYS.auth.email)
				if (!email)
					throw new Error('Cant get email from AsyncStorage!')

				const cred = firebase.auth.EmailAuthProvider.credentialWithLink(email, currUrl)

				// Finally, re-authenticate user
				await firebase.auth().currentUser.reauthenticateWithCredential(cred)

				console.log('> Successfully reauthenticated user!')
			} catch (error) {
				console.error(error)
			}

			break
		}
	}
}