const initialState = {
	currentSong: {},
	nextSong: {},
	queue: []
};

const authReducer = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'PLAY_SONG':
			return {
				...state,
				currentSong: { ...payload }
			};
		case 'ADD_TO_QUEUE':
			return {
				...state,
				queue: [...state.queue, payload]
			};
		case 'REDIRECT_TO_SIGNIN':
			return {
				...state,
				...payload
			};
		default:
			return state;
	}
};

export default authReducer;
