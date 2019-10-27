const initialState = {
	songs: [],
	artists: [],
	albums: [],
	playlists: [],
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
		default:
			return state;
	}
};

export default spotifyData;
