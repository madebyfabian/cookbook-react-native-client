import React from 'react'
import { StyleSheet, Text, View } from 'react-native'


export default function RecipeCard({ recipe, style, ...rest }) {
  return (
    <View style={[ styles.card, style ]} { ...rest }>
      <Text style={ styles.title }>{ recipe.title }</Text>
			<Text style={ styles.subtitle }>{ recipe.duration } min</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
		margin: 24
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#fff',
		marginBottom: 8
	},
	subtitle: {
		color: '#fff'
	}
})
