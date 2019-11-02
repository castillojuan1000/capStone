const initialState = {
	email: '',
	id: '',
	username: '',
	isLoggedIn: false,
	room: null
};

const authReducer = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'LOGIN':
			return {
				...payload,
				room: null
			};
		case 'LOGOUT':
			return {
				...initialState
			};
		case 'REDIRECT_TO_SIGNIN':
			return {
				...state,
				...payload
			};
		case 'SET_ROOM':
			return {
				...state,
				room: { ...payload }
			};
		default:
			return state;
	}
};

export default authReducer;
