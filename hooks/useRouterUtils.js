import { createRef } from 'react'


/**
 * A ref + helper-functions that can be used outside of a Screen/Component to navigate.
 */
export default function useRouterUtils() {
	const navigationRef = createRef()

	const getCurrentRouteName = () => navigationRef.current?.getCurrentRoute()?.name,
				goBack = () => navigationRef.current?.goBack()

	return {
		// Data
		navigationRef,

		// Export functions
		getCurrentRouteName,
		goBack,

		// Define functions
		closeMagicLinkModal: () => {
			if (getCurrentRouteName() === 'MagicLinkModal')
		 		goBack()
		}
	}
}