import React from 'react';

import * as Vibrant from 'node-vibrant';

import { getColor } from '../../utilityFunctions/util.js';

import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';

class FeaturedPlaylist extends React.Component {
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
	}

	componentDidMount = () => {
		this.setColor(this.props.url);
	};

	setColor = url => {
		let img = new Image();
		img.crossOrigin = 'Anonymous';
		img.src = url;
		img.addEventListener('load', () => {
			// var vibrant = new Vibrant(img);
			Vibrant.from(img).getPalette((err, palette) => {
				let colors = {
					Vibrant: getColor(palette, 'Vibrant'),
					DarkMuted: getColor(palette, 'DarkMuted'),
					DarkVibrant: getColor(palette, 'DarkVibrant'),
					LightVibrant: getColor(palette, 'LightVibrant'),
					Muted: getColor(palette, 'Muted')
				};
				console.log(colors);
				this.setState({
					...this.state,
					colors: colors
				});
			});
		});
	};

	render() {
		let containerStyle = {
			backgroundSize: '800vw 800vw',
			animation: 'rotate 20s ease infinite',
			background: `linear-gradient(160deg, 
                ${this.state.colors.Vibrant}, 
                ${this.state.colors.DarkMuted})`
		};
		return (
			<div className='playlist' style={containerStyle}>
				<div className='triangle-holder'>
					<div
						className='triangle-left'
						style={{ borderBottom: `18em solid rgba(0,0,0,.1)` }}></div>
					<div
						className='triangle-right'
						style={{ borderTop: `22em solid rgba(0,0,0,.1)` }}
					/>
				</div>
				<div
					className='triangle-right'
					style={{ borderTop: `22em solid rgba(0,0,0,.1)` }}
				/>
				<div
					className='artist-hover-state' /* onClick={() => handleClick(artist.id)} */
				>
					<div className='artist-icon-holder'>
						<PlayArrowRoundedIcon style={{ fontSize: '.8em' }} />
					</div>
				</div>
				<img alt='playlist-cover' src={this.props.url}></img>
				<div className='playlist-cover'>
					<h1>{this.props.name}</h1>
					<h3>{this.props.artistName}</h3>
				</div>
			</div>
		);
	}
}

export default FeaturedPlaylist;
