import axios from 'axios';
import moment, { min } from 'moment';

export const getSongSeconds = (seconds) => {
    let minutes = `${Math.floor(seconds / 60)}`
    seconds = `${Math.round(seconds % 60)}`;
    minutes = (minutes.length < 2) ? 0 + minutes : minutes;
    seconds = (seconds.length < 2) ? 0 + seconds : seconds;
    return `${minutes}:${seconds}`
}

export const StoreAPIToken = () => {
    let hash = window.location.hash.substr(1).split('&');
    let hashMap = [];
    if (hash.length) {
        hash.forEach((chunk) => {
            const chunkSplit = chunk.split('=');
            hashMap[chunkSplit[0]] = chunkSplit[1];
        })
    }
    if (hashMap.access_token) {
        console.log("token retreived from url")
        return hashMap.access_token
    };
}

export const setupSpotify = () => {
    var client_id = '42c128e85c9c4eddad1930a129937c94';
    var response_type = 'token';
    var redirect_uri = 'http://127.0.0.1:3003/';
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

export const playSong = (song, spotify) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')) : spotify;
    let url = `https://api.spotify.com/v1/me/player/play`;
    let data = `{"uris": ["${song}"]}`;
    return spotify.PUTBodyParamter(url, data, 'Play specific song')
}

export const SpotifyLogout = () => {
    const url = 'https://www.spotify.com/logout/'                                                                                                                                                                                                                                                                               
    const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=700,height=500,top=40,left=40')                                                                                                
    setTimeout(() => spotifyLogoutWindow.close(), 3000)
}

export const getAlbum = (id, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')) : spotify;
    let url = `https://api.spotify.com/v1/albums/${id}`
    return spotify.Get(url, 'got albums')
}

export const getAlbumTracks = (id, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/albums/${id}/tracks?limit=50`
    return spotify.GET(url, 'got album track list')
}

export const getArtist = (id, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/artists/${id}`
    return spotify.GET(url, 'got artists')
}

export const getArtistAlbums = (id, spotify=null, offset=0, limit=100) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/artists/${id}/albums?offset=${offset}&limit=${limit}`
    return spotify.GET(url, 'got artist Albums')
}

export const getArtistTopTracks = (id, spotify=null, offset=0, limit=100) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/artists/${id}/top-tracks?offset=${offset}&limit=${limit}`
    return spotify.GET(url, 'got top tracks by artist') 
}

export const getArtistRelatedArtists = (id, spotify=null, offset=0, limit=100) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/artists/${id}/related-artists?offset=${offset}&limit=${limit}`
    return spotify.GET(url, 'got related Artists') 
}

export const getAllByCategory = (id, spotify=null, offset=0, limit=100) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/browse/categories/${id}?offset=${offset}&limit=${limit}`
    return spotify.GET(url, 'got All results by category') 
}

export const getPlaylistByCategory = (id, spotify=null, offset=0, limit=100) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/browse/categories/${id}/playlists?offset=${offset}&limit=${limit}`
    return spotify.GET(url, 'got playlists by category') 
}

export const getCategoriesList = (id, spotify=null, offset=0, limit=100) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/browse/categories/`
    return spotify.GET(url, 'got All Categories') 
}

export const getFeaturedPlaylists = (id, spotify=null, offset=0, limit=100) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/browse/featured-playlists?offset=${offset}&limit=${limit}`
    return spotify.GET(url, 'got Featured Playlists') 
}

export const getNewReleases= (spotify=null, offset=0, limit=100) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/browse/new-releases?offset=${offset}&limit=${limit}`
    return spotify.GET(url, 'got New Releases')
}

export const getRecommendations= (spotify=null, offset=0, limit=100) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/browse/recommendations?offset=${offset}&limit=${limit}`
    return spotify.GET(url, 'got recommendations')
}

export const getFollowedArtists = (spotify=null, limit=100) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/following?type=artist&limit=${limit}`
    return spotify.GET(url, 'got Followed Artists')
}

