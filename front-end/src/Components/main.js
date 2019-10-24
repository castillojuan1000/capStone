import React from 'react';
import {StoreAPIToken, setupSpotify, getCategoriesList} from '../utilityFunctions/util.js';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import {Search} from '../utilityFunctions/util.js';
import  { Redirect } from 'react-router-dom'

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

let Artist = ({artist}) => {
    let image = (artist.images.length > 0) ? artist.images[1].url : 'https://via.placeholder.com/150'
    let backgroundStyle = {backgroundImage: `url(${image})`,}
    return (
            <div className="artist-block">
              <div style={backgroundStyle} className="artist-img">
              </div>
              <div className="artist-description">
                <h3>{artist.name}</h3>
              </div>
            </div>)
}


class Main extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        token: '',
        search: '',
        loading: false,
        activeFilter: 'artist',
        result: [],
        
      }
      this.handleSearch = this.handleSearch.bind(this)
      this.clearSearch = this.clearSearch.bind(this)
      this.setSearchFilter = this.setSearchFilter.bind(this)
    }
    componentDidMount() {
        let token = StoreAPIToken();
        let expiration = Date.now() + 3600 * 1000; // add one hour in millaseconds
        if (token !== undefined){
            localStorage.setItem('token', token);
            localStorage.setItem('expiration', expiration);

        } else if ((((localStorage.getItem('expiration') - Date.now()) / 1000)) < 60) {
            console.log(1)
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
                result: result})
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
      this.setState({
        ...this.state,
        activeFilter: name
      })
    }
  
    render() {
      let artists = [];
      let ListItems = [];
      if (this.state.result.artists){
        this.state.result.artists.items.forEach((artist) => {
          console.log(artist)
          artists.push(<Artist artist={artist}/>)
        })
    }
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
            <div onClick={this.clearSearch} className="cancel-icon"><ClearRoundedIcon/></div>
            </div>
            <div className="search-body">
              {artists}
              <Loader loading={this.state.loading}/>
            </div>
          </div>
      );
    }
  }

export default Main