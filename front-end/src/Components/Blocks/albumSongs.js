import React from 'react';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import { Link } from 'react-router-dom';

import { getSongSeconds } from '../../utilityFunctions/util.js';

let Song = ({ song, idx, handleClick, active, isPlaying, image }) => {
	let hoverClass = active ? 'song-hover-state active' : 'song-hover-state';
	let playIcon =
		active && isPlaying ? (
			<PauseRoundedIcon style={{ fontSize: '.8em' }} />
		) : (
			<PlayArrowRoundedIcon style={{ fontSize: '.8em' }} />
		);
	let artist = song.artists.map((artist, ind) => {
		return (
			<Link
				key={`link-album-${ind}`}
				className='album-link'
				to={{ pathname: '/artist/' + artist.id }}>
				<h5>{artist.name}</h5>
			</Link>
		);
	});

	let explicit = song.explicit ? (
		<h5 className='explicit-tag'>EXPLICIT</h5>
	) : (
			''
		);
	let backgroundStyle = { backgroundImage: `url(${image})` };
	return (
		<div key={idx} className='song-block'>
			<div style={backgroundStyle} className='song-img-item'>
				<div
					className={hoverClass}
					onClick={() => handleClick(song.uri, active)}>
					<div className='song-icon-holder'>{playIcon}</div>
				</div>
			</div>
			<div className='song-description'>
				<h3>{song.name}</h3>
				<div className='featured-artists'>
					{explicit}
					{artist}
				</div>
			</div>
			<div className='song-action'>
				<FavoriteRoundedIcon />
				<MoreHorizRoundedIcon />
			</div>
			<div className='song-duration'>
				<div>
					<h3>{getSongSeconds(song.duration_ms / 1000)}</h3>
				</div>
			</div>
		</div>
	);
};

export default Song;
