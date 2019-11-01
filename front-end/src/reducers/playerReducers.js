import { stat } from 'fs';
import { duration } from 'moment';

const initialState = {
	currentSong: {},
	nextSong: {},
	queue: [],
	isPlaying: false,
	songLength: 321,
	albumId: '',
	artistId: '',
	songImg: '',
	songName: '',
	colors: {
		vibrant: 'green',
	}
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
				songImg: payload.track_window.current_track.album.images[2].url,
				albumName: payload.track_window.current_track.album.name,
				songName: payload.track_window.current_track.name,
				playing: !payload.paused,
				shuffle: payload.shuffle,
				repeat: (payload.repeat_mode === 1) ? true : false
			}
		case 'PLAYER_PLAY_NEXT':
				return {
					...state,
					currentSong: payload.item,
					currentSongId: payload.item.id,
					artist: payload.item.artists[0].name,
					songLength: payload.item.duration_ms / 1000,
					songImg: payload.item.album.images[2].url,
					albumName: payload.item.album.name,
					songName: payload.item.name,
					playing: !payload.paused,
				}
		case "PLAYER_SET_ARTIST_ID": 
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
		case 'RESET_PLAYER_QUEUE':
			return {
				...state,
				queue: [...payload]
			}
		case 'PLAYER_SET_PlAYING': {
			return {
				...state,
			};
		}
		case 'PLAYER_TOGGLE_PLAY': {
			return {
				...state,
				isPlaying: !state.isPlaying
			}
		}
		case 'SET_PLAYER_COLORS': {
			return {
				...state,
				colors: payload
			};
		}
		default:
			return state;
	}
};

export default playerReducer;
