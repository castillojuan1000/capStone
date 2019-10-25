import { connect } from 'react-redux';
import SignInSide from '../Pages/Home';
const mapStateToProps = (state, ownProps) => {
	return {
		state: state,
		cookies: ownProps.cookies
	};
};

export const HomeContainer = connect(
	mapStateToProps,
	null
)(SignInSide);
