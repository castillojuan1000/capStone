import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import history from './history';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import './App.css';
import './style/reset.css';
import { SideDrawer, Backdrop, Navbar, Library, PlaylistPage, Album, Artist, Footer, SearchSection, Home, SignIn, SignUp } from './Components'

import Room from './Components/Containers/RoomContainer';
function App(props) {
	const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
	const style = {
		color: 'black',
		width: '100vw'
	};
	const drawerToggleClickHandler = () => {
		setSideDrawerOpen(prevState => {
			return !sideDrawerOpen;
		});
	};
	const closeSideDrawerHandler = () => {
		setSideDrawerOpen(false);
	};
	let backdrop;
	if (sideDrawerOpen) {
		backdrop = <Backdrop click={closeSideDrawerHandler} />;
	}
	return (
		<Router history={history}>
			<div className='App' style={{ height: '100vh' }}>
				<Navbar draweronClick={drawerToggleClickHandler} />
				<SideDrawer click={closeSideDrawerHandler} show={sideDrawerOpen} />;
				{backdrop}
				<div className='header'></div>
				<main style={style}>
					<Switch>
						{/* <Route path='/login' component={ExtraPage} /> */}
						<Route exact path='/login' component={SignIn} />
						<Route exact path='/signup' component={SignUp} />
						{props.spotifyData.userToken ? (
							<>
								<Route exact path='/room/:id' component={Room} />
								<Route path='/album/:id' component={Album} />
								<Route path='/artist/:id' component={Artist} />
								<Route exact path='/library' component={Library} />
								<Route exact path='/search' component={SearchSection} />
								<Route exact path='/' component={Home} />
								<Route path='/playlist/:id' component={PlaylistPage} />
							</>
						) : (
								<Redirect to='/login' />
							)}
					</Switch>
				</main>
				{props.spotifyData.userToken && (
					<>
						<Footer />
					</>
				)}
			</div>
		</Router>
	);
}
const mapStateToProps = state => {
	return {
		...state
	};
};
export default connect(
	mapStateToProps,
	null
)(App);
