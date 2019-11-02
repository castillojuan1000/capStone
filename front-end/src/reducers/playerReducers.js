import { stat } from 'fs';
import { duration } from 'moment';

const initialState = {
	currentSong: {},
	nextSong: {},
	queue: [],
	recentlyPlayed: [],
	isPlaying: false,
	previousBtn: true,
	songLength: 321,
	albumId: '',
	artistId: '',
	songImg: '',
	songName: '',
	colors: {
		vibrant: 'black'
	},
	secondaryColors: {
		vibrant: 'black'
	}
};

const playerReducer = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'PLAYER_SET_STATE':
			let newQueue;
			let recentlyPlayed;
			let previousBtn = true;
			if (state.queue.length === 0) {
				newQueue = JSON.parse(localStorage.getItem('queue')) || [];
				recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed'));
				recentlyPlayed = recentlyPlayed !== null ? recentlyPlayed : [];
			} else if (
				state.queue.length > 1 &&
				payload.track_window.current_track.id === state.queue[1].id
			) {
				newQueue = state.queue.slice(1);
				recentlyPlayed = [state.queue[0], ...state.recentlyPlayed];
				localStorage.setItem('queue', JSON.stringify(newQueue));
				localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
			} else if (
				state.recentlyPlayed.length > 0 &&
				payload.track_window.current_track.id === state.recentlyPlayed[0].id
			) {
				recentlyPlayed = state.recentlyPlayed.slice(1);
				newQueue = [state.recentlyPlayed[0], ...state.queue];
				localStorage.setItem('queue', JSON.stringify(newQueue));
				localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
			} else {
				newQueue = state.queue;
				recentlyPlayed = state.recentlyPlayed;
			}
			if (payload.track_window.previous_tracks.length === 0) {
				previousBtn = false;
			}
			if (
				newQueue.length > 0 &&
				newQueue[0].id !== payload.track_window.current_track
			) {
				//newQueue = []
				//localStorage.setItem('queue', JSON.stringify([]))
			}
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
				isPlaying: !payload.paused,
				shuffle: payload.shuffle,
				repeat: payload.repeat_mode === 1 ? true : false,
				queue: newQueue,
				recentlyPlayed: recentlyPlayed,
				previousBtn: previousBtn
			};
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
				playing: !payload.paused
			};
		case 'PLAYER_SET_ARTIST_ID':
			return {
				...state,
				artistId: payload.artistId,
				albumId: payload.albumId
			};

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
		case 'RESET_PLAYER_QUEUE':
			localStorage.setItem('queue', JSON.stringify([...payload]));
			return {
				...state,
				queue: [...payload]
			};
		case 'PLAYER_SET_PlAYING': {
			return {
				...state
			};
		}
		case 'PLAYER_TOGGLE_PLAY': {
			return {
				...state,
				isPlaying: !state.isPlaying
			};
		}
		case 'SET_PLAYER_COLORS': {
			return {
				...state,
				colors: payload
			};
		}
		case 'SET_SECONDARY_COLORS': {
			return {
				...state,
				secondaryColors: payload
			};
		}
		default:
			return state;
	}
};

export default playerReducer;
