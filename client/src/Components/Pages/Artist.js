import React from 'react';
import {
	getArtist,
	getArtistTopTracks,
	getArtistAlbums
} from '../../utilityFunctions/util.js';
import { getColor } from '../../utilityFunctions/util.js';
import Album from '../Blocks/album';
import Song from '../Blocks/songs/albumSongs';
import { withRouter } from 'react-router-dom';
import '../../App.css';
import '../../style/artistPage.css';

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

class Artist extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			token: '',
			loading: true,
			activeFilter: 'artist',
			result: [],
			tracks: [],
			vibrant: 'green',
			colors: {}
		};
		this.PlaySong = this.PlaySong.bind(this);
	}
	componentDidMount() {
		var artistId = this.props.match.params.id;
		getArtist(artistId).then(result => {
			getArtistTopTracks(artistId).then(tracks => {
				getArtistAlbums(artistId).then(albums => {
					this.setState({
						...this.state,
						artistName: result.name,
						artistId: result.id,
						artistImg: result.images[0].url,
						followers: result.followers.total
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
						loading: false,
						tracks: tracks.tracks,
						albums: albums
					});
					this.setColor(tracks.tracks[0].album.images[0].url);
				});
			});
		});
	}

	PlayArtist = (active = false) => {
		let { playSong, ResumePlayer, StopPlayer } = this.props.spotifyData.player;
		if (!active) {
			let newItems = [];
			this.state.tracks.forEach((track, idx) => {
				track.order = idx;
				newItems.push(track);
			});
			this.props.ResetQueue(newItems);
			let uris = JSON.stringify(
				this.state.tracks.map(track => {
					return track.uri;
				})
			);

			playSong(uris).then(success =>
				this.setState({
					...this.state,
					currentSong: this.state.tracks[0].id,
					isPlaying: true
				})
			);
		} else if ((active, this.state.isPlaying === false)) {
			ResumePlayer();
		} else {
			StopPlayer();
		}
	};

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

	PlaySong = (uri, active) => {
		let { playSong, ResumePlayer, StopPlayer } = this.props.spotifyData.player;
		if (!active) {
			let index = this.state.tracks.findIndex(track => track.uri === uri);
			this.setColor(this.state.tracks[index].album.images[0].url);
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
			let newItems = [];
			this.state.tracks
				.slice(index, this.state.tracks.length)
				.concat(this.state.tracks.slice(0, index - 1))
				.forEach((track, idx) => {
					track.order = idx;
					newItems.push(track);
				});
			this.props.ResetQueue(newItems);
		} else if (active && this.state.isPlaying === false) {
			ResumePlayer().then(() =>
				this.setState({
					...this.state,
					isPlaying: true
				})
			);
		} else {
			StopPlayer().then(() =>
				this.setState({
					...this.state,
					isPlaying: false
				})
			);
		}
	};

	PlayAlbum = (id, active = false) => {
		let {
			getAlbumTracks,
			getAlbum,
			playSong,
			ResumePlayer,
			StopPlayer
		} = this.props.spotifyData.player;
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
				getAlbum(id).then(data => {
					let newItems = [];
					result.items.forEach((track, idx) => {
						track.order = idx;
						track.album = {
							images: data.images
						};
						newItems.push(track);
					});
					this.props.ResetQueue(newItems);
				});
			});
		} else if (active && this.state.isPlaying === false) {
			ResumePlayer().then(() =>
				this.setState({
					...this.state,
					isPlaying: true
				})
			);
		} else {
			StopPlayer().then(() =>
				this.setState({
					...this.state,
					isPlaying: false
				})
			);
		}
	};

	buildAlbums = () => {
		let albums = [];
		let singles = [];
		let features = [];
		if (this.state.albums) {
			let albumCount = 0;
			let singleCount = 0;
			let featureCount = 0;
			this.state.albums.items.forEach((album, idx) => {
				if (album.album_group === 'album' && albumCount < 10) {
					albumCount++;
					let active = this.props.player.albumId === album.id ? true : false;
					albums.push(
						<Album
							handleClick={this.PlayAlbum}
							active={active}
							isPlaying={this.state.isPlaying}
							album={album}
							idx={idx}
						/>
					);
				} else if (album.album_group === 'single' && singleCount < 10) {
					singleCount++;
					let active = this.props.player.albumId === album.id ? true : false;
					singles.push(
						<Album
							handleClick={this.PlayAlbum}
							active={active}
							isPlaying={this.state.isPlaying}
							album={album}
							idx={idx}
						/>
					);
				} else if (album.album_group === 'appears_on' && featureCount < 10) {
					featureCount++;
					let active = this.props.player.albumId === album.id ? true : false;
					features.push(
						<Album
							handleClick={this.PlayAlbum}
							active={active}
							isPlaying={this.state.isPlaying}
							album={album}
							idx={idx}
						/>
					);
				}
			});
		}
		return [albums, singles, features];
	};

	buildTracks = () => {
		let tracks = [];
		this.state.tracks.forEach((track, idx) => {
			let active = this.props.player.currentSongId === track.id ? true : false;
			tracks.push(
				<Song
					albumName={this.state.albumName}
					image={track.album.images[0].url}
					handleClick={this.PlaySong}
					active={active}
					isPlaying={this.state.isPlaying}
					song={track}
					idx={idx}
				/>
			);
		});
		return tracks;
	};

	render() {
		let backStyle = {
			background: `linear-gradient(160deg, ${this.state.colors.DarkVibrant} 15%, rgba(0,0,0, 0.9) 70%)`
		};
		let bannerStyle = { backgroundImage: `url('${this.state.artistImg}')` };
		// let vibrantStyle = {backgroundColor: "rgba(0,0,0, 0.75)", color: this.state.vibrant}
		let scrollStyle = {
			scrollbarColor: `${this.state.vibrant} rgba(0,0,0, 0.2)`
		};
		let tracks = this.buildTracks();
		let [albums, singles, features] = this.buildAlbums();
		return (
			<div className='artist-page' style={backStyle}>
				<div className='artist-top-section'>
					<div className='left-section'>
						<div className='artist-banner' style={bannerStyle}></div>
					</div>
					<div className='artist-description'>
						<h1>{this.state.artistName}</h1>
						<div className='artist-btn-row'>
							<div>
								<button
									className='btn btn-primary'
									onClick={() => {
										this.PlayArtist();
									}}>
									Play
								</button>
							</div>
							<div>
								<button className='btn btn-secondary'>Follow</button>
							</div>
						</div>
						<h3>Followers {this.state.followers}</h3>
					</div>
				</div>
				<div>
					<div className='artist-content' style={scrollStyle}>
						<div className='album-songs2'>
							<Loader loading={this.state.loading} />
							<h2>Top Tracks</h2>
							{tracks}
						</div>
						<div className='artist-albums-holder'>
							<h2>Albums</h2>
							{albums}
						</div>
						<div className='artist-albums-holder'>
							<h2>Singles</h2>
							{singles}
						</div>
						<div className='artist-albums-holder'>
							<h2>Features</h2>
							{features}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default withRouter(Artist);
