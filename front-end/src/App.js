import React from 'react';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import history from './history';
import Navbar from './components/Navbar/Navbar';
import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import SideDrawer from './components/Navbar/SideDrawer/SideDrawer';
import Backdrop from './components/Navbar/Backdrop/Backdrop';

import './App.css';
import './reset.css';

// *** Spotify Context Imports
import { SpotifyContext } from './utilityFunctions/SpotifyContext';
import { Spotify } from './utilityFunctions/util';
//
import {
	AlbumContainer as Album,
	ArtistContainer as Artist,
	FooterContainer as Footer,
	SearchSectionContainer as SearchSection
} from './Components/Containers/MainContainer';
import { HomeContainer } from './Components/Containers/HomeContainer';
import Login from './Components/login';
import Footer from './Components/Footer/footer';
import SignInSide from './Components/Pages/Home';
//!!! You can do this inline withing the Route component using render={()=> <Main page="home"/>}
let HomePage = () => <SearchSection />;
let MainPage = () => <SearchSection />;
let AlbumPage = () => <Album />;
let ArtistPage = () => <Artist />;
let ExtraPage = () => <Login />;
let SignIN = () => <SignInSide />;

function App() {
	const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

	const style = {
		marginTop: '8vh',
		color: 'black',
		width: '100%'
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
						<Route path='/login' component={ExtraPage} />
						<Route path='/login2' component={SignIN} />
						<Route path='/album/:id' component={AlbumPage} />
						<Route path='/artist/:id' component={ArtistPage} />
						<Route path='/' component={HomePage} />
					</Switch>
				</main>
				<Footer />
			</div>
		</Router>
	);
}
// 	const {token} = this.props
// 	return (
//   // *** Wrapping the entire app with the Spotify Context Provider
//   //! Antony we need to handle the token generating within react so we can pass an instance
//   //! Of the spotify class using the context API. I need a token to for the constructor
// 			<Router history={history}>
// 				<div className='App'>
// 					<div className='header'></div>
// 					<Switch>
// 						<Route path='/login' component={ExtraPage} />
//           <Route path='/album/:id' component={AlbumPage} />
//           <Route path='/artist/:id' component={ArtistPage} />
// 						<Route path='/' component={HomePage} />

// 					{/* 	<Route path='/second' render={() =>{
// 							{token !== null ?
// 							<SpotifyContext.Provider value={new Spotify(this.state.token)}>
// 							<MainPage />
// 							</SpotifyContext.Provider>
// 							<Redirect to='/login' />
// 							}
// 						}} /> */}
// 					</Switch>
// 					<Footer />
// 				</div>
// 			</Router>
// 	);
// }

export default App;
