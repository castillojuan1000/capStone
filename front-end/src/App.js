import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import history from './history';
import React, { useState } from 'react';
import Navbar from './Components/Navbar/Navbar';
import { connect } from 'react-redux';
import SideDrawer from './Components/Navbar/SideDrawer/SideDrawer';
import Backdrop from './Components/Navbar/Backdrop/Backdrop';
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
import {
	SignInContainer as SignInSide,
	SignUpContainer as SignUp
} from './Components/Containers/SignInContainer';
import Login from './Components/login';
//!!! You can do this inline withing the Route component using render={()=> <Main page="home"/>}
let HomePage = () => <SearchSection />;
let MainPage = () => <SearchSection />;
let AlbumPage = () => <Album />;
let ArtistPage = () => <Artist />;
let ExtraPage = () => <Login />;
let SignIN = () => <SignInSide />;
function App(props) {
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
						{/* <Route path='/login' component={ExtraPage} /> */}
						<Route exact path='/login' component={SignIN} />
						<Route exact path='/signup' component={SignUp} />
						{props.spotifyData.userToken ? (
							<>
								<Route path='/album/:id' component={AlbumPage} />
								<Route path='/artist/:id' component={ArtistPage} />

								<Route path='/' component={HomePage} />
							</>
						) : (
								<Redirect to='/login' />
							)}
					</Switch>
					<Footer />
				</main>
				{/* {console.info('spotifyData below')}
				{console.info(props)} */}
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
//  const {token} = this.props
//  return (
//   // *** Wrapping the entire app with the Spotify Context Provider
//   //! Antony we need to handle the token generating within react so we can pass an instance
//   //! Of the spotify class using the context API. I need a token to for the constructor
//          <Router history={history}>
//              <div className='App'>
//                  <div className='header'></div>
//                  <Switch>
//                      <Route path='/login' component={ExtraPage} />
//           <Route path='/album/:id' component={AlbumPage} />
//           <Route path='/artist/:id' component={ArtistPage} />
//                      <Route path='/' component={HomePage} />
//                  {/*     <Route path='/second' render={() =>{
//                          {token !== null ?
//                          <SpotifyContext.Provider value={new Spotify(this.state.token)}>
//                          <MainPage />
//                          </SpotifyContext.Provider>
//                          <Redirect to='/login' />
//                          }
//                      }} /> */}
//                  </Switch>
//                  <Footer />
//              </div>
//          </Router>
//  );
// }
export default connect(
	mapStateToProps,
	null
)(App);
