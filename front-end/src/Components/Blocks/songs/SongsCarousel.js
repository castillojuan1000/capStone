import React from 'react';
import Song from '../songs/songs';
export default function SongCarousel({
	player,
	roomState,
	setRoomState,
	playSongRoom
}) {
	const ArtworkJSX = () => {
		return roomState.playlistTracks.map((songTrack, i) => {
			const songObj = songTrack.track;
			const songProps = {
				song: songObj,
				handleClick: playSongRoom,
				idx: i,
				active: player.currentSong.uri === songObj.uri,
				isPlaying: player.currentSong.uri === songObj.uri
			};
			return (
				<div
					key={i}
					onClick={() => {
						setRoomState({
							...roomState,
							currentSong: { ...roomState.songs[i] }
						});
					}}
					className={
						songObj.id === roomState.currentSong.id
							? 'room-song active'
							: 'room-song'
					}>
					<Song {...songProps} />
				</div>
			);
		});
	};
	return <ArtworkJSX />;
}
function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

// <div className="song-image" onClick={() => playSongRoom(i)}>
//   <img src={currentSong.image} alt={`${currentSong.name} artwork`} />
// </div>
// <div className="song-name">
//   <h3 className="name">{currentSong.name}</h3>
//   <h3>
//     <Link to={`/artist/${currentSong.artists[0].id}`}>
//       {currentSong.artists[0].name}
//     </Link>
//   </h3>
// </div>
// <div className="song-info"></div>
// <div className="song-length">
//   <h3>{millisToMinutesAndSeconds(currentSong.duration)}</h3>
// </div>
