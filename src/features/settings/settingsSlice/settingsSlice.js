import {createSlice} from "@reduxjs/toolkit";

const loadFromStorage = () => {
	try {
		const data = JSON.parse(localStorage.getItem('settings'));
		return data ? data : {login: '', repo: '', blacklist: []};
	} catch (e) {
		console.log(e);
	}
	return {login: '', repo: '', blacklist: []};
}

const state = loadFromStorage();

const settingsSlice = createSlice({
	name: "settings",
	initialState: state,
	reducers: {
		setSettings: (state, action) => {
			const {login, repo, blacklist} = action.payload;
			state.login = login;
			state.repo = repo;
			state.blacklist = blacklist;
		}
	}
});

export const {setSettings} = settingsSlice.actions;
export default settingsSlice.reducer;