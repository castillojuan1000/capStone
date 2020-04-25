import React from 'react';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import '../../App.css';
import LensIcon from '@material-ui/icons/Lens';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import { AddCircleOutline } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getSongSeconds } from '../../utilityFunctions/util.js';

let Song = ({
	song,
	idx,
	handleClick,
	active,
	isPlaying,
	searchState,
	user,
	spotifyData
}) => {
	console.log(song);
	console.info(song);
	let hoverClass = active ? 'song-hover-state active' : 'song-hover-state';
	let playIcon =
		active && isPlaying ? (
			<PauseRoundedIcon style={{ fontSize: '.8em' }} />
		) : (
			<PlayArrowRoundedIcon style={{ fontSize: '.8em' }} />
		);
	let dotStyle = {
		fontSize: '.4em',
		paddingBottom: '.2em',
		marginLeft: '0em',
		marginRight: '0em'
	};
	let artist = song.artists.map(artist => {
		return (
			<Link className='album-link' to={{ pathname: '/artist/' + artist.id }}>
				<h5>{artist.name}</h5>
			</Link>
		);
	});
	let image =
		song.album.images.length > 0
			? song.album.images[1].url
			: '/music-placeholder.png';
	let backgroundStyle = { backgroundImage: `url(${image})` };
	const addSongToPlaylist = (uri, playlistId) => {
		spotifyData.player.AddSongToPlaylist(playlistId, uri).then(res => {
			debugger;
		});
	};
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
					{artist}
					<h5 style={{ width: '1em' }}>
						<LensIcon style={dotStyle} />
					</h5>
					<Link
						className='album-link'
						to={{
							pathname: '/album/' + song.album.id,
							state: { ...searchState }
						}}>
						<h5>{song.album.name}</h5>
					</Link>
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
