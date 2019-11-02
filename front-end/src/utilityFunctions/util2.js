import axios from 'axios';

export class Spotify {
	constructor(token) {
		this.token = token;
	}

	GET = async (url, successMsg) => {
		let response = await axios({
			method: 'GET',
			url: url,
			headers: { Authorization: `Bearer ${this.token}` }
		});
		return response.data;
	};

	POST = async (url, successMsg) => {
		let response = await axios({
			method: 'POST',
			url: url,
			headers: { Authorization: `Bearer ${this.token}` }
		});
		return response;
	};

	PUT = async (url, successMsg) => {
		let response = await axios({
			method: 'PUT',
			url: url,
			headers: { Authorization: `Bearer ${this.token}` }
		});
		return response;
	};

	DELETE = async (url, successMsg) => {
		let response = await axios({
			method: 'DELETE',
			url: url,
			headers: { Authorization: `Bearer ${this.token}` }
		});
		return response;
	};

	PUTBodyParamter = async (url, data, successMsg) => {
		let response = await axios({
			method: 'PUT',
			url: url,
			data: data,
			headers: { Authorization: `Bearer ${this.token}` }
		});
		return response;
	};

	GetPlaylistTracks = (playlist_id, limit = 100, offset = 0) => {
		let url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?limit=${limit}&offset=${offset}`;
		return this.GET(url, 'Get Playlist Tracks');
	};
	GetPlaylist = playlist_id => {
		let url = `https://api.spotify.com/v1/playlists/${playlist_id}`;
		return this.GET(url, 'Get Playlist');
	};

	GetPlaylistCover = playlist_id => {
		let url = `https://api.spotify.com/v1/playlists/${playlist_id}/images`;
		return this.GET(url, 'Get Playlist Banner');
	};

	GetUsersPlaylists = (user_id, limit = 100, offset = 0) => {
		let url = `https://api.spotify.com/v1/users/${user_id}/playlists?limit=${limit}&offset=${offset}`;
		return this.GET(url, 'Get Users Playlists');
	};
	GetMyPlaylists = (limit = 50, offset = 0) => {
		let url = `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}&market=US`;
		return this.GET(url, 'Get All my Playlists');
	};

	CreatePlaylist = (
		user_id,
		name,
		collaborative = null,
		description = null,
		Ispublic = null
	) => {
		Ispublic = Ispublic !== null ? `&public=${Ispublic}` : '';
		description = description !== null ? `&description=${description}` : '';
		collaborative =
			collaborative !== null ? `&collaborative=${collaborative}` : '';
		let url =
			`https://api.spotify.com/v1/users/${user_id}/playlists?name=${name}` +
			Ispublic +
			description +
			collaborative;
		return this.POST(url, 'Create new Playlist');
	};

	playSong = song => {
		let url = `https://api.spotify.com/v1/me/player/play`;
		let data = `{"uris": ${song}}`;
		return this.PUTBodyParamter(url, data, 'Play specific song');
	};

	SpotifyLogout = () => {
		const url = 'https://www.spotify.com/logout/';
		const spotifyLogoutWindow = window.open(
			url,
			'Spotify Logout',
			'width=700,height=500,top=40,left=40'
		);
		setTimeout(() => spotifyLogoutWindow.close(), 3000);
	};
	//!! All of these functions can be moved inside of the class as methods.
	//!! Instead of having to use spotify as a param we can target it using 'this'.

	getAlbum = id => {
		let url = `https://api.spotify.com/v1/albums/${id}`;
		return this.GET(url, 'got albums');
	};

	getAlbumTracks = id => {
		let url = `https://api.spotify.com/v1/albums/${id}/tracks?limit=50`;
		return this.GET(url, 'got album track list');
	};

	getArtist = id => {
		let url = `https://api.spotify.com/v1/artists/${id}`;
		return this.GET(url, 'got artists');
	};

	getArtistAlbums = (id, offset = 0, limit = 100) => {
		let url = `https://api.spotify.com/v1/artists/${id}/albums?offset=${offset}&limit=${limit}`;
		return this.GET(url, 'got artist Albums');
	};

	getArtistTopTracks = (id, offset = 0, limit = 50) => {
		let url = `https://api.spotify.com/v1/artists/${id}/top-tracks?offset=${offset}&limit=${limit}&market=US`;
		return this.GET(url, 'got top tracks by artist');
	};

