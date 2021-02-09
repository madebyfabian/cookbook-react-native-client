import create from 'zustand'

export const useAuthStore = create(set => ({
	user: null,
	updateUser: user => set({ user })
}))