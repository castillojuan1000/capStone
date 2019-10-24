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

