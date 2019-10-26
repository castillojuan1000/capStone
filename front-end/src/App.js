import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">

<<<<<<< Updated upstream
    </div>
  );
=======
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
						render={props => <HomeContainer page='login Page' {...props} />}
					/>
					<Route path='/second' component={MainPage} />
					<Route exact path='/' component={HomePage} />
					<Route exact path='/auth/spotify' component={ReceiveSpotifyOAuth} />
				</Switch>
				<Footer />
			</div>
		);
	}
>>>>>>> Stashed changes
}

export default App;
