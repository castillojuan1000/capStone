import React from 'react';

import * as Vibrant from 'node-vibrant';

import {getColor} from '../../utilityFunctions/util.js'


class FeaturedArtist extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            colors: {
                DarkMuted: 'black',
                Vibrant: 'white',
                DarkVibrant: 'black',
                LightVibrant: 'white',
                Muted:  'blue',
            }
        };
    }

    componentDidMount = () => {
        this.setColor(this.props.url)
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

    render() {
        let containerStyle = {
            backgroundSize: '800vw 800vw',
            animation: 'rotate 20s ease infinite',
            background: `linear-gradient(160deg, 
                ${this.state.colors.Vibrant}, 
                ${this.state.colors.DarkMuted})`,
        }
        return (
            <div className="container" style={containerStyle}>
                <div className="block" style={{background: this.state.colors.DarkMuted}}>
                    <img src={this.props.url}></img>
                    <div className="inner1" style={{background: this.state.colors.Vibrant}}></div>
                    <div className="inner2"  style={{background: this.state.colors.DarkVibrant}}></div>
                    <div className="inner3" style={{background: this.state.colors.Muted}}></div>
                    <div className="inner4" style={{background: this.state.colors.DarkVibrant}}></div>
                    <div className="inner5" style={{background: this.state.colors.LightVibrant}}></div>
                    <div className="inner6" style={{background: this.state.colors.Muted}}></div>
                </div>
                <div className="artist-name"><h1>{this.props.name}</h1></div>
            </div>
        )
    }
}

export default FeaturedArtist
