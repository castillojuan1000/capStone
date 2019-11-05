import React from 'react';

import * as Vibrant from 'node-vibrant';
import CreateRoombutton from './CreateRoomButton';
import { getColor } from '../../utilityFunctions/util.js';
import Song from '../../Components/Blocks/songshort';

class Playlist extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			tracks: [],
			colors: {
				DarkMuted: 'black',
				Vibrant: 'white',
				DarkVibrant: 'red',
				LightVibrant: 'green',
				Muted: 'blue'
			}
		};
	}

	setColor = url => {
		let img = new Image();
		img.crossOrigin = 'Anonymous';
		img.src = url;
		img.addEventListener('load', () => {
			Vibrant.from(img).getPalette((err, palette) => {
				let colors = {
					Vibrant: getColor(palette, 'Vibrant'),
					DarkMuted: getColor(palette, 'DarkMuted'),
					DarkVibrant: getColor(palette, 'DarkVibrant'),
					LightVibrant: getColor(palette, 'LightVibrant'),
					Muted: getColor(palette, 'Muted')
				};

				this.setState({
					...this.state,
					colors: colors
				});
			});
		});
	};

	setActive = () => {
		if (this.state.tracks.length === 0) {
			this.props.getPlaylistTracks(this.props.playlist.id).then(data => {
				this.setState({
					...this.state,
					active: !this.state.active,
					tracks: data.items
				});
			});
		} else {
			this.setState({
				...this.state,
				active: !this.state.active
			});
		}
	};

	componentDidMount = () => {
		this.setColor(this.props.playlist.images[0].url);
	};

	handleClick = (id, active) => {
		if (!active) {
			let index = this.state.tracks.findIndex(track => track.track.id === id);
			let currentSongs = this.state.tracks
				.slice(index, this.state.tracks.length)
				.map(track => {
					return track.track.uri;
				});
			let newItems = [];
			this.state.tracks
				.slice(index, this.state.tracks.length)
				.concat(this.state.tracks.slice(0, index - 1))
				.forEach((track, idx) => {
					track.track.order = idx;
					track.track.album = {
						images: track.track.album.images
					};
					newItems.push(track);
				});
			this.props.ResetQueue(newItems);
			let previousSongs = this.state.tracks.slice(0, index).map(track => {
				return track.track.uri;
			});
			let uris = JSON.stringify([...currentSongs, ...previousSongs]);
			this.props.playSong(uris);
		} else if ((active, this.props.isPlaying === false)) {
			this.props.player.ResumePlayer();
		} else {
			this.props.player.StopPlayer();
		}
	};

	buildTracks = () => {
		let tracks = [];
		this.state.tracks.forEach((track, idx) => {
			let active = this.props.currentURI === track.track.uri ? true : false;
			tracks.push(
				<Song
					handleClick={this.handleClick}
					active={active}
					isPlaying={this.props.isPlaying}
					song={track.track}
					idx={idx}
				/>
			);
		});
		return tracks;
	};

	render = () => {
		let bodyStyle = { height: '0em', background: 'rgba(0,0,0, 0)' };
		if (this.state.active) {
			bodyStyle = { height: '', background: 'rgba(0,0,0, 0.7)' };
		}
		let tracks = this.buildTracks();
		let containerStyle = {
			backgroundSize: '800vw 800vw',
			animation: 'rotate 20s ease infinite',
			background: `linear-gradient(160deg, 
                ${this.state.colors.Vibrant}, 
                ${this.state.colors.DarkMuted})`
		};
		return (
			<div className='playlist-section' style={containerStyle}>
				<CreateRoombutton
					userId={this.props.userId}
					playlistName={this.props.playlist.name}
					active={this.state.active}
				/>
				<div className='queue-block' onClick={() => this.setActive()}>
					<div className='cover'>
						<h1>{this.props.playlist.name}</h1>
					</div>
				</div>
				<div className='playlist-body' style={bodyStyle}>
					{tracks}
				</div>
			</div>
		);
	};
}

export default Playlist;
