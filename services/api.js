import React, { useContext } from 'react'
import { FIREBASE_FUNCTIONS_BASEURL } from '@env'

import { AuthUserContext } from '../navigation/AuthUserProvider'


export default () => {
	const { user } = useContext(AuthUserContext)


	const _makeRequest = async schema => {
		const url = FIREBASE_FUNCTIONS_BASEURL + '/graphql',
					idToken = await user.getIdToken(),
					headers = { 'Authorization': 'Bearer ' + idToken, 'Content-type': 'application/json' },
					body = JSON.stringify({ query: schema })

		try {
			const res = await fetch(url, { method: 'POST', headers, body })
			const { data } = await res.json()

			return data
		} catch (error) {
			console.error(error)
		}
	}


	/**
	 * Fetches all recipes.
	 */
	const getRecipes = async () => {
		return await _makeRequest(`
			query {
				getRecipes {
					_id
					title
					duration
					createdAt
				}
			}
		`)
	}


	return {
		getRecipes 
	}
}