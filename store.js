import create from 'zustand'


/**
 * General, global app needs.
 */
export const useGeneralStore = create(set => ({
	appIsLoading: true,
	updateAppIsLoading: isLoading => set({ appIsLoading: isLoading })
}))


/**
 * Everything auth- & user-specific.
 */
export const useAuthStore = create(set => ({
	user: null,
	updateUser: user => set({ user }),

	lastReauthDate: null,
	updateLastReauthDate: unixDate => set({ lastReauthDate: unixDate })
}))