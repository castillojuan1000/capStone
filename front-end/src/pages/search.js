import React from 'react';
import {StoreAPIToken, setupSpotify, getCategoriesList} from '../utilityFunctions/util.js';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import {Search, playSong, StopPlayer, ResumePlayer, getAlbumTracks} from '../utilityFunctions/util.js';

import Artist from '../Components/Blocks/artist';
import Album from '../Components/Blocks/album';
import Song from '../Components/Blocks/songs';

import '../App.css';

let searchFilters = ['Top Results', 'Artist', 'Album', 'Track'];

let FilterItem = ({name, isActive, onClick}) => {
    let className = (isActive === name.replace(" ", "").toLowerCase()) ? 'active' : '';
    return <li onClick={() => onClick(name.replace(" ", "").toLowerCase())}className={className}>{name}</li>

}


let Loader = ({loading}) => {
  let display = (loading) ? 'block' : 'none';
  let loaderStyle = {display: display}
  return <div className="loader" style={loaderStyle}>Loading...</div>
}


class SearchSection extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        token: '',
        search: '',
        loading: false,
        activeFilter: 'artist',
        result: [],
        firing: false,
        
      }
      this.handleSearch = this.handleSearch.bind(this)
      this.clearSearch = this.clearSearch.bind(this)
      this.setSearchFilter = this.setSearchFilter.bind(this)
      this.PlaySong = this.PlaySong.bind(this)
    }
    componentDidMount() {
      document.getElementById('search-body').addEventListener('scroll', this.checkScroll);
        let token = StoreAPIToken();
        let expiration = Date.now() + 3600 * 1000; // add one hour in millaseconds
        if (token !== undefined){
            localStorage.setItem('token', token);
            localStorage.setItem('expiration', expiration);

        } else if ((((localStorage.getItem('expiration') - Date.now()) / 1000)) < 60) {
            localStorage.setItem('token', '');
            localStorage.setItem('expiration', 0);
            setupSpotify();
        }
        else {
            this.setState({
                ...this.state,
                token: localStorage.getItem('token')
            })
        }
        //getCategoriesList().then(data => console.log(data)); 
        }
    
    handleSearch({target}) {
      if (this.state.typingTimeout) {
        clearTimeout(this.state.typingTimeout);
      }
 
     this.setState({
        ...this.state,
        loading: true,
        search: target.value,
        result: [],
        typingTimeout: setTimeout(() => {
            let type = (this.state.activeFilter==='topresults') ? "album,artist,playlist,track" : this.state.activeFilter
            Search(this.state.search, type).then(result =>{
              console.log(result)
              this.setState({
                ...this.state,
                loading: false,
                result: result,
                offset: result[this.state.activeFilter.toLowerCase() + 's'].offset,
                total: result[this.state.activeFilter.toLowerCase() + 's'].total})
            })
          }, 500)
     });
    }

    clearSearch() {
      this.setState({
        ...this.state,
        search: '',
        loading: false,
        result: [],
      })
    }

    setSearchFilter = (name) => {
      document.getElementById('search-body').scrollTo(0, 0)
      this.setState({
        ...this.state,
        activeFilter: name
      })
      if(this.state.search !== '') {
        setTimeout(() => {
          let type = (this.state.activeFilter==='topresults') ? "album,artist,playlist,track" : this.state.activeFilter
          Search(this.state.search, type).then(result =>{
            console.log(result)
            this.setState({
              ...this.state,
              loading: false,
              result: result})
          })
        }, 10)
      }
    }

    PlaySong = (uri, active) => {
      console.log(this.state.result.tracks)
      if(!active) {
        let index = this.state.result.tracks.items.findIndex(track => track.uri === uri)
        let uris = JSON.stringify(this.state.result.tracks.items
          .slice(index, this.state.result.tracks.items.length)
          .map(track => {return track.uri})
        )
        console.log(uris)
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
          console.log(result)
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

    buildArtists = () => {
      let artists = []
      if (('artists' in this.state.result)){
        this.state.result.artists.items.forEach((artist, idx) => {
          artists.push(<Artist artist={artist} idx={idx}/>)
        })
      }
      return artists
    }

    buildAlbums = () => {
      let albums = []
      if (('albums' in this.state.result)){
        this.state.result.albums.items.forEach((album, idx) => {
          let active = (this.state.currentSong === album.id) ? true : false;
          albums.push(<Album handleClick={this.PlayAlbum} active={active} isPlaying={this.state.isPlaying} album={album} idx={idx}/>)
        })
      }
      return albums
    }

    buildTracks = () => {
      let tracks = []
      if (('tracks' in this.state.result)){
        this.state.result.tracks.items.forEach((track, idx) => {
          let active = (this.state.currentSong === track.uri) ? true : false;
          tracks.push(<Song handleClick={this.PlaySong} active={active} isPlaying={this.state.isPlaying} song={track} idx={idx}/>)
        })
      }
      return tracks
    }

    checkScroll = e => {
      const wrappedElement = document.getElementById('search-body');
      if (
        (( wrappedElement.scrollHeight - wrappedElement.scrollTop) < wrappedElement.clientHeight + 300)
        && (this.state.offset * 50 < this.state.total)
        && this.state.firing !== true) {
          if (this.state.activeFilter !== 'topresults'){
            this.setState({
              ...this.state,
              loading: true,
              offset: this.state.offset + 1,
              firing: true,
            })
            Search(
              this.state.search, 
              this.state.activeFilter,
              50,
              this.state.offset)
              .then(result =>{
                console.log(result)
                this.setState({
                  ...this.state,
                  loading: false,
                  firing: false,
                  result: {
                    ...this.state.result,
                    [this.state.activeFilter.toLowerCase() + 's'] : {
                      ...this.state.result[this.state.activeFilter.toLowerCase() + 's'],
                      items: [
                        ...this.state.result[this.state.activeFilter.toLowerCase() + 's'].items, 
                        ...result[this.state.activeFilter.toLowerCase() + 's'].items,
                      ],
                    },
                  }
              })
          })
      }
    }
  }

  
    render() {
      let artists = this.buildArtists();
      let albums = this.buildAlbums();
      let tracks = this.buildTracks();
      let sectionStyle = (tracks.length > 0) ? {height: '100%'} : {height: '0%'}

      let ListItems = [];
      searchFilters.forEach((name) => {
        ListItems.push(<FilterItem onClick={this.setSearchFilter} name={name} isActive={this.state.activeFilter}/>)
      })
      return (
          <div className="main">
            <div className="search-filter">
              <ul>
                {ListItems}
              </ul>
            </div>
            <div className="input-holder">
              <div className="search-icon"><SearchRoundedIcon/></div>
            <input className="search-input" autoComplete="off" onChange={(event) => this.handleSearch(event)} value={this.state.search} name="search" placeholder="Search..."/>
            <div  onClick={this.clearSearch} className="cancel-icon"><ClearRoundedIcon/></div>
            </div>
            <div className="search-body" id="search-body">
              {artists}
              {albums}
              <div className="songs-container" style={sectionStyle}>
                {tracks}
              </div>
              <Loader loading={this.state.loading}/>
            </div>
          </div>
      );
    }
  }

export default SearchSection