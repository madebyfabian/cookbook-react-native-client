import React, { useEffect, useMemo } from 'react'
import * as AppAuth from 'expo-app-auth'
import Constants from 'expo-constants'
import { FIREBASE_IOS_DEV_CLIENTID, FIREBASE_IOS_PROD_CLIENTID } from '@env'

import useRouterUtils from '../hooks/useRouterUtils'
import logger from '../utils/logger'
import firebase from '../services/firebase'
import AsyncStorage, { KEYS } from '../utils/AsyncStorage'
import { useAuthStore, useGeneralStore } from '../store'



/**
 * Global hook for all out authentication needs.
 */
export default function useAuth() {
	const { closeMagicLinkModal } = useRouterUtils()


	const updateAppIsLoading = useGeneralStore(state => state.updateAppIsLoading),
        updateUser = useAuthStore(state => state.updateUser)
				
  useEffect(() => {
    const unsub = firebase.auth().onAuthStateChanged(async authUser => {
      // If the user is now valid, close the MagicLinkModal.
      if (authUser) 
        closeMagicLinkModal()
  
      updateUser(authUser || null)
      updateAppIsLoading(false)
    })

    return unsub
  }, [])
	


	// Watch lastReauthDate (only when it updates)
  const lastReauthDate = useAuthStore(state => state.lastReauthDate),
        updateLastReauthDate = useAuthStore(state => state.updateLastReauthDate)

  useEffect(() => {
    console.log('lastReauthDate updated to', lastReauthDate)

    // User reauthenticated, so we can close the MagicLinkModal.
    closeMagicLinkModal()

  }, [ lastReauthDate ])



	return useMemo(() => ({
		// Data
		PROVIDERS,
	
		// Functions
		doAuthWithGoogle,
		doTriggerReAuth: () => doTriggerReAuth({ updateLastReauthDate })
	}))
}



/**
 * List of supported providers.
 */
const PROVIDERS = {
	google: {
		id: firebase.auth.GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
		oAuthUrl: 'https://accounts.google.com'
	},
	emailLink: {
		id: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
	}
}


/**
 * Authenticate with Google as provider.
 */
const doAuthWithGoogle = async () => {
	const result = await AppAuth.authAsync(_generateAuthOptions({ provider: PROVIDERS.google.oAuthUrl }))
	await _asyncCacheAppAuthState(result)

	logger.chain.start('doAuthWithGoogle():', result)

	await firebase.auth().signInWithCredential(
		firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken))

	logger.chain.end('Authentication with Google provider done!')
	// -> User get's redirected into the app, when login was successful.
}


/**
 * Triggers a reauthentication, the provider which will be used 
 * depends on the user's activated providers.
 */
const doTriggerReAuth = ({ updateLastReauthDate }) => {
	const { providerId } = _currUserPreferredAuthProvider()

	console.log(`doTriggerReAuth with "${providerId}" as provider.`)
	
	try {
		if (providerId === PROVIDERS.google.id)
			_doReAuthWithGoogle({ updateLastReauthDate })

	} catch (error) {
		logger.error(error)
	}
}



// --------- PRIVATE ----------


/**
 * @private
 * Re-Authenticate with Google as provider.
 */
const _doReAuthWithGoogle = async ({ updateLastReauthDate }) => {
	logger.chain.start('doReAuthWithGoogle()')

	// First get cached AppAuth result (bcs. we need the "refreshToken").
	const cachedResult = await _asyncGetCacheAppAuthState()
	if (!cachedResult?.refreshToken)
		return doAuthWithGoogle()

	// Then, refresh authentication with "refreshToken".
	const options = _generateAuthOptions({ provider: PROVIDERS.google.oAuthUrl })
	const result = await AppAuth.refreshAsync(options, cachedResult.refreshToken)
	await _asyncCacheAppAuthState(result)

	logger.chain.add('result:', result)

	// Finally, reauthenticate with Google.
	const { user } = await firebase.auth().currentUser.reauthenticateWithCredential(
		firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken))

	// Update state.
	updateLastReauthDate(user?.metadata.b / 1000)

	logger.chain.end('Reauthentication with Google provider done!')
}


/**
 * @private
 * @param {string} options.provider Name of provider
 * @param {string[]} options.scopes Array of string with the requested scopes.
 * @returns The options object.
 */
const _generateAuthOptions = ({ provider, scopes = [ 'profile', 'openid', 'email' ] }) => {
	/** @todo Add missing 2 Android Client IDs (DEV/PROD) from Firebase. */
	const clientId = Constants.appOwnership === 'expo' 
		? FIREBASE_IOS_DEV_CLIENTID 
		: FIREBASE_IOS_PROD_CLIENTID

	return { issuer: provider, clientId, scopes }
}


/**
 * Returns the preferred auth method of the current user.
 * Currently, this only decides whether he/she has an oAuth social login or not.
 * @todo: Consider storing a "favourite sign in" setting, which the user can change.
 */
const _currUserPreferredAuthProvider = () => {
	const providers = firebase.auth().currentUser.providerData

	// Check if user has one of our supported providers.
	const socialProvider = providers.find(provider => {
		if (provider.providerId === PROVIDERS.google.id) return true
	})

	if (socialProvider)
		return socialProvider

	// If there is no social provider
	return providers.find(provider => provider.providerId === PROVIDERS.emailLink.id)
}


/**
 * Cache into AsyncStorage to reuse the tokens later on.
 * @private
 * @param {object} state The exact object that AppAuth.authAsync() returns
 */
const _asyncCacheAppAuthState = async state => 
	await AsyncStorage.setItem(KEYS.auth.expoAppAuthState, JSON.stringify(state))

const _asyncGetCacheAppAuthState = async () => 
	JSON.parse(await AsyncStorage.getItem(KEYS.auth.expoAppAuthState) || null)