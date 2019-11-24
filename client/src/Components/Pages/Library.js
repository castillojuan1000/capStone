import React from 'react';
import '../../style/library.css'
import PlaylistBlock from '../Blocks/Playlistblock'
import * as Vibrant from 'node-vibrant';
import { getColor } from '../../utilityFunctions/util.js';
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
} from '../../utilityFunctions/util.js';
import { withRouter } from 'react-router-dom';
import Artist from '../Blocks/artist';
import Album from '../Blocks/album';
import Song from '../Blocks/songs2';

import '../../App.css';
let searchFilters = ['PLAYLISTS', 'LIKED SONGS', 'ALBUMS', 'ARTISTS'];

let FilterItem = ({ name, isActive, onClick, color }) => {
	let borderBottom = (isActive) ? { borderBottom: `3px solid ${color}` } : {}
	let className =
		isActive === name ? 'active' : '';
	return (
		<li
			onClick={() => onClick(name)}
			className={className}
			style={borderBottom}
		>
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
			activeFilter: 'LIKED SONGS',
			result: this.props.searchState.result,
			likes: [],
			artists: [],
			playlists: [],
			personalized: []

		};
		this.setSearchFilter = this.setSearchFilter.bind(this);
		this.PlaySong = this.PlaySong.bind(this);
	}

	setColor = url => {
		let _ = this;
		let img = new Image();
		img.crossOrigin = 'Anonymous';
		img.src = url;
		img.addEventListener('load', function () {
			Vibrant.from(img, 5).getPalette((err, palette) => {
				let colors = {
					Vibrant: getColor(palette, 'Vibrant'),
					DarkMuted: getColor(palette, 'DarkMuted'),
					DarkVibrant: getColor(palette, 'DarkVibrant'),
					LightVibrant: getColor(palette, 'LightVibrant'),
					Muted: getColor(palette, 'Muted')
				};
				_.props.SetSecondaryColors(colors);
				_.setState({
					...this.state,
					vibrant: colors.vibrant,
					dark: colors.DarkMuted,
					muted: colors.Muted,
					colors: colors
				});
			});
		});
	};


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
			let index = this.state.likes.findIndex(
				like => like.track.uri === uri
			);

			let uris = JSON.stringify(

				this.state.likes
					.slice(index, this.state.likes.length)
					.map(like => {
						return like.track.uri;
					})
			);
			playSong(uris)
		} else if ((active, this.state.isPlaying === false)) {
			ResumePlayer()
		} else {
			StopPlayer()
		}
	};

	PlayPlaylist = (id, active = false) => {
		if (!active) {
			getAlbumTracks(id).then(result => {
				let uris = JSON.stringify(
					result.items.map(track => {
						return track.uri;
					})
				);
				playSong(uris).then(success =>
					this.setState({
						...this.state,
						currentSong: id,
						isPlaying: true
					})
				);
			});
		} else if ((active, this.state.isPlaying === false)) {
			ResumePlayer()
		} else {
			StopPlayer()
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
		if (this.state.likes.length > 0) {
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
		const playlists = this.state.playlists.map((playlist, idx) => {
			let active = (this.props.player.playlistId === playlist.id) ? true : false;
			return (
				<PlaylistBlock
					handleClick={() => this.PlayPlaylist(playlist.id)}
					active={active}
					isPlaying={this.props.player.isPlaying}
					playlist={playlist}
					idx={idx}
					libraryState={this.state}
				/>
			)
		})
		return playlists;
	}



	render() {

		let ListItems = [];
		searchFilters.forEach(name => {
			let isActive = (name === this.state.activeFilter) ? true : false
			ListItems.push(
				<FilterItem
					onClick={this.setSearchFilter}
					name={name}
					isActive={isActive}
					color={this.props.player.colors.vibrant}
				/>
			);
		});
		let backStyle = {
			background: `linear-gradient(160deg, ${this.props.player.colors.darkVibrant} 15%, rgba(0,0,0, 0.9) 70%)`
		};
		return (
			<div className='main' style={backStyle}>
				<div className='search-filter'>
					<ul >{ListItems}</ul>
				</div>
				<div className='search-body' id='search-body' style={{ paddingLeft: '10%' }}>
					{this.state.activeFilter === 'ARTISTS' && this.buildArtists()}
					{this.state.activeFilter === 'ALBUMS' && this.buildAlbums()}
					{this.state.activeFilter === 'LIKED SONGS' && this.buildTracks()}
					{this.state.activeFilter === 'PLAYLISTS' && this.buildPlaylist()}
					<Loader loading={this.props.searchState.loading} />
				</div>
			</div>
		);
	}
}

export default withRouter(LibrarySection)
