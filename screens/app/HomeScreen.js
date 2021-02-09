import React, { useState, useEffect } from 'react'
import { Pressable, View, StyleSheet, Text, Button } from 'react-native'
import ViewPager from '@react-native-community/viewpager'

import useStatusBar from '../../hooks/useStatusBar'
import useAPI from '../../services/api'
import SafeView from '../../components/SafeView'
import Avatar from '../../components/Avatar'
import RecipeCard from '../../components/HomeScreen/RecipeCard'
import FilterModal from '../../components/HomeScreen/FilterModal'
import { useAuthStore } from '../../store'


export default function HomeScreen({ navigation }) {
	useStatusBar('light-content')

	const user = useAuthStore(state => state.user),
				{ getRecipes } = useAPI()

	const [ screenHeight, setScreenHeight ] = useState(),
				[ recipes, setRecipes ] = useState([])


	// Fetch recipes on load.
	useEffect(() => {
		getRecipes()
			.then(result => setRecipes(result.getRecipes))
			.catch(err => console.error(err))
	}, [])


	const handleLayoutChange = e => {
		if (!screenHeight)
			setScreenHeight(e.nativeEvent.layout.height)
	}


	return (
		<View 
			onLayout={ e => handleLayoutChange(e) } 
			style={ styles.screen }>

			<ViewPager
				style={{ flex: 1, marginBottom: 88 - 24 }}
				orientation='vertical'
				initialPage={ 0 }>

				{ recipes && recipes.map((item, key) => (
					<View 
						key={ item._id }
						style={ styles.slideContainer, { 
							backgroundColor: `rgb(${key * 100}, 100, 200)`
						} }>

						<SafeView>
							<RecipeCard recipe={ item } style={ styles.recipeCard } />
						</SafeView>
					</View>
				)) }
			</ViewPager>

			{ screenHeight && (
				<FilterModal screenHeight={ screenHeight } />
			) }

			<View style={ styles.topBarContainer }>
				<SafeView style={ styles.topBar }>
					<Text style={ styles.topBarTitle }>Hallo, Fabian!</Text>
					<Button title="Open detail" onPress={ () => navigation.navigate('HomeDetail') } />
					<Pressable onPress={ () => navigation.navigate('Profile') }>
						<Avatar user={ user } style={ styles.avatar } />
					</Pressable>
				</SafeView>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	screen: {
		height: '100%',
		backgroundColor: '#000'
	},

	slideContainer: {
		justifyContent: 'flex-end'
	},

	topBarContainer: {
		width: '100%',
		paddingHorizontal: 24,
		position: 'absolute',
		zIndex: 1,
	},
	topBar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 12
	},
	topBarTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#fff'
	},

	recipeCard: {
		position: 'absolute',
		bottom: 32
	}
})