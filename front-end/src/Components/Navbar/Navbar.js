import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import DrawerToggleButton from './SideDrawer/DrawerToggleButton';
import styled from 'styled-components';
import '../../App.css';

function Navbar(props) {
	const handleSignOut = () => {
		localStorage.removeItem('jwtTokens');
		props.logOut();
		fetch('/api/signout');
		props.history.go('/');
	};
	let color;
	var page = window.location.pathname.split('/')[1];
	if (['album', 'artist', 'playlist'].includes(page)) {
		color = props.player.secondaryColors.DarkVibrant;
	} else {
		//color = props.player.colors.vibrant
		color = '#000000 ';
	}
	return (
		<Toolbar
			style={{
				background: `linear-gradient(50deg,${color} 15%, rgba(0,0,0, 1) 15%)`
			}}>
			<ToolbarNavigation>
				<div>
					<DrawerToggleButton toggleButton={props.draweronClick} />
				</div>

				<ToolbarLogo>
					<NavLink
						to='/'
						style={{ fontWeight: 100, fontFamily: 'roboto', fontSize: '2vw', textTransform: 'capitalize' }}>
						Sound Good Music
					</NavLink>
				</ToolbarLogo>

				<Spacer></Spacer>

				<ToolbarNavItems>
					<ul>
						<li>
							<NavLink
								activeStyle={{
									color: props.player.colors.vibrant,
									borderBottom: `2px solid ${props.player.colors.vibrant}`
								}}
								className='nav-link'
								activeClassName='active'
								to='/search'>
								SEARCH
							</NavLink>
						</li>
						<li>
							<NavLink
								activeStyle={{
									color: props.player.colors.vibrant,
									borderBottom: `2px solid ${props.player.colors.vibrant}`
								}}
								className='nav-link'
								activeClassName='active'
								to='/library'>
								LIBRARY
							</NavLink>
						</li>
						{props.user.isLoggedIn ? (
							<li onClick={handleSignOut}>SIGN OUT</li>
						) : (
								<>
									<li>
										<NavLink
											className='nav-link'
											activeClassName='active'
											to='/login'>
											SIGN IN
									</NavLink>
									</li>
									<li>
										<NavLink
											className='nav-link'
											activeClassName='active'
											to='/signup'>
											SIGN UP
									</NavLink>
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
	background: linear-gradient(160deg, #0b1313 25%, rgba(0, 0, 0, 1) 75%);
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
	.navCurrent {
		color: gold;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;

		li {
			padding: 0 2rem;
			font-size: 1.4em;
			letter-spacing: 3px;
			font-weight: 300;
			color: white;
			&:hover {
				cursor: pointer;
			}
			a {
				color: inherit;
				text-decoration: none;
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
