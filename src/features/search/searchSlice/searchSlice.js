import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Octokit} from "octokit";

const octokit = new Octokit()
export const fetchContributors = createAsyncThunk(
	'search/fetchContributors',
	async ({ owner, repo }) => {
	try {
		const response = await octokit.request(
			'GET /repos/{owner}/{repo}/contributors',
			{
				owner,
				repo,
				per_page: 100,
			}
		);
		return response.data;

	} catch (error) {
		console.error('Ошибка:', error);
		throw error;
	}
});

const searchSlice = createSlice({
	name: "search",
	initialState: {
		contributors: [],
		loading: false,
		error: null,
		animatingLogin: '',
		selectedReviewer: null,
	},
	reducers: {
		setSelectedReviewer: (state, action) => {
			state.selectedReviewer = action.payload;
		},
		setAnimatingLogin: (state, action) => {
			state.animatingLogin = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		clearSearch: (state) => {
			state.selectedReviewer = null;
			state.loading = false;
			state.error = null;
			state.animatingLogin = '';
			state.contributors = [];
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchContributors.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchContributors.fulfilled, (state, action) => {
				state.loading = false;
				state.contributors = action.payload;
			})
			.addCase(fetchContributors.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	}
});

export const {
	setSelectedReviewer,
	setAnimatingLogin,
	setError,
	setLoading,
	clearSearch
} = searchSlice.actions;
export default searchSlice.reducer;