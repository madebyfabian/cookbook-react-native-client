import React, { useState } from 'react'
import { StyleSheet, Text, Modal, View } from 'react-native'

import { sendSignInLinkToEmail } from '../../services/firebase'
import useStatusBar from '../../hooks/useStatusBar'
import { callbackPaths } from '../../utils/constants'

import SafeView from '../../components/SafeView'
import TextHeadline from '../../components/TextHeadline'
import AppButton from '../../components/AppButton'


export default function EmailLinkSentModal({ isVisible, email, ...rest }) {
	useStatusBar('light-content')

	const [ isLoading, setIsLoading ] = useState(false)

	const sendEmail = async () => {
		try {
			setIsLoading(true)
			await sendSignInLinkToEmail(email, callbackPaths.authSignIn)
			setIsLoading(false)

		} catch (error) {
			console.error(error)
		}
	}


  return (
		<View>
			<Modal 
				visible={ isVisible } 
				animationType="slide" 
				presentationStyle="formSheet"
				onShow={ sendEmail }>

				<SafeView style={ styles.container }>
					<TextHeadline>Check' dein E-Mail-Postfach!</TextHeadline>
					<TextHeadline size={ 2 }>
						Wir haben dir einen magischen Link an 
						<Text style={{ fontWeight: 'bold' }}> { email } </Text> 
						gesendet.
					</TextHeadline>
					<TextHeadline size={ 2 }>Tippe auf diesen, um dich anzumelden.</TextHeadline>
					
					<AppButton 
						title="Nicht bekommen? Nochmal senden" 
						onPress={ sendEmail } 
						isLoading={ isLoading }
						style={{ marginTop: 24 }} 
					/>
				</SafeView>
			</Modal>
		</View>
  )
}

const styles = StyleSheet.create({
	container: {
		padding: 20
	}
})
