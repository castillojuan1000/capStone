import React from 'react';
import {
	StoreAPIToken,
	setupSpotify,
	getCategoriesList
} from '../utilityFunctions/util.js';
import { Link, withRouter } from 'react-router-dom';
import { ReceiveSpotifyOAuth, SendSpotifyOAuth } from './SpotifyOAuth';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	handleClick = () => {
		setupSpotify();
	};

	render() {
		return (
			<div className='main'>
				<SendSpotifyOAuth location={this.props.match.url} />
				<button onClick={this.handleClick} className='btn btn-primary'>
					Login
				</button>
			</div>
		);
	}
}

export default withRouter(Login);
