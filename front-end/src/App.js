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

import SearchSection from './pages/search';
import Album from './pages/albumPage';
import Artist from './pages/artistPage';
import Login from './Components/login';
import Footer from './Components/Footer/footer';
import SignInSide from './Components/Pages/Home';
//!!! You can do this inline withing the Route component using render={()=> <Main page="home"/>}
let HomePage = () => <SearchSection/>;
let MainPage = () => <SearchSection/>;
let AlbumPage = () => <Album/>;
let ArtistPage = () => <Artist/>;
let ExtraPage = () => <Login/>;
let SignIN = () => <SignInSide/>


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			token: null
		};
	}

  
	render() {
		const {token} = this.props
		return (
      // *** Wrapping the entire app with the Spotify Context Provider
      //! Antony we need to handle the token generating within react so we can pass an instance
	  //! Of the spotify class using the context API. I need a token to for the constructor
				<Router history={history}>
					<div className='App'>
						<div className='header'></div>
						<Switch>
							<Route path='/login' component={ExtraPage} />
              <Route path='/login2' component={SignIN} />
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
		);
	}
}

export default App;
