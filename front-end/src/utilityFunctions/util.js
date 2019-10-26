<<<<<<< Updated upstream
PressPlay(my_device, token, music_player, track_uri, track_length)


function StoreAPIToken() {
    var hash = window.location.hash.substr(1).split('&');
    var hashMap = [];
    // break the hash into pieces to get the access_token
    if (hash.length) {
        hash.forEach((chunk) => {
            const chunkSplit = chunk.split('=');
            hashMap[chunkSplit[0]] = chunkSplit[1];
        })
    }
    if (hashMap.access_token) {
        console.log("token retreived from url")
        token = hashMap.access_token;
    }
}
=======
import axios from 'axios';
import moment, { min } from 'moment';

export const getSongSeconds = seconds => {
	let minutes = `${Math.floor(seconds / 60)}`;
	seconds = `${Math.round(seconds % 60)}`;
	minutes = minutes.length < 2 ? 0 + minutes : minutes;
	seconds = seconds.length < 2 ? 0 + seconds : seconds;
	return `${minutes}:${seconds}`;
};

export const StoreAPIToken = () => {
	let hash = window.location.hash.substr(1).split('&');
	let hashMap = [];
	if (hash.length) {
		hash.forEach(chunk => {
			const chunkSplit = chunk.split('=');
			hashMap[chunkSplit[0]] = chunkSplit[1];
		});
	}
	debugger;
	if (hashMap.access_token) {
		console.log('token retreived from url');
		return hashMap.access_token;
	}
};

export const setupSpotify = () => {
	var client_id = '9fbcf6fdda254c04b4c8406f1f540040';
	var response_type = 'token';
	var redirect_uri = 'http://127.0.0.1:4000/auth/spotify';
	var scope = [
		'user-read-playback-state',
		'streaming',
		'user-read-private',
		'user-read-currently-playing',
		'user-modify-playback-state',
		'user-read-birthdate',
		'user-read-email',
		'user-library-read'
	].join(' ');
	var url = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}`;
	window.location = url;
};

export const playSong = (song, spotify) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/player/play`;
	let data = `{"uris": ["${song}"]}`;
	return spotify.PUTBodyParamter(url, data, 'Play specific song');
};

export const SpotifyLogout = () => {
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

export const getAlbum = (id, spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/albums/${id}`;
	return spotify.Get(url, 'got albums');
};

export const getAlbumTracks = (id, spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/albums/${id}/tracks?limit=50`;
	return spotify.GET(url, 'got album track list');
};

export const getArtist = (id, spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/artists/${id}`;
	return spotify.GET(url, 'got artists');
};

export const getArtistAlbums = (
	id,
	spotify = null,
	offset = 0,
	limit = 100
) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/artists/${id}/albums?offset=${offset}&limit=${limit}`;
	return spotify.GET(url, 'got artist Albums');
};

export const getArtistTopTracks = (
	id,
	spotify = null,
	offset = 0,
	limit = 100
) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/artists/${id}/top-tracks?offset=${offset}&limit=${limit}`;
	return spotify.GET(url, 'got top tracks by artist');
};

export const getArtistRelatedArtists = (
	id,
	spotify = null,
	offset = 0,
	limit = 100
) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/artists/${id}/related-artists?offset=${offset}&limit=${limit}`;
	return spotify.GET(url, 'got related Artists');
};

export const getAllByCategory = (
	id,
	spotify = null,
	offset = 0,
	limit = 100
) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/browse/categories/${id}?offset=${offset}&limit=${limit}`;
	return spotify.GET(url, 'got All results by category');
};

export const getPlaylistByCategory = (
	id,
	spotify = null,
	offset = 0,
	limit = 100
) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/browse/categories/${id}/playlists?offset=${offset}&limit=${limit}`;
	return spotify.GET(url, 'got playlists by category');
};

