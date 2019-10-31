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
	getAlbumTracks,
	getAlbum
} from '../utilityFunctions/util.js';
import { withRouter } from 'react-router-dom';
import Artist from '../Components/Blocks/artist';
import Album from '../Components/Blocks/album';
import Song from '../Components/Blocks/albumSongs';

import '../App.css';
import '../albumPage.css';

import * as Vibrant from 'node-vibrant';
let searchFilters = ['Top Results', 'Artist', 'Album', 'Track'];

let FilterItem = ({ name, isActive, onClick }) => {
	let className =
		isActive === name.replace(' ', '').toLowerCase() ? 'active' : '';
	return (
		<li
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

class AlbumPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			token: '',
			loading: true,
			activeFilter: 'artist',
			result: [],
			firing: false,
			tracks: [],
			vibrant: 'green'
		};
		this.PlaySong = this.PlaySong.bind(this);
		console.info('props below');
		console.info(props);
	}
	componentDidMount() {
		var albumId = window.location.pathname.split('/')[2];
		getAlbum(albumId).then(result => {
			let copyRight =
				result.copyrights.length > 0 ? result.copyrights[0].text : '';
			this.setState({
				...this.state,
				artistName: result.artists[0].name,
				artistId: result.artists[0].id,
				albumImg: result.images[0].url,
				albumName: result.name,
				tracks: result.tracks.items,
				loading: false,
				trackCount: result.total_tracks,
				albumYear: new Date(result.release_date).getFullYear(),
				copyRight: copyRight
			});
			this.setColor(result.images[0].url);
		});
	}

	setColor = url => {
		let _ = this;
		let img = new Image();
		img.crossOrigin = 'Anonymous';
		img.src = url;
		img.addEventListener('load', function() {
			Vibrant.from(img, 5).getPalette((err, palette) => {
				let rgb = palette.Vibrant._rgb;
				let dark = palette.DarkMuted._rgb;
				let darkvibrant = palette.DarkVibrant._rgb;
				let muted = palette.LightVibrant._rgb;
				console.log(palette);
				dark = `RGBA(${dark[0]}, ${dark[1]}, ${dark[2]}, 1)`;
				let color = `RGBA(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;
				muted = `RGBA(${muted[0]}, ${muted[1]}, ${muted[2]}, 1)`;
				darkvibrant = `RGBA(${darkvibrant[0]}, ${darkvibrant[1]}, ${
					darkvibrant[2]
				}, 1)`;
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

	PlaySong = (uri, active) => {
		if (!active) {
			let index = this.state.tracks.findIndex(track => track.uri === uri);
			let currentSongs = this.state.tracks
				.slice(index, this.state.tracks.length)
				.map(track => {
					return track.uri;
				});
			let previousSongs = this.state.tracks.slice(0, index).map(track => {
				return track.uri;
			});
			let uris = JSON.stringify([...currentSongs, ...previousSongs]);
			playSong(uris).then(result =>
				this.setState({
					...this.state,
					currentSong: uri,
					isPlaying: true
				})
			);
		} else if ((active, this.props.player.isPlaying === false)) {
			ResumePlayer();
		} else {
			StopPlayer();
		}
	};

	PlayAlbum = id => {
		var albumId = window.location.pathname.split('/')[2];
		let active = this.props.player.albumId === albumId ? true : false;
		if (!active) {
			getAlbumTracks(id).then(result => {
				let uris = JSON.stringify(
					result.items.map(track => {
						return track.uri;
					})
				);

				playSong(uris);
			});
		} else if ((active, this.props.player.isPlaying === false)) {
			ResumePlayer();
			this.props.togglePlay();
		} else {
			this.props.togglePlay();
			StopPlayer();
		}
	};

	buildAlbums = () => {
		let albums = [];
		if ('albums' in this.state.result) {
			this.state.result.albums.items.forEach((album, idx) => {
				let active = this.props.player.albumId === album.id ? true : false;
				albums.push(
					<Album
						handleClick={this.PlayAlbum}
						active={active}
						isPlaying={this.props.player.isPlaying}
						album={album}
						idx={idx}
					/>
				);
			});
		}
		return albums;
	};

	buildTracks = () => {
		let tracks = [];
		this.state.tracks.forEach((track, idx) => {
			let active = this.props.player.currentSongId === track.id ? true : false;
			tracks.push(
				<Song
					albumName={this.state.albumName}
					image={this.state.albumImg}
					handleClick={this.PlaySong}
					active={active}
					isPlaying={this.props.player.isPlaying}
					song={track}
					idx={idx}
				/>
			);
		});
		return tracks;
	};

	render() {
		var albumId = window.location.pathname.split('/')[2];
		let Play =
			this.props.player.albumId === albumId && this.props.player.isPlaying
				? 'Pause'
				: 'Play';
		let backStyle = {
			background: `linear-gradient(160deg, ${this.state.darkvibrant} 15%, rgba(0,0,0, 0.9) 70%)`
		};
		let vibrantStyle = {
			backgroundColor: 'rgba(0,0,0, 0.75)',
			color: this.state.vibrant,
			border: `2px solid ${this.state.vibrant}`
		};
		let scrollStyle = {
			scrollbarColor: `${this.state.vibrant} rgba(0,0,0, 0.2)`
		};
		let tracks = this.buildTracks();
		return (
			<div className='page-content' style={backStyle}>
				<div className='album-container'>
					<div className='album-image'>
						<div className='img-wrapper'>
							<img src={this.state.albumImg}></img>
						</div>
						<div className='album-description-holder'>
							<h1>{this.state.albumName}</h1>
							<h3>{this.state.artistName}</h3>
							<button
								style={vibrantStyle}
								onClick={this.PlayAlbum}
								className='btn btn-primary'>
								{Play}
							</button>
							<p>
								{this.state.albumYear} • {this.state.trackCount} songs
							</p>
						</div>
					</div>
					<div className='album-songs' style={scrollStyle}>
						{tracks}
						<p>{this.state.copyRight}</p>
					</div>
					<Loader loading={this.state.loading} />
				</div>
			</div>
		);
	}
}

export default withRouter(AlbumPage);
