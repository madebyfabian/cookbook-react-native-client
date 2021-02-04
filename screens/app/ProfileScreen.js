import React, { useContext } from 'react'
import { StyleSheet, Text, Button } from 'react-native'

import firebase from '../../services/firebase'
import { AuthUserContext } from '../../navigation/AuthUserProvider'
import SafeView from '../../components/SafeView'


export default function ProfileScreen({ navigation }) {
	const { user } = useContext(AuthUserContext)

	return (
		<SafeView style={ styles.container }>
			<Text>Hej, {user.email}!</Text>
			<Button title="Sign Out" onPress={ () => firebase.auth().signOut() } />
		</SafeView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
})