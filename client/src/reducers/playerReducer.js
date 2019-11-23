const initialState = {
	currentSong: {},
	nextSong: {},
	queue: []
};

const playerReducer = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'ADD_TO_QUEUE':
			return {
				...state,
				queue: [...state.queue, payload]
			};
		case 'REMOVE_FROM_QUEUE':
			const payloadIndex = state.queue.indexOf(payload);
			if (payloadIndex) {
				return {
					...state,
					queue: [
						state.queue.slice(0, payloadIndex),
						state.queue.slice(payloadIndex + 1)
					]
				};
			} else {
				return { ...state };
			}
		default:
			return state;
	}
};

export default playerReducer;
