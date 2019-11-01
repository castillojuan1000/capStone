import React from 'react';
import {
	StoreAPIToken,
	setupSpotify,
	getCategoriesList
} from '../utilityFunctions/util.js';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import {
	Search,
	playSong,
	StopPlayer,
	ResumePlayer,
	getAlbumTracks
} from '../utilityFunctions/util.js';
import { withRouter,  Redirect, push } from 'react-router-dom';
import Artist from '../Components/Blocks/artist';
import Album from '../Components/Blocks/album';
import Song from '../Components/Blocks/songs';

import history from '../history';

import '../App.css';

let searchFilters = ['Top Results', 'Artist', 'Album', 'Track'];

let FilterItem = ({ name, isActive, onClick, color}) => {
	let className =
		isActive === name.replace(' ', '').toLowerCase() ? 'active' : '';
	let border = 
		(isActive === name.replace(' ', '').toLowerCase()) ? {borderBottom: `2px solid ${color}`} : {};
	return (
		<li
			style={border}
			onClick={() => onClick(name.replace(' ', '').toLowerCase())}
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



class SearchSection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			token: this.props.spotifyData.token,
			search: this.props.searchState.search,
			loading: this.props.searchState.loading,
			activeFilter: this.props.searchState.activeFilter,
			result: this.props.searchState.result,
			firing: false,
		};
		this.handleSearch = this.handleSearch.bind(this);
		this.setSearchFilter = this.setSearchFilter.bind(this);
		this.PlaySong = this.PlaySong.bind(this);
	}
	componentDidMount() {
		document
			.getElementById('search-body')
			.addEventListener('scroll', this.checkScroll);
		let token = StoreAPIToken();
		let expiration = Date.now() + 3600 * 1000; // add one hour in millaseconds
		if (token !== undefined) {
			localStorage.setItem('token', token);
			localStorage.setItem('expiration', expiration);
		} else if ((localStorage.getItem('expiration') - Date.now()) / 1000 < 60) {
			localStorage.setItem('token', '');
			localStorage.setItem('expiration', 0);
			setupSpotify();
		}
		const wrappedElement = document.getElementById('search-body');
		wrappedElement.scrollTo(0, this.props.searchState.scroll)
	}

	handleSearch({ target }) {
		this.props.setSearch(target)
		if (this.state.typingTimeout) {
			clearTimeout(this.state.typingTimeout);
		}
		/* if (this.props.searchState.search === '' && this.props.searchState.loading === true) {
			this.props.clearSearchState()
		} */

		this.setState({
			typingTimeout: setTimeout(() => {
				let type =
					this.props.searchState.activeFilter === 'topresults'
						? 'album,artist,playlist,track'
						: this.props.searchState.activeFilter;
				Search(this.props.searchState.search, type).then(result => {
					this.props.setSearchResult(result)
				});
			}, 500)
		});
	}



	setSearchFilter = name => {
		document.getElementById('search-body').scrollTo(0, 0);
		this.props.setSearchFilter(name)
		if (this.props.searchState.search !== '') {
			setTimeout(() => {
				let type =
					this.props.searchState.activeFilter === 'topresults'
						? 'album,artist,playlist,track'
						: this.props.searchState.activeFilter;
				Search(this.props.searchState.search, type).then(result => {
					this.props.setSearchResult(result)
				});
			}, 10);
		}
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
			playSong(uris).then(data => {
				let queue = this.props.searchState.result.tracks.items.slice(index, this.props.searchState.result.tracks.items.length)
				this.props.ResetQueue(queue)
			});
		} else if ((active, this.state.isPlaying === false)) {
			ResumePlayer();
		} else {
			StopPlayer();
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
				
				playSong(uris).then(success =>
					this.setState({
						...this.state,
						currentSong: id,
						isPlaying: true
					})
				);
			});
		} else if ((active, this.state.isPlaying === false)) {
			ResumePlayer();
		} else {
			StopPlayer();
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

	checkScroll = e => {
		const wrappedElement = document.getElementById('search-body');
		this.props.setCurrentScroll(wrappedElement.scrollTop)
		if (
			wrappedElement.scrollHeight - wrappedElement.scrollTop <
				wrappedElement.clientHeight + 300 &&
			this.props.searchState.offset * 50 < this.props.searchState.total &&
			this.state.firing !== true
		) {
			if (this.state.activeFilter !== 'topresults') {
				this.setState({
					...this.state,
					firing: true,
				});
				Search(
					this.props.searchState.search,
					this.props.searchState.activeFilter,
					50,
					this.props.searchState.offset + 1 * 50
				).then(result => {
					this.props.extendSearchResults(result)
					this.setState({
						...this.state,
						firing: false,
					});
				});
			}
		}
	};

	render() {
		let searchLeft = {
			borderLeft: `2px solid ${this.props.player.colors.vibrant}`,
			borderTop: `2px solid ${this.props.player.colors.vibrant}`,
			borderBottom: `2px solid ${this.props.player.colors.vibrant}`
		}
		let searchRight = {
			borderRight: `2px solid ${this.props.player.colors.vibrant}`,
			borderTop: `2px solid ${this.props.player.colors.vibrant}`,
			borderBottom: `2px solid ${this.props.player.colors.vibrant}`
		}
		let searchInput = {
			borderTop: `2px solid ${this.props.player.colors.vibrant}`,
			borderBottom: `2px solid ${this.props.player.colors.vibrant}`
		}
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
					isActive={this.props.searchState.activeFilter}
					color={this.props.player.colors.vibrant}
				/>
			);
		});
		return (
			<div className='main'>
				<div className='search-filter'>
					<ul>{ListItems}</ul>
				</div>
				<div className='input-holder'>
					<div className='search-icon' style={searchLeft} >
						<SearchRoundedIcon />
					</div>
					<input
						className='search-input'
						autoComplete='off'
						onChange={event => this.handleSearch(event)}
						value={this.props.searchState.search}
						name='search'
						placeholder='Search...'
						style={searchInput}
					/>
					<div onClick={this.props.clearSearchState} className='cancel-icon' style={searchRight}>
						<ClearRoundedIcon />
					</div>
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

export default withRouter(SearchSection)
