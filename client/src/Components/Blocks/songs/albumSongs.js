import React from 'react';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import { IconButton } from '@material-ui/core';
import { AddCircleOutline } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSongSeconds } from '../../../utilityFunctions/util';

let Song = ({
	song,
	idx,
	handleClick,
	active,
	isPlaying,
	image,
	user,
	spotifyData
}) => {
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
	const addSongToPlaylist = (uri, playlistId) => {
		spotifyData.player.AddSongToPlaylist(playlistId, uri).then(res => {
			debugger;
		});
	};
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
				{user.room && user.room.host['isHost'] && (
					<IconButton
						color='inherit'
						onClick={() => {
							addSongToPlaylist(song.uri, user.room.spotifyId);
						}}>
						<AddCircleOutline />
					</IconButton>
				)}
			</div>
			<div className='song-duration'>
				<div>
					<h3>{getSongSeconds(song.duration_ms / 1000)}</h3>
				</div>
			</div>
		</div>
	);
};
const mapState = state => {
	return { ...state };
};
export default connect(mapState, null)(Song);
