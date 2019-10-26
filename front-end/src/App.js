import React from 'react';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import history from './history';
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
import {HomeContainer} from './Components/Containers/HomeContainer'
import Login from './Components/login';

//!!! You can do this inline withing the Route component using render={()=> <Main page="home"/>}
let HomePage = () => <SearchSection />;
let MainPage = () => <SearchSection />;
let AlbumPage = () => <Album />;
let ArtistPage = () => <Artist />;
let ExtraPage = () => <Login />;

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			token: null
		};
	}

	render() {
<<<<<<< HEAD
		// *** Wrapping the entire app with the Spotify Context Provider
		return (
			<div className='App'>
				<div className='header'></div>
				<Switch>
					<Route
						path='/login'
						render={props => (
							<HomeContainer
								page='login Page'
								{...props}
								cookies={this.props.cookies}
							/>
						)}
					/>
					<Route path='/second' component={MainPage} />
					<Route exact path='/' component={HomePage} />
					<Route exact path='/auth/spotify' component={ReceiveSpotifyOAuth} />
				</Switch>
				<Footer />
			</div>
=======
		const { token } = this.props;
		return (
			// *** Wrapping the entire app with the Spotify Context Provider
			//! Antony we need to handle the token generating within react so we can pass an instance
			//! Of the spotify class using the context API. I need a token to for the constructor
			<Router history={history}>
				<div className='App'>
					<div className='header'></div>
					<Switch>
						<Route path='/login' component={ExtraPage} />
						<Route path='/album/:id' component={AlbumPage} />
						<Route path='/artist/:id' component={ArtistPage} />
						<Route path='/' component={HomePage} />

						{/* 	<Route path='/second' render={() =>{
								{token !== null ?
								<SpotifyContext.Provider value={new Spotify(this.state.token)}>
								<MainPage />
								</SpotifyContext.Provider>
								<Redirect to='/login' />
								}
							}} /> */}
					</Switch>
					<Footer />
				</div>
			</Router>
>>>>>>> antony
		);
	}
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