export const isFollowingUser= (type, ids, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/following/contains?type=${type}&ids=${ids}`
    return spotify.GET(url, 'got if you are following user')
}

export const isFollowingPlaylist= (playlist_id, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/playlists/${playlist_id}/followers/contains`
    return spotify.GET(url, 'got if you are following playlist')
}

export const followArtist = (type, ids, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/following?type=${type}&ids=${ids}`
    return spotify.PUT(url, 'PUT Followed New Artist')
}

export const followPlaylist = (playlist_id, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/playlists/${playlist_id}/followers/`
    return spotify.PUT(url, 'PUT Followed New Artist')
}

export const UnfollowArtist = (type, ids, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/following?type=${type}&ids=${ids}`
    return spotify.DELETE(url, 'DELETE Artist Removed')
}

export const UnfollowPlaylist = (playlist_id, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/playlists/${playlist_id}/followers/`
    return spotify.DELETE(url, 'DELETE Playlist Removed')
}

export const AlbumIsLiked = (ids, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/albums/contains?ids=${ids}`
    return spotify.GET(url, 'Boolean Album is Saved')
}

export const TrackIsLiked = (ids, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/tracks/contains?ids=${ids}`
    return spotify.GET(url, 'Boolean Track is Saved')
}

export const getLikedAlbums = (spotify=null, offset=0, limit=100) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/albums?limit=${limit}&offset=${offset}`
    return spotify.GET(url, 'get all liked albums')
}

export const getLikedTracks = (spotify=null, offset=0, limit=100) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`
    return spotify.GET(url, 'get all liked Songs')
}

export const DeleteAlbum = (ids, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/albums?ids=${ids}`
    return spotify.DELETE(url, 'Delete Album')
}

export const DeleteSong = (ids, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/tracks?ids=${ids}`
    return spotify.DELETE(url, 'Delete Song')
}

export const AddSong = (ids, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/tracks?ids=${ids}`
    return spotify.PUT(url, 'ADD Song')
}

export const AddAlbum = (ids, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/albums?ids=${ids}`
    return spotify.PUT(url, 'ADD Album')
}

export const getPersonalizedTopTracks = (type, spotify=null, offset=0, limit=100) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/top/${type}`
    return spotify.GET(url, 'got personalized top tracks')
}

export const getAllDevices = (spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/player/devices`
    return spotify.GET(url, 'got Devices')
}

export const getPlayer = (spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/player`
    return spotify.GET(url, 'got Player')
}

export const getRecentlyPlayed = (spotify=null, limit=100) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`
    return spotify.GET(url, 'got recently played tracks')
}

export const getCurrentlyPlaying = (spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/player/currently-playing`
    return spotify.GET(url, 'got Player')
}

export const StopPlayer = (spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/player/pause`
    return spotify.PUT(url, 'Put Player Paused')
}

export const ResumePlayer = (spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/player/play`
    return spotify.PUT(url, 'Put Player Resume')
}

export const EnableRepeatMode = (spotify=null, context='track') => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/player/repeat?state=${context}`
    return spotify.PUT(url, 'Put Song/Album/Playlist on repeat')
}

export const EnableShuffleMode = (spotify=null, shuffle='true') => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/player/shuffle?state=${shuffle}`
    return spotify.PUT(url, 'Shuffle songs true/false')
}

export const ChangeVolume = (volume, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`
    return spotify.PUT(url, 'Put Volume Changed')
}

export const PlayNext = (spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/player/next`
    return spotify.POST(url, 'Post Play Next Song')
}

export const PlayPrevious = (spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/player/previous`
    return spotify.POST(url, 'Post Play Previous Song')
}

export const getMyProfile = (spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me`
    return spotify.GET(url, 'got my profile')
}

export const getUserProfile = (user_id, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/users/${user_id}`
    return spotify.GET(url, 'got user profile')
}

