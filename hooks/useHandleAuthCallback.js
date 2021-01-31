import React from 'react'
import * as Linking from 'expo-linking'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { auth } from '../services/firebase'
import constants from '../utils/constants'


export const APP_PATHS = {
	authSignInCallback: '/authCallback/signIn'
}


export default async function useStatusBar(style, animated = true) {
	const url = await Linking.getInitialURL()
	if (url)
		_handleUrl(url)

	Linking.addEventListener('url', ({ url }) => {
		_handleUrl(url)
	})
}


const _handleUrl = async currUrl => {
	// console.log('\n> called useHandleAuthCallback._handleUrl with:\n ', currUrl)

	// First, check if the current url is any of the PATHS
	const foundPathPair = Object.entries(APP_PATHS).find(pair => currUrl.includes(pair[1]))
	if (!foundPathPair)
		return // console.log('> Exiting, since this url does not match any of the defined paths.')

	switch (foundPathPair[1]) {
		case APP_PATHS.authSignInCallback: {
			// console.log('> url matched with APP_PATHS.authSignInCallback!')

			const isSignInWithEmailLink = auth.isSignInWithEmailLink(currUrl)
			if (!isSignInWithEmailLink)
				return // console.log('> curr url is not a valid sign in url')

			try {
				const email = await AsyncStorage.getItem(constants.asyncStorageKeys.auth.email)
				await auth.signInWithEmailLink(email, currUrl)
				// User now automatically gets redirected into the app view.
			} catch (error) {
				console.error(error)
			}

			break
		}
	}
}