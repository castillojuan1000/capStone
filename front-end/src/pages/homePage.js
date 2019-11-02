import React from 'react';

import { withRouter } from 'react-router-dom';
import Artist from '../Components/Blocks/artist';
import Album from '../Components/Blocks/album';
import Song from '../Components/Blocks/songs';


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
		};
	}
	componentDidMount() {
        this.props.spotifyData.player.getPersonalizedTopTracks('artists').then((result) => {
            this.setState({
                ...this.state,
                result: result.items,
            })
        })
	}

	render() {
        let topArtists = [];
        this.state.result.forEach(item => {
            topArtists.push(
                <FeaturedArtist 
                        url={item.images[0].url}
                        name={item.name}
                        />
            )
        })
		return (
			<div className='main'>
                <h1>Recommended Artists</h1>
                <div className="recomended-artists">
                        {topArtists}
                </div>
                <h1>Live Stations</h1>
                <div className="recomended-artists">
                    <FeaturedPlaylist 
                        url={'https://i.scdn.co/image/ab67616d0000b273013c00ee367dd85396f79c82'}
                        name={'Mac Miller'}
                        />
                    <FeaturedPlaylist 
                        url={'https://i.scdn.co/image/ab67616d0000b273175c577a61aa13d4fb4b6534'}
                        name={'Chance The Rapper'}
                        />
                    <FeaturedPlaylist 
                        url={'https://i.scdn.co/image/7c4b989de628cee6ab1457b95a3474693e23eff6'}
                        name={'Drake Sombebody'}
                        />
                    <FeaturedPlaylist 
                        url={'https://i.scdn.co/image/fd5d75466a6b0515919baf00e534c901a76d28a0'}
                        name={'Drake Sombebody'}
                        />
                </div>
			</div>
		);
	}
}

export default withRouter(Home);
