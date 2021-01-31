import React, { useRef, useState } from 'react'
import { Text, View, ScrollView, Animated, StyleSheet, ImageBackground } from 'react-native'

import SafeView from '../../components/SafeView'
import { Ionicons } from '@expo/vector-icons'


export default function HomeDetailScreen({ navigation }) {
	// Constants
	const headerHeightMin = 104,
				headerHeightMax = 400,
				headerPosAtFinish = headerHeightMax - headerHeightMin

	// General animation
	const animation = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current
	const animatedHeight = animation.y.interpolate({
		inputRange: [ -500, headerPosAtFinish ],
		outputRange: [ headerHeightMax + 500, headerHeightMin ],
		extrapolate: 'clamp'
	})
	const animatedImageContainerBackgroundColor = animation.y.interpolate({
		inputRange: [ headerPosAtFinish * .75, headerPosAtFinish ],
		outputRange: [ 'transparent', 'rgba(0, 0, 0, .5)' ],
		extrapolate: 'clamp'
	})
	const animatedControlsOpacity = animation.y.interpolate({
		inputRange: [ headerHeightMax * .25, headerHeightMax * .5 ],
		outputRange: [ 1, 0 ],
		extrapolate: 'clamp'
	})
	const animatedTitleOpacity = animation.y.interpolate({
		inputRange: [ headerPosAtFinish + 32, headerPosAtFinish + 72 ],
		outputRange: [ 0, 1 ],
		extrapolate: 'clamp'
	})
	const animatedTitlePosY = animation.y.interpolate({
		inputRange: [ headerPosAtFinish + 32, headerPosAtFinish + 72 ],
		outputRange: [ 20, 0 ],
		extrapolate: 'clamp'
	})
 
	const handleOnScroll = e => {
		let offset = e.nativeEvent.contentOffset.y

		// Set animation y offset value.
		animation.setValue({ x: 0, y: offset })
	}


	return (
		<View>
			<Animated.View style={[ styles.header, { height: animatedHeight } ] }>
				<ImageBackground 
					style={ styles.headerImage }
					source={{ uri: 'https://images.kitchenstories.io/wagtailOriginalImages/R2269-photo-final-1-16x9/R2269-photo-final-1-16x9-large-landscape-150.jpg' }}>
					
					<Animated.View style={[ styles.headerImageContainer, { backgroundColor: animatedImageContainerBackgroundColor } ]}>
						<SafeView style={{ justifyContent: 'space-between' }}>
							<View style={ styles.headerTopBar }>
								<Ionicons name='chevron-back-outline' size={28} color='#fff' />

								<Animated.Text style={[ 
									styles.headerTopBarTitle, 
									{ opacity: animatedTitleOpacity, transform: [{ translateY: animatedTitlePosY }] }
								]}>Recipe Title</Animated.Text>

								<Animated.View style={{ height: 28, width: 80, flexDirection: 'row', justifyContent: 'space-between' }}>
									<Ionicons name='share-outline' size={28} color='#fff' />
									<Ionicons name='heart-outline' size={28} color='#fff' />
								</Animated.View>
							</View>

							<Animated.View style={[ styles.headerControls, { opacity: animatedControlsOpacity } ]} />
						</SafeView>
					</Animated.View>
				</ImageBackground>
			</Animated.View>

			<ScrollView onScroll={ handleOnScroll } scrollEventThrottle={ 16 }>
				<View style={{ marginTop: headerHeightMax }}>
					<Text style={{ fontSize: 24, margin: 24 }}>Recipe Title</Text>
					<ContentComponent />
				</View>
			</ScrollView>
		</View>
	)
}


/**
 * Content
 */
const ContentComponent = () => Array(20).fill(0).map(( _, key ) => (
	<View key={key} style={{ height: 80, backgroundColor: 'lightgrey', margin: 24 }} >
		<Text>Some Content</Text>
	</View>
))


const styles = StyleSheet.create({
	header: {
		backgroundColor: '#16A0BE', 
		position: 'absolute', 
		width: '100%',
		top: 0,
		zIndex: 1
	},
	headerTopBar: { 
		flexDirection: 'row', alignItems: 'center',
		position: 'absolute',
		top: 12,
		width: '100%',
		paddingRight: 24,
		paddingLeft: 8
	},
	headerTopBarTitle: {
		flex: 1,
		color: '#fff',
		fontSize: 18,
		marginLeft: 16,
		fontWeight: 'bold'
	},
	headerImage: {
		flex: 1,
		zIndex: -1,
    resizeMode: "cover",
    justifyContent: "center"
	},
	headerImageContainer: {
		height: '100%',
		width: '100%'
	},
	headerControls: { 
		position: 'absolute',
		bottom: 16,
		height: 40, width: 200, alignSelf: 'center', 
		backgroundColor: '#fff',
		borderRadius: 32
	}
})