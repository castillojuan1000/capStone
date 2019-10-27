import { combineReducers } from 'redux';
import authReducers from './authReducers';
import playerReducers from './playerReducers';
import searchReducer from './searchReducers';
import spotifyData from './spotifyData';

export default combineReducers({
	user: authReducers,
	player: playerReducers,
	spotifyData: spotifyData,
	searchState: searchReducer
});
