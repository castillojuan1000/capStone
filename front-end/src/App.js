import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import './App.css';
import './reset.css';

// *** Spotify Context Imports
import { SpotifyContext } from './utilityFunctions/SpotifyContext';
import { Spotify } from './utilityFunctions/util';

import { ReceiveSpotifyOAuth } from './Components/SpotifyOAuth';
import { HomeContainer } from './Components/Containers/HomeContainer';
import Main from './Components/main.js';
import Login from './Components/login.js';
import Footer from './Components/footer.js';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		let HomePage = () => (
			<HomeContainer page='home' cookies={this.props.cookies} />
		);
		let MainPage = () => <Main page='second' cookies={this.props.cookies} />;
		let ExtraPage = props => (
			<Login page='login Page' {...props} cookies={this.props.cookies} />
		);
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

export default withCookies(App);
