import { stat } from 'fs';
import { duration } from 'moment';

const initialState = {
	currentSong: {},
	nextSong: {},
	queue: [],
	isPlaying: false,
	songLength: 321,
	currentTime: 0,
	albumId: '',
	artistId: '',
	songImg: '',
	songName: ''
};

const playerReducer = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'PLAYER_SET_STATE':
			return {
				...state,
				currentSong: payload.track_window.current_track,
				currentSongId: payload.track_window.current_track.id,
				artist: payload.track_window.current_track.artists[0].name,
				songLength: payload.track_window.current_track.duration_ms / 1000,
				currentTime: payload.position / 1000,
				songImg: payload.track_window.current_track.album.images[2].url,
				albumName: payload.track_window.current_track.album.name,
				songName: payload.track_window.current_track.name,
				playing: !payload.paused
			};
		case 'PLAYER_SET_ARTIST_ID':
			return {
				...state,
				artistId: payload.artistId,
				albumId: payload.albumId
			};

		case 'PLAY_SONG':
			console.info(payload);
			return {
				...state,
				currentSong: { ...payload }
			};
		case 'ADD_TO_QUEUE':
			return {
				...state,
				queue: [...state.queue, payload]
			};
		case 'PLAYER_SET_CURRENT_TIME': {
			return {
				...state,
				currentTime: state.currentTime + 0.25
			};
		}
		case 'PLAYER_TOGGLE_PLAY': {
			return {
				isPlaying: !state.isPlaying
			};
		}
		default:
			return state;
	}
};

export default playerReducer;
