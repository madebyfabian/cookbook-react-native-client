import React, { useState, useRef } from 'react'
import { Text, ScrollView, View, Animated } from 'react-native'
import BottomSheet from 'reanimated-bottom-sheet'

import AppButton from '../../components/AppButton'


export default function FilterModal({ style, screenHeight, ...rest }) {
	const [ scrollEnabled, setScrollEnabled ] = useState(false)

	const sheetRef = useRef(null),
				scrollViewRef = useRef()

	const inputHeight = useRef(new Animated.Value(48)).current,
				inputOpacity = useRef(new Animated.Value(1)).current

	const handleOnOpenStart = () => {
		setScrollEnabled(true)
		Animated.timing(inputHeight, { toValue: 0, duration: 150, useNativeDriver: false }).start()
		Animated.timing(inputOpacity, { toValue: 0, duration: 150, useNativeDriver: false }).start()
	}

	const handleOnCloseStart = () => {
		setScrollEnabled(false)
		scrollViewRef.current.scrollTo({ y: 0 })
		Animated.timing(inputHeight, { toValue: 48, duration: 150, useNativeDriver: false }).start()
		Animated.timing(inputOpacity, { toValue: 1, duration: 150, useNativeDriver: false }).start()
	}


	const renderContent = () => (
    <View>
			<ScrollView 
				style={{ padding: 24, paddingBottom: 96, backgroundColor: '#fff' }}
				scrollEnabled={ scrollEnabled } 
				ref={ scrollViewRef }>

				<Animated.View style={{ height: inputHeight, opacity: inputOpacity }}>
					<AppButton type='secondary' title='Filter' onPress={ () => sheetRef.current.snapTo(0) } />
				</Animated.View>

				<Text style={{ fontSize: 200 }}>Swipe this thing down</Text>
			</ScrollView>

			<View style={{ 
				height: 96, backgroundColor: '#fff', position: 'absolute', zIndex: 1, bottom: 0, width: '100%',
				borderTopWidth: .5, borderTopColor: '#eee',
				paddingHorizontal: 24,
				justifyContent: 'center'
			}}>
				<AppButton
					title="Search"
					onPress={ () => sheetRef.current.snapTo(1) }
				/>
			</View>
		</View>
	)


	return (
		<BottomSheet
			{ ...rest }
			style={[ { }, style ]} 
			ref={ sheetRef }
			snapPoints={[ screenHeight - 88, 96 ]}
			initialSnap={1}
			borderRadius={24}
			enabledContentGestureInteraction={false}
			renderContent={ renderContent }
			onOpenStart={ handleOnOpenStart }
			onCloseStart={ handleOnCloseStart }
		/>
	)
}