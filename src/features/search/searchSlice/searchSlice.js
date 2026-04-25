import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Octokit} from "octokit";

const octokit = new Octokit()
export const fetchContributors = createAsyncThunk(
	'search/fetchContributors',
	async ({ owner, repo }) => {
		const response = await octokit.request(
			'GET /repos/{owner}/{repo}/contributors',
			{
				owner,
				repo,
				per_page: 100,
			}
		);
		return response.data;
	});

const searchSlice = createSlice({
	name: "search",
	initialState: {
		contributors: [],
		loading: false,
		error: null,
		selectedReviewer: null,
	},
	reducers: {
		setSelectedReviewer: (state, action) => {
			state.selectedReviewer = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
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
	setError,
	clearSearch
} = searchSlice.actions;
export default searchSlice.reducer;