export const getCategoriesList = (
	id,
	spotify = null,
	offset = 0,
	limit = 100
) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/browse/categories/`;
	return spotify.GET(url, 'got All Categories');
};

export const getFeaturedPlaylists = (
	id,
	spotify = null,
	offset = 0,
	limit = 100
) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/browse/featured-playlists?offset=${offset}&limit=${limit}`;
	return spotify.GET(url, 'got Featured Playlists');
};

export const getNewReleases = (spotify = null, offset = 0, limit = 100) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/browse/new-releases?offset=${offset}&limit=${limit}`;
	return spotify.GET(url, 'got New Releases');
};

export const getRecommendations = (spotify = null, offset = 0, limit = 100) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/browse/recommendations?offset=${offset}&limit=${limit}`;
	return spotify.GET(url, 'got recommendations');
};

export const getFollowedArtists = (spotify = null, limit = 100) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/following?type=artist&limit=${limit}`;
	return spotify.GET(url, 'got Followed Artists');
};

export const isFollowingUser = (type, ids, spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/following/contains?type=${type}&ids=${ids}`;
	return spotify.GET(url, 'got if you are following user');
};

export const isFollowingPlaylist = (playlist_id, spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/playlists/${playlist_id}/followers/contains`;
	return spotify.GET(url, 'got if you are following playlist');
};

export const followArtist = (type, ids, spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/following?type=${type}&ids=${ids}`;
	return spotify.PUT(url, 'PUT Followed New Artist');
};

export const followPlaylist = (playlist_id, spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/playlists/${playlist_id}/followers/`;
	return spotify.PUT(url, 'PUT Followed New Artist');
};

export const UnfollowArtist = (type, ids, spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/following?type=${type}&ids=${ids}`;
	return spotify.DELETE(url, 'DELETE Artist Removed');
};

export const UnfollowPlaylist = (playlist_id, spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/playlists/${playlist_id}/followers/`;
	return spotify.DELETE(url, 'DELETE Playlist Removed');
};

export const AlbumIsLiked = (ids, spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/albums/contains?ids=${ids}`;
	return spotify.GET(url, 'Boolean Album is Saved');
};

export const TrackIsLiked = (ids, spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/tracks/contains?ids=${ids}`;
	return spotify.GET(url, 'Boolean Track is Saved');
};

export const getLikedAlbums = (spotify = null, offset = 0, limit = 100) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/albums?limit=${limit}&offset=${offset}`;
	return spotify.GET(url, 'get all liked albums');
};

export const getLikedTracks = (spotify = null, offset = 0, limit = 100) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`;
	return spotify.GET(url, 'get all liked Songs');
};

export const DeleteAlbum = (ids, spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/albums?ids=${ids}`;
	return spotify.DELETE(url, 'Delete Album');
};

export const DeleteSong = (ids, spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/tracks?ids=${ids}`;
	return spotify.DELETE(url, 'Delete Song');
};

export const AddSong = (ids, spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/tracks?ids=${ids}`;
	return spotify.PUT(url, 'ADD Song');
};

export const AddAlbum = (ids, spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/albums?ids=${ids}`;
	return spotify.PUT(url, 'ADD Album');
};

export const getPersonalizedTopTracks = (
	type,
	spotify = null,
	offset = 0,
	limit = 100
) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/top/${type}`;
	return spotify.GET(url, 'got personalized top tracks');
};

export const getAllDevices = (spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/player/devices`;
	return spotify.GET(url, 'got Devices');
};

export const getPlayer = (spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/player`;
	return spotify.GET(url, 'got Player');
};

export const getRecentlyPlayed = (spotify = null, limit = 100) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`;
	return spotify.GET(url, 'got recently played tracks');
};

export const getCurrentlyPlaying = (spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/player/currently-playing`;
	return spotify.GET(url, 'got Player');
};

export const StopPlayer = (spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/player/pause`;
	return spotify.PUT(url, 'Put Player Paused');
};

export const ResumePlayer = (spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/player/play`;
	return spotify.PUT(url, 'Put Player Resume');
};

