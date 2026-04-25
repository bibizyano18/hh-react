import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from "../features/settings/settingsSlice/settingsSlice.js";
import searchReducer from "../features/search/searchSlice/searchSlice.js";

export const store = configureStore({
	reducer: {
		settings: settingsReducer,
		search: searchReducer
	},
})