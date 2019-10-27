import React, { useState } from 'react';
import { OauthSender, OauthReceiver } from 'react-oauth-flow';
import { withRouter } from 'react-router-dom';
console.log(process.REACT_APP_CLIENT_SECRET);
export const SendSpotifyOAuth = props => {
	const scope = [
		'user-read-playback-state',
		'streaming',
		'user-read-private',
		'user-read-currently-playing',
		'user-modify-playback-state',
		// 'user-read-birthdate',
		// 'user-read-email'
		'user-library-read'
	].join(' ');
	return (
		<OauthSender
			authorizeUrl='https://accounts.spotify.com/authorize'
			clientId='9fbcf6fdda254c04b4c8406f1f540040'
			redirectUri='http://127.0.0.1:3000/auth/spotify'
			args={{
				scope,
				response_type: 'code'
			}}
			state={{ from: props.location }} //* tells the 0auth where the user navigated from the app
			render={({ url }) => <a href={url}>Connect to Spotify</a>} //* This component will render this HTML for now a link with href
		/>
	);
};

export const ReceiveSpotifyOAuth = withRouter(props => {
	const [redirect, setRedirect] = useState(null);
	const handleSuccess = async (accessToken, { response, state }) => {
		console.log('Successfully authorized');
		localStorage.setItem('token', accessToken);
		debugger;
		debugger;
	};
	const handleError = error => {
		console.error('An error occured');
		console.error(error.message);
		setTimeout(() => {
			props.history.push(redirect.from);
		}, 2000);
	};
	return (
		<OauthReceiver
			tokenUrl='https://accounts.spotify.com/api/token'
			args={{
				grant_type: 'authorization_code'
			}}
			clientId='9fbcf6fdda254c04b4c8406f1f540040'
			clientSecret='9e1fb768066a4976ae2d181f36712720'
			redirectUri='127.0.0.1:3000/auth/spotify'
			onAuthSuccess={handleSuccess}
			onAuthError={handleError}
			render={({ processing, state, error }) => {
				setRedirect(state);
				return (
					<>
						{processing && <p>Authorizing...</p>}
						{state && <p>Will redirect you to {state.from}</p>}
						{error && <p>Error has occured!</p>}
					</>
				);
			}}
		/>
	);
});
