import { connect } from 'react-redux';
import SignInSide from '../Pages/Home';
const mapStateToProps = (state, ownProps) => {
	return {
		state: state,
		cookies: ownProps.cookies
	};
};

const mapDispatchToProps = dispatch => {
	return {
		authUser: payload => {
			dispatch({ type: 'LOGIN', payload });
		}
	};
};
export const HomeContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SignInSide);
