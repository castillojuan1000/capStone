import React from 'react';
import '../../App.css';
import { PlayArrowRounded, PauseRounded } from '@material-ui/icons';
import { connect } from 'react-redux';
let Song = ({ song, idx, handleClick, active, isPlaying, searchState }) => {
	let hoverClass = active ? 'song-hover-state active' : 'song-hover-state';
	let playIcon =
		active && isPlaying ? (
			<PauseRounded style={{ fontSize: '.8em' }} />
		) : (
			<PlayArrowRounded style={{ fontSize: '.8em' }} />
		);
	if (!typeof variable === 'boolean' && song['added_at']) {
		song = song.track;
	}
	console.debug(song, 'sss');
	let artist = song.artist;
	//let artist = song.artist ? <h5>{song.artists[0].name}</h5> : <h5></h5>;
	let image =
		song.album !== undefined && song.album.images.length > 0
			? song.album.images[1].url
			: '/music-placeholder.png';
	let backgroundStyle = { backgroundImage: `url(${image})` };
	return (
		<div key={idx} className='song-block'>
			<div style={backgroundStyle} className='song-img-item'>
				<div
					className={hoverClass}
					onClick={() => handleClick(song.id, active)}>
					<div className='song-icon-holder'>{playIcon}</div>
				</div>
			</div>
			<div className='song-description'>
				<h3>{song.name}</h3>
				<div className='featured-artists'>{artist}</div>
			</div>
		</div>
	);
};
const mapState = state => {
	return { ...state };
};
export default connect(mapState, null)(Song);
