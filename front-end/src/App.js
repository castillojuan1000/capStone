import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';

import './App.css';
import './reset.css';

// *** Spotify Context Imports
import { SpotifyContext } from './utilityFunctions/SpotifyContext';
import { Spotify } from './utilityFunctions/util';

import Main from './Components/main.js';
import Login from './Components/login.js';
import Footer from './Components/footer.js';

let HomePage = () => <Main page='home' />;
let MainPage = () => <Main page='second' />;
let ExtraPage = () => <Login page='login Page' />;

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		// *** Wrapping the entire app with the Spotify Context Provider
		return (
			<Router>
				<div className='App'>
					<div className='header'></div>
					<Switch>
						<Route path='/second' component={MainPage} />
						<Route path='/login' component={ExtraPage} />
						<Route path='/' component={HomePage} />
					</Switch>
					<Footer />
				</div>
			</Router>
		);
	}
}

export default App;
