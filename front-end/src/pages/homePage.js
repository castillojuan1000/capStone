import React from 'react';

import { withRouter } from 'react-router-dom';
//import Artist from '../Components/Blocks/artist';
//import Album from '../Components/Blocks/album';
//import Song from '../Components/Blocks/songs';

import '../App.css';
import '../homepage.css';

import FeaturedArtist from '../Components/Blocks/featuredArtist'
import FeaturedPlaylist from '../Components/Blocks/featuredPlaylist'

let Loader = ({ loading }) => {
	let display = loading ? 'block' : 'none';
	let loaderStyle = { display: display };
	return (
		<div className='loader' style={loaderStyle}>
			Loading...
		</div>
	);
};

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            result: [],
            tracks: [],
		};
	}
	componentDidMount() {
        this.props.spotifyData.player.getPersonalizedTopTracks('artists', 20, 5).then((result) => {
            this.props.spotifyData.player.getPersonalizedTopTracks('tracks', 20, 5).then((data) => {
                this.setState({
                    ...this.state,
                    result: result.items,
                    tracks: data.items,
                })
            })
        })
	}

	render() {
        let topArtists = [];
        let topTracks = [];
        this.state.result.forEach(item => {
            topArtists.push(
                <FeaturedArtist 
                        url={item.images[0].url}
                        name={item.name}
                        />
            )
        })
        this.state.tracks.forEach(item => {
            topTracks.push(
                <FeaturedPlaylist 
                        url={item.album.images[0].url}
                        name={item.name}
                        artistName={item.artists[0].name}
                        />
            )
        })
		return (
			<div className='main'>
                <h1>Recommended Artists</h1>
                <div className="recomended-artists">
                        {topArtists}
                </div>
                <h1>Recently Played</h1>
                <div className="recomended-artists">
                    {topTracks}
                    
                </div> 
			</div>
		);
	}
}

export default withRouter(Home);


