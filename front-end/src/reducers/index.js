import { combineReducers } from 'redux';
import authReducers from './authReducers';
import playerReducer from './playerReducer';

export default combineReducers({
	user: authReducers,
	player: playerReducer
});
