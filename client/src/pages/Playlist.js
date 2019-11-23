import React, { Component } from 'react';
import { GetMyPlaylists, GetPlaylistTracks, GetPlaylistCover } from '../utilityFunctions/util'
import { playSong, StopPlayer, ResumePlayer } from '../utilityFunctions/util';
import Playlist from '../Components/Blocks/Playlistblock';
import { withRouter } from 'react-router-dom';
import * as Vibrant from 'node-vibrant';
import { connect } from 'react-redux'
import '../style/playlistpage.css'
import Tracks from '../Components/Blocks/playlistsongs'

import '../albumPage.css'


let searchFilters = ['Playlist', 'Track'];

let Loader = ({ loading }) => {
    let display = loading ? 'block' : 'none';
    let loaderStyle = { display: display };
    return (
        <div className='loader' style={loaderStyle}>
            Loading...
		</div>
    );
};

class PlaylistPage extends Component {

    constructor(props) {
        super(props);
        this.state = {

            token: '',
            loading: true,

            playlistId: [],
            tracks: [],
            playlistImg: [],
            activeFilter: searchFilters,
            vibrant: 'green',


        };
        this.PlaySong = this.PlaySong.bind(this);

    }
    componentDidMount = () => {
        var playlistId = this.props.match.params.id
        GetMyPlaylists(playlistId).then(result => {
            console.log(result, ' show me the result')
            this.setState({ ...this.state, playlistId: result.id })
        });
        GetPlaylistCover(playlistId).then(result => {
            this.setState({ ...this.state, playlistImg: result[0].url })
            this.setColor(result[0].url);
        });
        GetPlaylistTracks(playlistId).then(result => {
            this.setState({ ...this.state, tracks: result.items, loading: false })
        });



    }
    setColor = (url) => {
        let _ = this;
        let img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.addEventListener('load', function () {
            Vibrant.from(img, 5).getPalette((err, palette) => {
                let rgb = palette.Vibrant._rgb;
                let dark = palette.DarkMuted._rgb;
                let darkvibrant = palette.DarkVibrant._rgb;
                let muted = palette.LightVibrant._rgb;
                console.log(palette);
                dark = `RGBA(${dark[0]}, ${dark[1]}, ${dark[2]}, 1)`;
                let color = `RGBA(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;
                muted = `RGBA(${muted[0]}, ${muted[1]}, ${muted[2]}, 1)`;
                darkvibrant = `RGBA(${darkvibrant[0]}, ${darkvibrant[1]}, ${darkvibrant[2]}, 1)`;
                _.setState({
                    ...this.state,
                    vibrant: color,
                    dark: dark,
                    muted: muted,
                    darkvibrant: darkvibrant
                });
            });
        });
    };

    PlaySong = (uri) => {
        console.log("PLAYING SONG ", this.state.tracks)
        const active = this.props.player.currentSong.uri === uri
        if (!active) {
            let index = this.state.tracks.findIndex(track => track.uri === uri);
            let currentSongs = this.state.tracks
                .slice(index, this.state.tracks.length)
                .map(track => {
                    return track.track.uri;
                });
            let newItems = [];
            this.state.tracks
                .forEach((track, idx) => {
                    track.track.order = idx;
                    track.track.album = {
                        images: track.track.album.images
                    };
                    newItems.push(track.track);
                });
            console.info('newitems new', newItems)
            this.props.ResetQueue(newItems)
            let previousSongs = this.state.tracks.slice(0, index).map(track => {
                return track.track.uri;
            });
            let uris = JSON.stringify([...currentSongs, ...previousSongs]);
            console.log(uris, 'hello uris is here');
            this.props.spotifyData.player.playSong(uris).then(result =>
                this.setState({
                    ...this.state,
                    currentSong: result.uri,
                    isPlaying: true
                })
            );
        } else if (active && this.props.player.isPlaying === false) {
            ResumePlayer();
            this.props.togglePlay();
        } else {
            StopPlayer();
            this.props.togglePlay();
        }
    };
    PlayPlaylist = (id) => {
        var playlistId = window.location.pathname.split('/')[2];
        let active = (this.props.player.playlistId === playlistId) ? true : false;
        if (!active) {
            GetPlaylistTracks(id).then(result => {
                let uris = JSON.stringify(
                    result.items.map(track => {
                        return track.uri;
                    })
                );

                return playSong(uris)
            });
        } else if ((active, this.props.player.isPlaying === false)) {
            ResumePlayer();
            this.props.togglePlay()
        } else {
            this.props.togglePlay()
            StopPlayer();
        }
    };


    buildPlaylist = () => {
        let playlists = [];
        if (this.state.result) {
            this.state.playlists.forEach((playlist, idx) => {
                console.log(playlist, 'my playlist is here');
                debugger;
                let active = (this.props.player.playlistId === playlist.id) ? true : false;
                playlists.push(
                    <Playlist
                        handleClick={this.PlayPlaylist}
                        active={active}
                        isPlaying={this.props.player.isPlaying}
                        playlist={playlist}
                        idx={idx}
                    />
                )
            })

        }
        return playlists;
    }

    buildTracks = () => {
        let tracks = [];
        this.state.tracks.forEach((track, idx) => {
            let active = (this.props.player.currentSong.uri === track.id) ? true : false;
            console.debug(track)
            tracks.push(
                <Tracks
                    playlistName={this.state.playlistName}
                    image={track.track.album.images[0].url}
                    handleClick={() => this.PlaySong(track.added_by.uri)}
                    active={active}
                    isPlaying={this.props.player.isPlaying}
                    track={track.track}
                    idx={idx}
                />


            )
        })
        return tracks;
    }


    render() {
        // var playlistId = this.props.match.params.id;
        console.log(this.props, 'the player is here')
        // let Play = (this.props.player.currentSong === playlistId && this.props.player.isPlaying) ? 'Pause' : 'Play';
        let backStyle = {
            background: `linear-gradient(160deg, ${this.props.player.colors.darkVibrant} 15%, rgba(0,0,0, 0.9) 70%)`
        };
        let scrollStyle = {
            scrollbarColor: `${this.state.vibrant} rgba(0,0,0, 0.2)`
        };
        let tracks = this.buildTracks();


        return (

            <div className='page-content ppage' style={backStyle}>
                <div className='Playlist-container'>
                    <div className='Playlist-image'>
                        <div className='img-wrapper'>
                            <img src={this.state.playlistImg} alt="playlist current"></img>
                        </div>
                        <div className='playlist-description-holder'>
                            <h1>{this.state.playlistName}</h1>

                            {/* <button style={vibrantStyle} onClick={this.PlayPlaylist} className='btn btn-primary'>
                                {Play}
                            </button> */}

                        </div>
                    </div>
                    <div className='playlist-songs' style={scrollStyle}>
                        {tracks}
                    </div>
                    <Loader loading={this.state.loading} />
                </div>
            </div>
        );



    }
}
const mapState = state => {
    return { ...state }


}

const mapDispatch = dispatch => {
    return {
        playSong: payload => {
            dispatch({ type: 'PLAY_SONG', payload });
        },
        ResetQueue: payload => {
            console.debug(payload);
            dispatch({ type: 'RESET_PLAYER_QUEUE', payload });
        },
    }
}
export default connect(mapState, mapDispatch)(withRouter(PlaylistPage));