export const getTrack = (track_id, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/tracks/${track_id}`
    return spotify.GET(url, 'got track by id')
}

export const Search = (query, type, limit=100, offset=0, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/search?q=${query}&type=${type}&q=${query}&limit=${limit}&offset=${offset}`
    return spotify.GET(url, 'Search Spotify')
}


export const AddSongToPlaylist = (playlist_id, uris, position=null, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    position = (position !== null) ? `&position=${position}` : '';
    let url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?uris=${uris}` + position;
    return spotify.POST(url, 'Post Add song to playlist')
}

export const ChangePlayListDetails = (playlist_id, name, collaborative=null, description=null, Ispublic=null, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    Ispublic = (Ispublic !== null) ? `&public=${Ispublic}` : '';
    description = (description !== null) ? `&description=${description}` : '';
    collaborative = (collaborative !== null) ? `&collaborative=${collaborative}` : '';
    let url = `https://api.spotify.com/v1/playlists/${playlist_id}?=${name}` + Ispublic + description + collaborative;
    return spotify.POST(url, 'Update playlist details')
}

export const CreatePlaylist = (user_id, name, collaborative=null, description=null, Ispublic=null, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    Ispublic = (Ispublic !== null) ? `&public=${Ispublic}` : '';
    description = (description !== null) ? `&description=${description}` : '';
    collaborative = (collaborative !== null) ? `&collaborative=${collaborative}` : '';
    let url = `https://api.spotify.com/v1/users/${user_id}/playlists?name=${name}` + Ispublic + description + collaborative;
    return spotify.POST(url, 'Create new Playlist')
}

export const GetMyPlaylists = (limit=100, offset=0, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`
    return spotify.GET(url, 'Get All my Playlists')
}

export const GetUsersPlaylists = (user_id, limit=100, offset=0, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/users/${user_id}/playlists?limit=${limit}&offset=${offset}`
    return spotify.GET(url, 'Get Users Playlists')
}

export const GetPlaylistCover = (playlist_id, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/playlists/${playlist_id}/images`
    return spotify.GET(url, 'Get Playlist Banner')
}

export const GetPlaylist = (playlist_id, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/playlists/${playlist_id}`
    return spotify.GET(url, 'Get Playlist')
}

export const GetPlaylistTracks = (playlist_id, spotify=null, limit=100, offset=0,) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?limit=${limit}&offset=${offset}`
    return spotify.GET(url, 'Get Playlist Tracks')
}
/* 
export const DeleteSongFromPlaylist = (ids, spotify=null) => {
    spotify = (spotify==null) ? new Spotify(localStorage.getItem('token')): spotify
    let url = `https://api.spotify.com/v1/playlists/{playlist_id}/tracks?ids=${ids}`
    return spotify.DELETE(url, 'Delete Song')
}
 */



class Spotify {
    constructor(token) {
        this.token = token;
    }

    GET = async(url, successMsg) => {
        let response = await axios({
            method: 'GET',
            url: url,
            headers: {'Authorization': `Bearer ${this.token}`},
          })
        return response.data
    };
    
    POST = async(url, successMsg) => {
        let response = await axios({
            method: 'POST',
            url: url,
            headers: {'Authorization': `Bearer ${this.token}`},
          })
        return response
    };

    PUT = async(url, successMsg) => {
        let response = await axios({
            method: 'PUT',
            url: url,
            headers: {'Authorization': `Bearer ${this.token}`},
          })
        return response
    };

    DELETE = async(url, successMsg) => {
        let response = await axios({
            method: 'DELETE',
            url: url,
            headers: {'Authorization': `Bearer ${this.token}`},
          })
        return response
    };

    PUTBodyParamter = async(url, data, successMsg) => {
        let response = await axios({
            method: 'PUT',
            url: url,
            data: data,
            headers: {'Authorization': `Bearer ${this.token}`},
          })
        return response
    };

}