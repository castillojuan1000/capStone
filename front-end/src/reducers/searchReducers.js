const initialState = {
	token: '',
	search: '',
	loading: false,
	activeFilter: 'artist',
	result: {},
	firing: false,
	scroll: 0
};

const searchReducer = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'SET_SEARCH':
			return {
				...state,
				search: payload.value,
				loading: true,
				result: {},
				scroll: 0
			};
		case 'SEARCH_RESULT_RETURNED':
			return {
				...state,
				result: payload,
				loading: false,
				offset: payload[state.activeFilter.toLowerCase() + 's'].offset,
				total: payload[state.activeFilter.toLowerCase() + 's'].total,
				scroll: 0
			};
		case 'EXTEND_SEARCH_RESULTS':
			return {
				...state,
				loading: false,
				offset: payload[state.activeFilter.toLowerCase() + 's'].offset,
				total: payload[state.activeFilter.toLowerCase() + 's'].total,
				result: {
					...state.result,
					[state.activeFilter.toLowerCase() + 's']: {
						...state.result[state.activeFilter.toLowerCase() + 's'],
						items: [
							...state.result[state.activeFilter.toLowerCase() + 's'].items,
							...payload[state.activeFilter.toLowerCase() + 's'].items
						]
					}
				}
			};
		case 'CLEAR_SEARCH_STATE':
			return {
				...state,
				search: '',
				result: {},
				loading: false,
				scroll: 0
			};
		case 'SET_SEARCH_FILTER':
			return {
				...state,
				result: {},
				activeFilter: payload,
				loading: false,
				scroll: 0
			};
		case 'SET_CURRENT_SCROLL':
			return {
				...state,
				scroll: payload
			};

		default:
			return state;
	}
};

export default searchReducer;