	getArtistRelatedArtists = (id, offset = 0, limit = 100) => {
		let url = `https://api.spotify.com/v1/artists/${id}/related-artists?offset=${offset}&limit=${limit}`;
		return this.GET(url, 'got related Artists');
	};

	getAllByCategory = (id, offset = 0, limit = 100) => {
		let url = `https://api.spotify.com/v1/browse/categories/${id}?offset=${offset}&limit=${limit}`;
		return this.GET(url, 'got All results by category');
	};

	getPlaylistByCategory = (id, offset = 0, limit = 100) => {
		let url = `https://api.spotify.com/v1/browse/categories/${id}/playlists?offset=${offset}&limit=${limit}`;
		return this.GET(url, 'got playlists by category');
	};

	getCategoriesList = () => {
		let url = `https://api.spotify.com/v1/browse/categories/`;
		return this.GET(url, 'got All Categories');
	};

	getFeaturedPlaylists = (offset = 0, limit = 100) => {
		let url = `https://api.spotify.com/v1/browse/featured-playlists?offset=${offset}&limit=${limit}`;
		return this.GET(url, 'got Featured Playlists');
	};

	getNewReleases = (offset = 0, limit = 100) => {
		let url = `https://api.spotify.com/v1/browse/new-releases?offset=${offset}&limit=${limit}`;
		return this.GET(url, 'got New Releases');
	};

	getRecommendations = (offset = 0, limit = 100) => {
		let url = `https://api.spotify.com/v1/browse/recommendations?offset=${offset}&limit=${limit}`;
		return this.GET(url, 'got recommendations');
	};

	getFollowedArtists = (limit = 100) => {
		let url = `https://api.spotify.com/v1/me/following?type=artist&limit=${limit}`;
		return this.GET(url, 'got Followed Artists');
	};

	isFollowingUser = (type, ids) => {
		let url = `https://api.spotify.com/v1/me/following/contains?type=${type}&ids=${ids}`;
		return this.GET(url, 'got if you are following user');
	};

	isFollowingPlaylist = playlist_id => {
		let url = `https://api.spotify.com/v1/playlists/${playlist_id}/followers/contains`;
		return this.GET(url, 'got if you are following playlist');
	};

	followArtist = (type, ids) => {
		let url = `https://api.spotify.com/v1/me/following?type=${type}&ids=${ids}`;
		return this.PUT(url, 'PUT Followed New Artist');
	};

	followPlaylist = playlist_id => {
		let url = `https://api.spotify.com/v1/playlists/${playlist_id}/followers/`;
		return this.PUT(url, 'PUT Followed New Artist');
	};

	UnfollowArtist = (type, ids) => {
		let url = `https://api.spotify.com/v1/me/following?type=${type}&ids=${ids}`;
		return this.DELETE(url, 'DELETE Artist Removed');
	};

	UnfollowPlaylist = playlist_id => {
		let url = `https://api.spotify.com/v1/playlists/${playlist_id}/followers/`;
		return this.DELETE(url, 'DELETE Playlist Removed');
	};

	AlbumIsLiked = ids => {
		let url = `https://api.spotify.com/v1/me/albums/contains?ids=${ids}`;
		return this.GET(url, 'Boolean Album is Saved');
	};

	TrackIsLiked = ids => {
		let url = `https://api.spotify.com/v1/me/tracks/contains?ids=${ids}`;
		return this.GET(url, 'Boolean Track is Saved');
	};

	getLikedAlbums = (offset = 0, limit = 100) => {
		let url = `https://api.spotify.com/v1/me/albums?limit=${limit}&offset=${offset}`;
		return this.GET(url, 'get all liked albums');
	};

	getLikedTracks = (offset = 0, limit = 100) => {
		let url = `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`;
		return this.GET(url, 'get all liked Songs');
	};

	DeleteAlbum = ids => {
		let url = `https://api.spotify.com/v1/me/albums?ids=${ids}`;
		return this.DELETE(url, 'Delete Album');
	};

	DeleteSong = ids => {
		let url = `https://api.spotify.com/v1/me/tracks?ids=${ids}`;
		return this.DELETE(url, 'Delete Song');
	};

	AddSong = ids => {
		let url = `https://api.spotify.com/v1/me/tracks?ids=${ids}`;
		return this.PUT(url, 'ADD Song');
	};

