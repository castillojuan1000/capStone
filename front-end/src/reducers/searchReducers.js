const initialState = {
	token: '',
	search: '',
	loading: false,
	activeFilter: 'artist',
	result: [],
	firing: false
};

const searchReducer = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'SET_SEARCH':
			return { ...payload };
		case 'CLEAR_SEARCH_STATE':
			return {
				...initialState
			};
		default:
			return state;
	}
};

export default searchReducer;
