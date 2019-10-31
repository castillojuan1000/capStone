const initialState = {
	songs: [],
	artists: [],
	albums: [],
	playlists: [],
	personalized: [],
	userToken: '',
	searchQuery: ''
};

const spotifyData = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'LIKE_SONG':
			return {
				...state,
				songs: [...state.songs, payload]
			};
		case 'LIKE_ALBUM':
			return {
				...state,
				albums: [...state.albums, payload]
			};
		case 'LIKE_PLAYLIST':
			return {
				...state,
				playlists: [...state.playlists, payload]
			};
		case 'LIKE_ARTIST':
			return {
				...state,
				artist: [...state.artists, payload]
			};
		case 'SAVE_SPOTIFY_TOKEN':
			return {
				...state,
				userToken: payload
			};
		case 'INITIATE_SPOTIFY': {
			return {
				...state,
				player: payload
			};
		}
		case 'INITIALIZE_SPOTIFY_KEYS':
			return {
				...state,
				[payload.key] : payload.data,
			}
		default:
			return state;
	}
};

export default spotifyData;
