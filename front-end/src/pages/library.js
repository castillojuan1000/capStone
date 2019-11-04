import React from 'react';
import '.././style/library.css'
import PlaylistPage from '../pages/Playlist'
import { Link } from 'react-router-dom';
import Playlist from '../Components/Blocks/Playlistblock'

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
import Song from '../Components/Blocks/songs2';

import '../App.css';
import { element } from 'prop-types';

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
			activeFilter: searchFilters,
			result: this.props.searchState.result,
			likes: [],
			artists: [],
			playlists: [],
			personalized: []

		};
		console.info("these are your props", props)
		this.setSearchFilter = this.setSearchFilter.bind(this);
		this.PlaySong = this.PlaySong.bind(this);
	}

	componentDidMount = () => {
		getLikedAlbums().then(data => {
			this.setState({ ...this.state, albums: data.items })
		})
		getFollowedArtists().then(data => {

			this.setState({ ...this.state, artists: data.artists.items })
		})
		getLikedTracks().then(data => this.setState({ ...this.state, likes: data.items }))

		GetMyPlaylists().then(data =>

			this.setState({ ...this.state, playlists: data.items }))
		getPersonalizedTopTracks().then(data => this.setState({ ...this.state, personalized: data }))
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
			let index = this.state.likes.items.findIndex(
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
		if (this.state.artists) {
			artists = this.state.artists.map((artist, idx) => {
				return (<Artist artist={artist} idx={idx} />);
			});
		}
		return artists;
	};

	buildAlbums = () => {
		let albums = [];
		if (this.state.albums) {

			albums = this.state.albums.map((album, idx) => {
				let active = this.props.player.albumId === album.id ? true : false;
				return (
					<Album
						handleClick={this.PlayAlbum}
						active={active}
						isPlaying={this.state.isPlaying}
						album={album.album}
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
		if (this.state.likes) {

			this.state.likes.forEach((track, idx) => {
				let active = this.props.player.currentSong.uri === track.uri ? true : false;
				tracks.push(
					<Song
						handleClick={this.PlaySong}
						active={active}
						isPlaying={this.state.isPlaying}
						song={track.track}
						idx={idx}
					/>
				);
			});
		}
		return tracks;
	};
	buildPlaylist = () => {
		let playlists = [];
		if (this.state.result) {
			console.log(this.state.playlists)
			playlists = this.state.playlists.map((playlist, idx) => {
				let active = (this.props.player.playlistId === playlist.id) ? true : false;

				return (
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



	render() {
		console.info('likes below')
		console.info(this.state)
		console.info('likes above')
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
					<ul >{ListItems}</ul>
				</div>
				<div className='search-body' id='search-body'>
					{this.state.activeFilter === 'ARTISTS' && this.buildArtists()}
					{this.state.activeFilter === 'ALBUMS' && this.buildAlbums()}
					{this.state.activeFilter === 'LIKED SONGS' && this.buildTracks()}
					{/* <Link  {...this.state.activeFilter === 'PLAYLISTS' && this.buildPlaylist()} to={{ pathname: '/playlist/:id' }} >

					</Link> */}





					<Loader loading={this.props.searchState.loading} />
				</div>
			</div>
		);
	}
}

export default withRouter(LibrarySection)