	AddAlbum = ids => {
		let url = `https://api.spotify.com/v1/me/albums?ids=${ids}`;
		return this.PUT(url, 'ADD Album');
	};

	getPersonalizedTopTracks = type => {
		console.debug(type)
		let url = `https://api.spotify.com/v1/me/top/${type}?time_range=short_term&limit=5&offset=0`;
		return this.GET(url, 'got personalized top tracks');
	};

	getAllDevices = () => {
		let url = `https://api.spotify.com/v1/me/player/devices`;
		return this.GET(url, 'got Devices');
	};

	getPlayer = () => {
		let url = `https://api.spotify.com/v1/me/player`;
		return this.GET(url, 'got Player');
	};

	getRecentlyPlayed = (limit = 100) => {
		let url = `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`;
		return this.GET(url, 'got recently played tracks');
	};

	getCurrentlyPlaying = () => {
		let url = `https://api.spotify.com/v1/me/player/currently-playing`;
		return this.GET(url, 'got Player');
	};

	StopPlayer = () => {
		let url = `https://api.spotify.com/v1/me/player/pause`;
		return this.PUT(url, 'Put Player Paused');
	};

	ResumePlayer = () => {
		let url = `https://api.spotify.com/v1/me/player/play`;
		return this.PUT(url, 'Put Player Resume');
	};

	EnableRepeatMode = (context = 'context') => {
		let url = `https://api.spotify.com/v1/me/player/repeat?state=${context}`;
		return this.PUT(url, 'Put Song/Album/Playlist on repeat');
	};

	EnableShuffleMode = (shuffle = 'true') => {
		let url = `https://api.spotify.com/v1/me/player/shuffle?state=${shuffle}`;
		return this.PUT(url, 'Shuffle songs true/false');
	};

	ChangeVolume = volume => {
		let url = `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`;
		return this.PUT(url, 'Put Volume Changed');
	};

	PlayNext = () => {
		let url = `https://api.spotify.com/v1/me/player/next`;
		return this.POST(url, 'Post Play Next Song');
	};

	PlayPrevious = () => {
		let url = `https://api.spotify.com/v1/me/player/previous`;
		return this.POST(url, 'Post Play Previous Song');
	};

	RestartSong = () => {
		let url = `https://api.spotify.com/v1/me/player/seek?position_ms=1000`;
		return this.PUT(url, 'Start song over');
	};

	TransferPlayback = device_id => {
		console.log(device_id);
		let url = `https://api.spotify.com/v1/me/player`;
		let data = { device_ids: [device_id], play: true };
		return this.PUTBodyParamter(url, data, 'Transfer Playback');
	};

	getMyProfile = () => {
		let url = `https://api.spotify.com/v1/me`;
		return this.GET(url, 'got my profile');
	};

	getUserProfile = user_id => {
		let url = `https://api.spotify.com/v1/users/${user_id}`;
		return this.GET(url, 'got user profile');
	};

	getTrack = track_id => {
		let url = `https://api.spotify.com/v1/tracks/${track_id}`;
		return this.GET(url, 'got track by id');
	};

	Search = (query, type, limit = 50, offset = 0) => {
		query = query.replace(' ', '%20') + '*';
		let url = `https://api.spotify.com/v1/search?q=${query}&type=${type}&q=${query}&limit=${limit}&offset=${offset}`;
		console.log(url);
		return this.GET(url, 'Search Spotify');
	};

	AddSongToPlaylist = (playlist_id, uris, position = null) => {
		position = position !== null ? `&position=${position}` : '';
		let url =
			`https://api.spotify.com/v1/playlists/${playlist_id}/tracks?uris=${uris}` +
			position;
		return this.POST(url, 'Post Add song to playlist');
	};

	ChangePlayListDetails = (
		playlist_id,
		name,
		collaborative = null,
		description = null,
		Ispublic = null
	) => {
		Ispublic = Ispublic !== null ? `&public=${Ispublic}` : '';
		description = description !== null ? `&description=${description}` : '';
		collaborative =
			collaborative !== null ? `&collaborative=${collaborative}` : '';
		let url =
			`https://api.spotify.com/v1/playlists/${playlist_id}?=${name}` +
			Ispublic +
			description +
			collaborative;
		return this.POST(url, 'Update playlist details');
	};
}
