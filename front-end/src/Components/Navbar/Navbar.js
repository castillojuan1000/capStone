import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import DrawerToggleButton from './SideDrawer/DrawerToggleButton';
import styled from 'styled-components';

function Navbar(props) {
	const handleSignOut = () => {
		props.logOut();
		fetch('/api/signout');
	};
	return (
		<Toolbar>
			<ToolbarNavigation>
				<div>
					<DrawerToggleButton toggleButton={props.draweronClick} />
				</div>

				<ToolbarLogo>
					<Link to='/'>THE LOGO</Link>
				</ToolbarLogo>

				<Spacer></Spacer>

				<ToolbarNavItems>
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
				</ToolbarNavItems>
			</ToolbarNavigation>
		</Toolbar>
	);
}

//* Styled Components

const Toolbar = styled.header`
	position: fixed;
	width: 100%;
	top: 0;
	left: 0;
	background: black;
	height: 8vh;
`;

const ToolbarNavigation = styled.nav`
	display: flex;
	height: 100%;
	align-items: center;
	padding: 0 1rem;
`;

const ToolbarLogo = styled.div`
	margin-left: 1.1rem;
	@media (min-width: 769px) {
		margin-left: 0;
	}

	a {
		color: white;
		text-decoration: none;
		font-size: 1.5rem;
	}
`;

const Spacer = styled.div`
	flex: 1;
`;

const ToolbarNavItems = styled.div`
	@media (max-width: 768px) {
		display: none;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;

		li {
			padding: 0 0.5rem;
			color: white;
			&:hover {
				color: #fa923f;
				cursor: pointer;
			}
			a {
				color: inherit;
				text-decoration: none;

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
)(withRouter(Navbar));
