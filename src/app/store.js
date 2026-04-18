import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from "../features/settings/settingsSlice/settingsSlice.js";

export const store = configureStore({
	reducer: {
		settings: settingsReducer
		// search:
	},
})