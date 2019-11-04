import React from 'react';

import { withRouter } from 'react-router-dom';
//import Artist from '../Components/Blocks/artist';
//import Album from '../Components/Blocks/album';
//import Song from '../Components/Blocks/songs';

import '../App.css';
import '../homepage.css';

import FeaturedArtist from '../Components/Blocks/featuredArtist';
import FeaturedPlaylist from '../Components/Blocks/featuredPlaylist';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			result: [],
			tracks: []
		};
	}
	componentDidMount() {
		this.props.spotifyData.player
			.getPersonalizedTopTracks('artists', 10, 0)
			.then(result => {
				this.props.spotifyData.player
					.getPersonalizedTopTracks('tracks', 10, 0)
					.then(data => {
						this.setState({
							...this.state,
							result: result.items,
							tracks: data.items
						});
					});
			});
	}

	render() {
		let topArtists = [];
		let topTracks = [];
		this.state.result.forEach((item, idx) => {
			let active = false;
			if (this.props.player.artistId === item.id) {
				active = true;
			}
			topArtists.push(
				<FeaturedArtist
					player={this.props.spotifyData}
					ResetQueue={this.props.ResetQueue}
					key={`featured-artist-${idx}`}
					url={item.images[0].url}
					name={item.name}
					active={active}
					artistId={item.id}
					isPlaying={this.props.player.isPlaying}
				/>
			);
		});
		this.state.tracks.forEach((item, idx) => {
			let active = false;
			if (this.props.player.currentSong.id === item.id) {
				active = true;
			}
			topTracks.push(
				<FeaturedPlaylist
					key={`featured-playlist-${idx}`}
					url={item.album.images[0].url}
					name={item.name}
					artistName={item.artists[0].name}
					player={this.props.spotifyData}
					ResetQueue={this.props.ResetQueue}
					active={active}
					songUri={item.uri}
					isPlaying={this.props.player.isPlaying}
				/>
			);
		});
		return (
			<div className='main'>
				<div className='favorites-title'>
					<h1>Favorite Artists</h1>
				</div>
				<div className='recomended-artists'>{topArtists}</div>
				<h1>Recently Played</h1>
				<div className='recomended-artists'>{topTracks}</div>
			</div>
		);
	}
}

export default withRouter(Home);
