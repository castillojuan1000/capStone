import React from 'react';

import * as Vibrant from 'node-vibrant';
import { withRouter } from 'react-router-dom';
import { getColor } from '../../utilityFunctions/util.js';
class Station extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
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
			var vibrant = new Vibrant(img);
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

	setActive = () => {
		this.setState({
			active: !this.state.active
		});
		this.props.history.push('/room/' + this.props.roomId);
	};
	componentDidMount = () => {
		this.setColor('https://picsum.photos/200');
	};

	render = () => {
		return (
			<div
				style={{ border: this.props.isHost && '1px solid red' }}
				className='playlist-section'
				onClick={() => this.setActive()}>
				<div
					className='queue-block'
					style={{ background: this.state.colors.DarkMuted }}>
					<div
						className='circle1'
						style={{ background: this.state.colors.Vibrant }}></div>
					<div
						className='circle4'
						style={{ background: this.state.colors.Muted }}></div>
					<div className='cover'>
						<h1 style={{ textTransform: 'capitalize' }}>
							{this.props.roomName}
						</h1>
					</div>
				</div>
			</div>
		);
	};
}

export default withRouter(Station);
