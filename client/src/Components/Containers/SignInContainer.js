import { connect } from 'react-redux';
import { SignIn, SignUp } from '../Pages'
const mapStateToProps = (state, ownProps) => {
	return {
		...state
	};
};

const mapDispatchToProps = dispatch => {
	return {
		authUser: payload => {
			dispatch({ type: 'LOGIN', payload });
		},
		spotifyToken: payload => {
			dispatch({ type: 'SAVE_SPOTIFY_TOKEN', payload });
		},
		initiatePlayer: payload => {
			dispatch({ type: 'INITIATE_SPOTIFY', payload });
		}
	};
};
export const SignUpContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SignUp);
export const SignInContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SignIn);
