import React from 'react'
import { Pressable, Text, View, SafeAreaView } from 'react-native'

import { useTheme } from "react-native-themed-styles"
import { styleSheetFactory } from "../utils/themes"


export default function TabBar({ state, descriptors, navigation }) {
	const [ styles ] = useTheme(themedStyles)

	/**
	 * Define <Item> Component
	 */
	const Item = ({ isActive, name }) => (
		<Pressable style={ styles.item } onPress={ () => navigation.navigate(name) }>
			<View style={ styles.itemInner }>
				<Text style={ styles.itemText }>{ name }</Text>
				<View style={[ styles.itemDot, ( isActive ? styles.itemDotActive : null ) ]} />
			</View>
		</Pressable>
	)

	return (
		<SafeAreaView style={ styles.view }>
			<View style={ styles.tabBar }>
				<Item name="Home" isActive={ state.index === 0 } />
				<Item name="Profile" isActive={ state.index === 1 } />
			</View>
		</SafeAreaView>
	)
}


const themedStyles = styleSheetFactory(theme => ({
	view: {
		backgroundColor: theme.background.primary,
		borderTopWidth: .5, borderTopColor: '#eee'
	},

	tabBar: {
		position: 'relative',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		paddingHorizontal: 4,
	},

	item: {
		height: 48,
		marginHorizontal: 4,
		flex: 1,
	},
	itemInner: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	itemText: {
		color: theme.content.primary,
	},
	itemDot: {
		marginTop: 4,
		height: 4,
		width: 4,
		borderRadius: 4,
		backgroundColor: theme.content.primary,
		opacity: 0
	},
	itemDotActive: {
		opacity: 1
	}
}))