import React from 'react';
import { StoreAPIToken, setupSpotify } from '../../utilityFunctions/util';
import Spotify from '../../utilityFunctions/util2';
import { connect } from 'react-redux';
import axios from 'axios';

function OAuth(props) {
	React.useEffect(() => {
		const token = localStorage.getItem('token');
		debugger;
		if (token) {
			const opts = {
				redirect_uri: 'http://127.0.0.1:3000/login',
				grant_type: 'authorization_code',
				code: token,
				client_id: '9fbcf6fdda254c04b4c8406f1f540040',
				client_secret: '9e1fb768066a4976ae2d181f36712720'
			};
			axios.post('/api/oAuth', opts).then(res => {
				console.log(res);
			});
		}
	}, []);
	const setSpotify = () => {
		fetch('/oAuth/spotify', {
			headers: {
				'Access-Control-Allow-Origin': '*'
			}
		})
			.then(res => res.json())
			.then(res => {
				console.log(res);
			});
	};
	return (
		<div>
			<button onClick={setupSpotify}>Connect to spotify!</button>
		</div>
	);
}

const mapDispatchToProps = dispatch => {
	return {
		authUser: payload => {
			dispatch({ type: 'LOGIN', payload });
		},
		spotifyToken: payload => {
			dispatch({ type: 'SAVE_SPOTIFY_TOKEN', payload });
		},
		initiatePlayer: payload => {
			dispatch({ type: 'INITIATE_SPOTIFY', payload });
		}
	};
};

const mapState = state => {
	return { ...state };
};

export default connect(
	mapState,
	mapDispatchToProps
)(OAuth);
