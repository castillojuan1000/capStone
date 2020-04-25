import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';

function SideDrawer(props) {
	const style = {};
	const handleSignOut = () => {
		props.logOut();
		fetch('/api/signout', { method: 'DELETE' });
	};
	return (
		<SideDrawerStyled onClick={props.click} style={style} show={props.show}>
			<ul>
				<li>
					<Link to='/'>HOME</Link>
				</li>
				{props.user.isLoggedIn ? (
					<li onClick={handleSignOut}>SIGN OUT</li>
				) : (
					<>
						<li>
							<Link to='/login'>SIGN IN</Link>
						</li>
						<li>
							<Link to='/signup'>SIGN UP</Link>
						</li>
					</>
				)}
			</ul>
		</SideDrawerStyled>
	);
}

const SideDrawerStyled = styled.nav`
	height: 100vh;
	background: white;
	box-shadow: 1px 0px 7px rgba(0, 0, 0, 0.5);
	position: fixed;
	top: 0;
	left: 0;
	width: 70%;
	max-width: 400px;
	z-index: 200;
	transition: transform 400ms ease-out;
	transform: ${props => (props.show ? 'translateX(0)' : 'translateX(-105%)')};

	@media (min-width: 769px) {
		display: none;
	}

	ul {
		height: 100%;
		list-style: none;
		display: flex;
		flex-direction: column;
		justify-content: center;

		li {
			margin: 0.5rem 0;

			a {
				color: #521751;
				text-decoration: none;
				font-size: 1.2rem;

				&:hover {
					color: #fa923f;
				}

				&:active {
					color: #fa923f;
				}
			}
		}
	}
`;

const mapStateToProps = state => {
	return { ...state };
};
const mapDispatchToProps = dispatch => {
	return {
		logOut: () => {
			dispatch({ type: 'LOGOUT' });
		}
	};
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(SideDrawer));
