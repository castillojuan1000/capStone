const initialState = {
	currentSong: {},
	nextSong: {},
	queue: []
};

const playerReducer = (state = initialState, action) => {
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
		case 'INITIATE_SPOTIFY': {
			return {
				...state,
				spotify: payload
			};
		}
		default:
			return state;
	}
};

export default playerReducer;
