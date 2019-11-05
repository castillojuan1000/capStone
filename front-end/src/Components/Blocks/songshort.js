import React from 'react';
import '../../App.css';
import {
	PlayArrowRounded,
	PauseRounded,
	ThumbUpRounded
} from '@material-ui/icons';

let Song = ({
	song,
	idx,
	handleClick,
	active,
	isPlaying,
	searchState,
	likes,
	showLikes,
	createLike
}) => {
<<<<<<< HEAD
	console.debug('song', song)

=======
	if('added_at' in song) {
		song = song.track
	}
	console.debug('song',  song)
	console.debug('song.tracl', song.track)
	
>>>>>>> b51fb7a69c8371b3a97abe155eae55cf5b9ab565
	let hoverClass = active ? 'song-hover-state active' : 'song-hover-state';
	let playIcon =
		active && isPlaying ? (
			<PauseRounded style={{ fontSize: '.8em' }} />
		) : (
				<PlayArrowRounded style={{ fontSize: '.8em' }} />
			);
	if ('added_at' in song) {
		song = song.track
	}
	console.debug(song, 'sss')
	let artist = song.artist ? <h5>{song.artists[0].name}</h5> : <h5></h5>;
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
			{showLikes && (
				<div
					style={{
						alignSelf: 'center',
						display: 'flex',
						justifyContent: 'flex-end',
						flexGrow: 1,
						padding: 5
					}}>
					{likes > 0 && (
						<div
							style={{
								fontWeight: 'bold',
								fontSize: '1.5rem',
								color: 'white'
							}}>
							{likes}
						</div>
					)}
					<ThumbUpRounded
						style={{
							color: '#28a745',
							fontSize: '1.8em',
							marginLeft: '2px',
							cursor: 'pointer'
						}}
						onClick={createLike}
					/>
				</div>
			)}
		</div>
	);
};

export default Song;
