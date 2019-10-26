import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import history from './history';
import './App.css';
import './reset.css';

// *** Spotify Context Imports
import { SpotifyContext } from './utilityFunctions/SpotifyContext';
import { Spotify } from './utilityFunctions/util';

import { ReceiveSpotifyOAuth } from './Components/SpotifyOAuth';
import { HomeContainer } from './Components/Containers/HomeContainer';
// import Main from './Components/main.js';
import Login from './Components/login.js';
import Footer from './Components/Footer/footer';
import SearchSection from './pages/search';
import Album from './pages/albumPage';
import Artist from './pages/artistPage';

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
