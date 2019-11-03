import React from 'react';

import {
	playSong,
	StopPlayer,
	ResumePlayer,
	getColor,
	getAlbum,
} from '../utilityFunctions/util.js';
import { withRouter } from 'react-router-dom';
import Album from '../Components/Blocks/album';
import Song from '../Components/Blocks/albumSongs';

import '../App.css';
import '../albumPage.css';

import * as Vibrant from 'node-vibrant';


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
				albumObj: result,
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
		img.addEventListener('load', function () {
			Vibrant.from(img, 5).getPalette((err, palette) => {
				let colors = {
					Vibrant: getColor(palette, 'Vibrant'),
					DarkMuted: getColor(palette, 'DarkMuted'),
					DarkVibrant: getColor(palette, 'DarkVibrant'),
					LightVibrant: getColor(palette, 'LightVibrant'),
					Muted: getColor(palette, 'Muted'),
				};
				_.setState({
					...this.state,
					vibrant: colors.vibrant,
					dark: colors.DarkMuted,
					muted: colors.Muted,
					darkvibrant: colors.DarkVibrant,
					colors: colors,
				})
				_.props.SetSecondaryColors(colors)
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
			let newItems = [];
			this.state.tracks
				.slice(index, this.state.tracks.length)
				.concat(this.state.tracks.slice(0, index - 1))
				.forEach((track, idx) => {
					track.order = idx;
					track.album = {
						images: this.state.albumObj.images,
					}
					newItems.push(track)
				})
			this.props.ResetQueue(newItems)
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
				//hege.slice(1).concat(stale.slice(1)).forEach((item, idx) => list.push(item + idx))

			);
		} else if ((active, this.props.player.isPlaying === false)) {
			ResumePlayer();
			this.props.togglePlay();
		} else {
			StopPlayer();
			this.props.togglePlay();
		}
	};

	PlayAlbum = id => {
		var albumId = window.location.pathname.split('/')[2];
		let active = this.props.player.albumId === albumId ? true : false;
		if (!active) {
			let uris = JSON.stringify(
				this.state.tracks.map(track => {
					return track.uri;
				})
			);
			playSong(uris);
			let newItems = [];
			this.state.tracks
				.forEach((track, idx) => {
					track.order = idx;
					track.album = {
						images: this.state.albumObj.images,
					}
					newItems.push(track)
				})
			this.props.ResetQueue(newItems)
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
		let scrollStyle = {
			scrollbarColor: `${this.state.vibrant} rgba(0,0,0, 0.2)`
		};
		let tracks = this.buildTracks();
		return (
			<div className='page-content' style={backStyle}>
				<div className='album-container'>
					<div className='album-image'>
						<div className='img-wrapper'>
							<img src={this.state.albumImg} alt={`cover art for ${this.state.albumName}`} />
						</div>
						<div className='album-description-holder'>
							<h1>{this.state.albumName}</h1>
							<h3>{this.state.artistName}</h3>
							<button
								onClick={this.PlayAlbum}
								className='btn btn-primary btn-primary2'>
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
