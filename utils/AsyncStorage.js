import AsyncStorage from '@react-native-async-storage/async-storage'


/**
 * AsyncStorage Keys
 */
export const KEYS = {
	auth: {
		email: '@auth.email',
		displayName: '@auth.displayName',
	}
}

/**
 * @returns The value for the given key and then removes it from AsyncStorage.
 */
export const getAndRemoveItem = async ( key ) => {
	let value = await AsyncStorage.getItem(key)
	await AsyncStorage.removeItem(key)
	return value
}


export default {
	...AsyncStorage,
	getAndRemoveItem,
	KEYS
}