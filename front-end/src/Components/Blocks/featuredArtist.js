import React from 'react';

import * as Vibrant from 'node-vibrant';

import { getColor } from '../../utilityFunctions/util.js';

import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';

class FeaturedArtist extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			colors: {
				DarkMuted: 'black',
				Vibrant: 'white',
				DarkVibrant: 'black',
				LightVibrant: 'white',
				Muted: 'blue'
			}
		};
		this.PlayArtist = this.PlayArtist.bind(this);
	}
	PlayArtist = () => {
		const {
			ResumePlayer,
			StopPlayer,
			playSong,
			getArtistTopTracks
		} = this.props.player.player;
		if (!this.props.active) {
			console.log(this.props.active, this.props.artistId);
			getArtistTopTracks(this.props.artistId).then(result => {
				let newItems = [];
				result.tracks.forEach((track, idx) => {
					track.order = idx;
					newItems.push(track);
				});
				this.props.ResetQueue(newItems);
				let uris = JSON.stringify(
					result.tracks.map(track => {
						return track.uri;
					})
				);

				playSong(uris)
					.catch(e => console.debug(e))
					.then(e => console.debug(e));
			});
		} else if (this.props.active && this.props.isPlaying === false) {
			ResumePlayer();
		} else {
			StopPlayer();
		}
	};

	componentDidMount = () => {
		this.setColor(this.props.url);
	};

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

	render() {
		let hoverState = this.props.active ? { opacity: 1 } : {};
		let containerStyle = {
			backgroundSize: '800vw 800vw',
			animation: 'rotate 20s ease infinite',
			background: `linear-gradient(160deg, 
                ${this.state.colors.Vibrant}, 
                ${this.state.colors.DarkMuted})`
		};
		let playIcon =
			this.props.active && this.props.isPlaying ? (
				<PauseRoundedIcon style={{ fontSize: '.8em' }} />
			) : (
				<PlayArrowRoundedIcon style={{ fontSize: '.8em' }} />
			);
		return (
			<div className='container' style={containerStyle}>
				<div
					className='block'
					style={{ background: this.state.colors.DarkMuted }}>
					<img alt={`${this.props.name} cover`} src={this.props.url}></img>
					<div
						className='inner1'
						style={{ background: this.state.colors.Vibrant }}></div>
					<div
						className='inner2'
						style={{ background: this.state.colors.DarkVibrant }}></div>
					<div
						className='inner3'
						style={{ background: this.state.colors.Muted }}></div>
					<div
						className='inner4'
						style={{ background: this.state.colors.DarkVibrant }}></div>
					<div
						className='inner5'
						style={{ background: this.state.colors.LightVibrant }}></div>
					<div
						className='inner6'
						style={{ background: this.state.colors.Muted }}></div>
					<div
						className='artist-hover-state'
						style={hoverState}
						onClick={() => this.PlayArtist()}>
						<div className='artist-icon-holder'>{playIcon}</div>
					</div>
				</div>
				<div className='artist-name'>
					<h1>{this.props.name}</h1>
				</div>
			</div>
		);
	}
}

export default FeaturedArtist;
