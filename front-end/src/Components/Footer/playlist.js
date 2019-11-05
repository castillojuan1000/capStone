import React from 'react';

import * as Vibrant from 'node-vibrant';


import { getColor } from '../../utilityFunctions/util.js'
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
                Muted: 'blue',
            }
        };
    }

    setColor = (url) => {

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


    setActive = () => {
        if (this.state.tracks.length === 0) {
            this.props.getPlaylistTracks(this.props.playlist.id).then((data) => {
                console.debug(data)
                this.setState({
                    ...this.state,
                    active: !this.state.active,
                    tracks: data.items,
                })

            })
        }
        else {
            this.setState({
                ...this.state,
                active: !this.state.active,
            })
        }

    }

    componentDidMount = () => {
        this.setColor(this.props.playlist.images[0].url)
    }

    buildTracks = () => {
        let tracks = [];
        this.state.tracks.forEach((track, idx) => {
            let active = this.props.currentURI === track.uri ? true : false;
            tracks.push(
                <Song
                    handleClick={this.PlaySong}
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
        let bodyStyle = { height: '0em' }
        if (this.state.active) {
            bodyStyle = { height: '' }
        }
        let tracks = this.buildTracks()
        return (
            <div className="playlist-section" onClick={() => this.setActive()}>
                <div className="queue-block" style={{ background: this.state.colors.DarkMuted }}>
                    <div className="circle1" style={{ background: this.state.colors.Vibrant }} ></div>
                    <div className="circle4" style={{ background: this.state.colors.Muted }}></div>
                    <div className="cover"><h1>{this.props.playlist.name}</h1></div>
                </div>
                <div className="playlist-body" style={bodyStyle}>{tracks}</div>
            </div>
        )
    }
}

export default Playlist