export const EnableRepeatMode = (spotify = null, context = 'track') => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/player/repeat?state=${context}`;
	return spotify.PUT(url, 'Put Song/Album/Playlist on repeat');
};

export const EnableShuffleMode = (spotify = null, shuffle = 'true') => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/player/shuffle?state=${shuffle}`;
	return spotify.PUT(url, 'Shuffle songs true/false');
};

export const ChangeVolume = (volume, spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`;
	return spotify.PUT(url, 'Put Volume Changed');
};

export const PlayNext = (spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/player/next`;
	return spotify.POST(url, 'Post Play Next Song');
};

export const PlayPrevious = (spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/player/previous`;
	return spotify.POST(url, 'Post Play Previous Song');
};

export const RestartSong = (spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/player/seek?position_ms=1000`;
	return spotify.PUT(url, 'Start song over');
};

export const TransferPlayback = (device_id, play = true, spotify) => {
	console.log(device_id);
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me/player`;
	let data = { device_ids: [device_id], play: true };
	return spotify.PUTBodyParamter(url, data, 'Transfer Playback');
};

export const getMyProfile = (spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/me`;
	return spotify.GET(url, 'got my profile');
};

export const getUserProfile = (user_id, spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/users/${user_id}`;
	return spotify.GET(url, 'got user profile');
};

export const getTrack = (track_id, spotify = null) => {
	spotify =
		spotify == null ? new Spotify(localStorage.getItem('token')) : spotify;
	let url = `https://api.spotify.com/v1/tracks/${track_id}`;
	return spotify.GET(url, 'got track by id');
};
>>>>>>> Stashed changes

let playSong = (my_device, token, song) => {
    $.ajax({
        url: "https://api.spotify.com/v1/me/player/play?device_id=" + my_device,
        type: "PUT",
        data: `{"uris": ["${song}"]}`,
        headers: {'Authorization': `Bearer ${token}`},
        success: function(data) {
            console.log("start playing")
            console.log(data)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status);
            console.log(thrownError);
          }
    })
}


let getSongSeconds = (seconds) => {
    return moment.duration(seconds/1000, "seconds").format("ss");
}


let setupSpotify = () => {
    var client_id = '42c128e85c9c4eddad1930a129937c94';
    var response_type = 'token';
    var redirect_uri = 'http://159.203.185.216:8899/animation.html';
    var scope = [
        'user-read-playback-state', 
        'streaming', 
        'user-read-private', 
        'user-read-currently-playing', 
        'user-modify-playback-state', 
        'user-read-birthdate', 
        'user-read-email', 
        'user-library-read',].join(' ');

     var url = `https://accounts.spotify.com/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}`;
    window.location = url;
}

let searchSpotify = (value, token) => {
    if (value != '') {
        $.ajax(`https://api.spotify.com/v1/search?q=${value}&type=track`, {
            headers: {'Authorization': `Bearer ${token}`}
            })
        .then((data) => { 
           return data
    }
}


function getSpotifyUserProfile(){
    $.ajax(`https://api.spotify.com/v1/me`, {
        headers: {'Authorization': `Bearer ${token}`},
        error: function () {
            alert('error')
          },
    }).then(profile => {
        console.log(profile)
    });
};


let SpotifyLogout = () => {
    const url = 'https://www.spotify.com/logout/'                                                                                                                                                                                                                                                                               
    const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=700,height=500,top=40,left=40')                                                                                                
    setTimeout(() => spotifyLogoutWindow.close(), 3000)
}



function SpotifyGetLikes() {
    $.ajax(`https://api.spotify.com/v1/me/tracks?&limit=50`, {
        headers: {'Authorization': `Bearer ${token}`},
        error: function (xhr, ajaxOptions, thrownError) {
            console.log('getting likes failed');
          },
    }).then((data) => {return data})
};

