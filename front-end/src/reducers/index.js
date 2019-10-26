import { combineReducers } from 'redux';
import authReducers from './authReducers';
<<<<<<< HEAD

export default combineReducers({
	user: authReducers
=======
import playerReducers from './playerReducers';
import spotifyData from './spotifyData';

export default combineReducers({
	user: authReducers,
	player: playerReducers,
	spotifyData: spotifyData
>>>>>>> antony
});
