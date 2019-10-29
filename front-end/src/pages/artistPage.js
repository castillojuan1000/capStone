import React from 'react';
import {StoreAPIToken, setupSpotify, getCategoriesList} from '../utilityFunctions/util.js';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import {Search, playSong, StopPlayer, ResumePlayer, getAlbumTracks, 
    getAlbum, getArtist, getArtistTopTracks, getArtistAlbums} from '../utilityFunctions/util.js';

import Artist from '../Components/Blocks/artist';
import Album from '../Components/Blocks/album';
import Song from '../Components/Blocks/albumSongs';

import '../App.css';
import '../artistPage.css';

import * as Vibrant from 'node-vibrant'
let searchFilters = ['Overview', 'Related Artists', 'About'];

let FilterItem = ({name, isActive, onClick}) => {
    let className = (isActive === name.replace(" ", "").toLowerCase()) ? 'active' : '';
    return <li onClick={() => onClick(name.replace(" ", "").toLowerCase())}className={className}>{name}</li>

}


let Loader = ({loading}) => {
  let display = (loading) ? 'block' : 'none';
  let loaderStyle = {display: display}
  return <div className="loader" style={loaderStyle}>Loading...</div>
}


class artistPage extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        token: '',
        loading: true,
        activeFilter: 'artist',
        result: [],
        tracks: [],
        vibrant: 'green',

      }
      this.PlaySong = this.PlaySong.bind(this)
    }
    componentDidMount() {
        var artistId = window.location.pathname.split('/')[2];
        getArtist(artistId).then(result => {
            getArtistTopTracks(artistId).then(tracks => {
                getArtistAlbums(artistId).then(albums => {
                    
                this.setState({
                    ...this.state,
                    artistName: result.name,
                    artistId : result.id,
                    artistImg: result.images[0].url,
                    followers: result.followers.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    loading: false,
                    tracks: tracks.tracks,
                    albums: albums,
                })
             this.setColor(tracks.tracks[0].album.images[0].url)
                })
            })
        }) 
        }


    setColor = (url) => {
        let _ = this;
        let img = new Image;
        img.crossOrigin = "Anonymous";
        img.src = url
        img.addEventListener('load', function() {
            Vibrant.from(img, 5).getPalette((err, palette) => {
                let rgb = palette.Vibrant._rgb
                let dark = palette.DarkMuted._rgb
                let muted = palette.LightVibrant._rgb
                console.log(palette)
                dark = `RGBA(${dark[0]}, ${dark[1]}, ${dark[2]}, 1)`;
                let color = `RGBA(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;
                muted = `RGBA(${muted[0]}, ${muted[1]}, ${muted[2]}, 1)`;
                _.setState({
                    ...this.state,
                    vibrant: color,
                    dark: dark,
                    muted,
                })
            })
        })
    }

    PlaySong = (uri, active) => {
      if(!active) {
        let index = this.state.tracks.findIndex(track => track.uri === uri)
        this.setColor(this.state.tracks[index].album.images[0].url)
        let currentSongs = this.state.tracks.slice(index, this.state.tracks.length).map(track => {return track.uri})
        let previousSongs = this.state.tracks.slice(0, index).map(track => {return track.uri})
        let uris = JSON.stringify([...currentSongs, ...previousSongs])
        playSong(uris).then(result => 
          this.setState({
            ...this.state,
            currentSong: uri,
            isPlaying: true,
          }))
        }
      else if (active, this.state.isPlaying === false) {
        ResumePlayer().then(() => 
        this.setState({
          ...this.state,
          isPlaying: true
        })
        )
      }
      else {
        StopPlayer().then(() =>
          this.setState({
            ...this.state,
            isPlaying: false
          })
        
        )
      }

    }
  
    PlayAlbum = (id, active=false) => {
      if(!active) {
        getAlbumTracks(id).then((result) => {
          let uris = JSON.stringify(result.items
            .map(track => {return track.uri})
          )
          playSong(uris).then(success => 
            this.setState({
              ...this.state,
              currentSong: id,
              isPlaying: true,
            }))
        })
      }
      else if (active, this.state.isPlaying === false) {
        ResumePlayer().then(() => 
        this.setState({
          ...this.state,
          isPlaying: true
        })
        )
      }
      else {
        StopPlayer().then(() =>
          this.setState({
            ...this.state,
            isPlaying: false
          })
        
        )
      }

    }

    buildAlbums = () => {
      let albums = []
      let singles = []
      let features = [];
      if ((this.state.albums)){
        let albumCount = 0;
        let singleCount = 0;
        let featureCount = 0;
        this.state.albums.items.forEach((album, idx) => {
            
            if (album.album_group === 'album' && albumCount < 10) {
              albumCount ++;
              let active = (this.props.player.albumId === album.id) ? true : false;
              albums.push(<Album handleClick={this.PlayAlbum} active={active} isPlaying={this.state.isPlaying} album={album} idx={idx}/>)
            }
            else if (album.album_group === 'single' && singleCount < 10) {
              singleCount ++;
              let active = (this.props.player.albumId === album.id) ? true : false;
              singles.push(<Album handleClick={this.PlayAlbum} active={active} isPlaying={this.state.isPlaying} album={album} idx={idx}/>)
            }
            else if (album.album_group === 'appears_on' && featureCount < 10) {
              featureCount ++;
              let active = (this.props.player.albumId === album.id) ? true : false;
              features.push(<Album handleClick={this.PlayAlbum} active={active} isPlaying={this.state.isPlaying} album={album} idx={idx}/>)
            }
        })
      }
      return [albums, singles, features]
    }

    buildTracks = () => {
      let tracks = []
        this.state.tracks.forEach((track, idx) => {
          let active = (this.props.player.currentSongId === track.id) ? true : false;
          tracks.push(<Song albumName={this.state.albumName} image={track.album.images[0].url} handleClick={this.PlaySong} active={active} isPlaying={this.state.isPlaying} song={track} idx={idx}/>)
        })
      return tracks
    }
  
    render() {
        let backStyle = {background: `linear-gradient(160deg, ${this.state.dark} 15%, rgba(0,0,0, 0.9) 70%)`}
        let bannerStyle = {backgroundImage: `url('${this.state.artistImg}')`}
        let vibrantStyle = {backgroundColor: "rgba(0,0,0, 0.75)", color: this.state.vibrant}
        let scrollStyle = {scrollbarColor: `${this.state.vibrant} rgba(0,0,0, 0.2)`}
        let tracks = this.buildTracks();
        let [albums, singles, features] = this.buildAlbums();
      return (
          <div className="artist-page" style={backStyle}>
            <div className="artist-top-section">
                <div className="left-section">
                    <div className="artist-banner" style={bannerStyle}></div>
                </div>
                 <div className="artist-description">
                    <h1>{this.state.artistName}</h1>
                    <div className="artist-btn-row"> 
                        <div>
                            <button className="btn btn-primary" >Play</button>
                        </div>
                       <div>
                            <button className="btn btn-secondary">Follow</button>
                        </div>
                    </div>
                     <h3>Followers {this.state.followers}</h3>
                 </div>
            </div>
            <div>
                <div className='artist-content' style={scrollStyle}>
                  <div className="album-songs2">
                      <Loader loading={this.state.loading}/>
                          <h2>Top Tracks</h2>
                              {tracks}
                  </div>
                  <div className="artist-albums-holder">
                      <h2>Albums</h2>
                      {albums}
                  </div>
                  <div className="artist-albums-holder">
                      <h2>Singles</h2>
                      {singles}
                  </div>
                  <div className="artist-albums-holder">
                      <h2>Features</h2>
                      {features}
                  </div>
                </div>
            </div>
            </div>
      );
    }
  }

export default artistPage