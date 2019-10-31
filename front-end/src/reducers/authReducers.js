const initialState = {
	email: '',
	id: '',
	isLoggedIn: false
};

const authReducer = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'LOGIN':
			return {
				...payload
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
		default:
			return state;
	}
};

export default authReducer;
