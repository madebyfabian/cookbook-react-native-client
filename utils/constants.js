export const asyncStorageKeys = {
	auth: {
		email: 'authEmail'
	}
}

export const callbackPaths = {
	authSignIn: '/authCallback/signIn',
	authReAuth: '/authCallback/reAuth'
}


export default {
	asyncStorageKeys,
	callbackPaths
}