import React from 'react';

import * as Vibrant from 'node-vibrant';

import {getColor} from '../../utilityFunctions/util.js'


class Playlist extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            colors: {
                DarkMuted: 'black',
                Vibrant: 'white',
                DarkVibrant: 'red',
                LightVibrant: 'green',
                Muted:  'blue',
            }
        };
    }

    setColor = (url) => {
        console.debug(0)
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
					Muted: getColor(palette, 'Muted'),
				};
				console.log(colors)
				this.setState({
					...this.state,
					colors: colors,
				})
			});
        })
    }

    render = () => {
        this.setColor(this.props.playlist.images[0].url)
        return (
            <div className="queue-block" style={{background: this.state.colors.DarkMuted}}>
                <div className="circle1" style={{background: this.state.colors.Vibrant}} ></div>
                <div className="circle4" style={{background: this.state.colors.Muted}}></div>
                <div className="cover"><h1>{this.props.playlist.name}</h1></div>
            </div> 
        )
    }
}

export default Playlist