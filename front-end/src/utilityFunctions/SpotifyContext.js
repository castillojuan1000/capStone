import React, { createContext } from 'react';

export const SpotifyContext = createContext(null);

export const withSpotify = Component => props => (
	<SpotifyContext.Consumer>
		{spotifyClient => <Component {...props} spotifyClient={spotifyClient} />}
	</SpotifyContext.Consumer>
);
