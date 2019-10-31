import React from 'react';


import {
	playSong,
	StopPlayer,
	ResumePlayer,
    getAlbumTracks,
    getLikedTracks,
    getLikedAlbums, 
    getFollowedArtists,
    GetMyPlaylists, 
    getPersonalizedTopTracks
} from '../utilityFunctions/util.js';
import { withRouter } from 'react-router-dom';
import Artist from '../Components/Blocks/artist';
import Album from '../Components/Blocks/album';
import Song from '../Components/Blocks/songs';

import '../App.css';

let searchFilters = ['PLAYLISTS', 'MADE FOR YOU', 'LIKED SONGS', 'ALBUMS', 'ARTISTS'];

let FilterItem = ({ name, isActive, onClick }) => {
	let className =
        isActive === name ? 'active' : '';
	return (
		<li
			onClick={() => onClick(name)}
			className={className}>
			{name}
		</li>
	);
};

let Loader = ({ loading }) => {
	let display = loading ? 'block' : 'none';
	let loaderStyle = { display: display };
	return (
		<div className='loader' style={loaderStyle}>
			Loading...
		</div>
	);
};



class LibrarySection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			token: this.props.spotifyData.token,
			loading: this.props.searchState.loading,
			activeFilter: 'PLAYLISTS',
			result: this.props.searchState.result,
        };
        console.info("these are your props", props)
		this.setSearchFilter = this.setSearchFilter.bind(this);
		this.PlaySong = this.PlaySong.bind(this);
    }

	componentDidMount = () => {
        getLikedAlbums().then(data => {
            console.info(data)
            this.setState({...this.state, albums: data})
        })
        getFollowedArtists().then(data => this.setState({...this.state, artists: data}))
        getLikedTracks().then(data => this.setState({...this.state, likes: data}))
        GetMyPlaylists().then(data => this.setState({...this.state, playlists: data}))
        getPersonalizedTopTracks().then(data => this.setState({...this.state, personalized: data}))
	}


	setSearchFilter = name => {
		document.getElementById('search-body').scrollTo(0, 0);
		this.setState({
            ...this.state,
            activeFilter: name,
        })
	};

	PlaySong = (uri, active) => {
		if (!active) {
			let index = this.props.searchState.result.tracks.items.findIndex(
				track => track.uri === uri
			);
			let uris = JSON.stringify(
				this.props.searchState.result.tracks.items
					.slice(index, this.props.searchState.result.tracks.items.length)
					.map(track => {
						return track.uri;
					})
			);
			console.log(uris);
			playSong(uris).then(result =>
				console.log(result)
			);
		} else if ((active, this.state.isPlaying === false)) {
			ResumePlayer().then(() =>
			console.log(0)
			);
		} else {
			StopPlayer().then(() =>
			console.log(1)
			);
		}
	};

	PlayAlbum = (id, active = false) => {
		if (!active) {
			getAlbumTracks(id).then(result => {
				let uris = JSON.stringify(
					result.items.map(track => {
						return track.uri;
					})
				);
				console.log(result);
				playSong(uris).then(success =>
					this.setState({
						...this.state,
						currentSong: id,
						isPlaying: true
					})
				);
			});
		} else if ((active, this.state.isPlaying === false)) {
			ResumePlayer().then(() =>
				console.log(1)
			);
		} else {
			StopPlayer().then(() =>
				console.log(2)
			);
		}
	};

	buildArtists = () => {
		let artists = [];
		if ('artists' in this.props.searchState.result) {
			this.props.searchState.result.artists.items.forEach((artist, idx) => {
				artists.push(<Artist artist={artist} idx={idx} />);
			});
		}
		return artists;
	};

	buildAlbums = () => {
		let albums = [];
		if ('albums' in this.props.searchState.result) {
			this.props.searchState.result.albums.items.forEach((album, idx) => {
				let active = this.props.player.albumId === album.id ? true : false;
				albums.push(
					<Album
						handleClick={this.PlayAlbum}
						active={active}
						isPlaying={this.state.isPlaying}
						album={album}
						idx={idx}
						searchState={this.state}
					/>
				);
			});
		}
		return albums;
	};

	buildTracks = () => {
		let tracks = [];
		if ('tracks' in this.props.searchState.result) {
			this.props.searchState.result.tracks.items.forEach((track, idx) => {
				let active = this.props.player.currentSong.uri === track.uri ? true : false;
				tracks.push(
					<Song
						handleClick={this.PlaySong}
						active={active}
						isPlaying={this.state.isPlaying}
						song={track}
						idx={idx}
					/>
				);
			});
		}
		return tracks;
	};

	render() {
        console.info('likes below')
        console.info(this.state)
        console.info('likes above')
		let artists = this.buildArtists();
		let albums = this.buildAlbums();
		let tracks = this.buildTracks();
		let sectionStyle =
			tracks.length > 0 ? { height: '100%' } : { height: '0%' };

		let ListItems = [];
		searchFilters.forEach(name => {
			ListItems.push(
				<FilterItem
					onClick={this.setSearchFilter}
					name={name}
					isActive={this.state.activeFilter}
				/>
			);
		});
		return (
			<div className='main'>
				<div className='search-filter'>
					<ul>{ListItems}</ul>
				</div>
				<div className='search-body' id='search-body'>
					{artists}
					{albums}
					<div className='songs-container' style={sectionStyle}>
						{tracks}
					</div>
					<Loader loading={this.props.searchState.loading} />
				</div>
			</div>
		);
	}
}

export default withRouter(LibrarySection)
