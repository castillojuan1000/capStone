import React, { createContext } from 'react';

export const SpotifyContext = createContext();

export const withSpotify = Component => props => (
	<SpotifyContext.Consumer>
		{spotifyClient => <Component {...props} spotifyClient={spotifyClient} />}
	</SpotifyContext.Consumer>
);
