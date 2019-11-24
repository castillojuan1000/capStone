import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_ROOM } from '../../Apollo';
import SongsCarousel from '../Blocks/songs/SongsCarousel';
import SongFeatures from '../Blocks/songs/SongFeatures';
import Chatroom from '../Misc/Chatroom';
import { IconButton } from '@material-ui/core';
import { ChatBubble, LibraryMusicRounded } from '@material-ui/icons';
import { MainRoom } from '../../style/MainRoom';
import { HostInfo } from '../Misc';

function Room(props) {
	const { player, user, spotifyData } = props;
	const [roomState, setRoomState] = useState({
		currentSong: {
			image: '',
			id: '',
			uri: '',
			name: '',
			artists: [],
			features: null
		},
		songs: [],
		playlistTracks: []
	});
	const [songView, setSongView] = useState(true);
	useEffect(() => {
		const aborter = new AbortController();
		const songsFetcher = spotifyData.player
			.GetPlaylistTracks(user.room.spotifyId)
			.then(results => {
				const songs = results.items.map(e => {
					const res = e.track;
					setRoomState(s => ({
						...s,
						playlistTracks: [...s.playlistTracks, e]
					}));
					let image = '/music-placeholder.png';
					if (res.album && res.album.images.length > 1) {
						image = res.album.images[1].url;
					} else if (res.album.images.length === 1) {
						image = res.album.image[0].url;
					}
					return {
						duration: res.duration_ms,
						artists: res.artists,
						name: res.name,
						image,
						id: res.id,
						uri: res.uri
					};
				});
				return songs;
			})
			.then(songs => {
				spotifyData.player
					.getTrackFeatures(`?ids=${songs.map(e => e.id)}`)
					.then(res => {
						const newSongs = songs.map((e, i) => {
							e.features = res['audio_features'][i];
							return e;
						});
						setRoomState(s => ({
							...s,
							currentSong: { ...songs[0] },
							songs: newSongs
						}));
					});
			});
		return () => aborter.abort(songsFetcher);
	}, [setRoomState, user, spotifyData]);
	const id = Number(props.match.params.id);
	const { loading, error, data } = useQuery(GET_ROOM, {
		variables: { id },
		pollInterval: 60000,
		fetchPolicy: 'cache-and-network'
	});
	if (error) {
		return <MainRoom>Error</MainRoom>;
	}
	if (loading) {
		return (
			<MainRoom style={{ display: 'flex', alignItems: 'center' }}>
				<Loader loading={true} />
			</MainRoom>
		);
	}
	const { getRoom } = data;
	const { host } = getRoom;
	let messages = getRoom.messages.map(m => {
		return {
			author: m.user.username,
			spotifyId: m.user.spotifyId,
			message: m.message,
			authorId: m.user.id
		};
	});
	const playSongRoom = uri => {
		const idx = roomState.playlistTracks.findIndex(e => e.track.uri === uri);
		const selectedSong = roomState.playlistTracks[idx];
		setRoomState(s => ({ ...s, currentSong: { ...s.songs[idx] } }));
		const newQueue = [
			selectedSong,
			...roomState.playlistTracks.slice(0, idx),
			...roomState.playlistTracks.slice(idx + 1)
		];
		const newQueueURI = JSON.stringify(newQueue.map(e => e.track.uri));
		props.spotifyData.player.playSong(newQueueURI);
		props.ResetQueue(newQueue);
	};

	const { currentSong } = roomState;
	return (
		<MainRoom color={player.colors.darkVibrant}>
			<div className='room-host'>
				<HostInfo spotifyData={spotifyData} host={host} user={user} />
			</div>
			<div className='room-stats'>
				<div className='room-actions'>
					<IconButton
						style={{ color: songView ? '#333' : 'white' }}
						onClick={() => setSongView(true)}>
						<LibraryMusicRounded fontSize='large' color='inherit' />
					</IconButton>
					<IconButton
						style={{ color: !songView ? '#333' : 'white' }}
						onClick={() => setSongView(false)}>
						<ChatBubble fontSize='large' />
					</IconButton>
				</div>
				<div className='room-stats' style={{ width: '100%' }}>
					<SongFeatures
						view={songView}
						song={currentSong}
						color={player.colors.darkVibrant}
					/>
					<div
						className={songView ? 'room-songs active' : 'room-songs'}
						style={{ overflowY: 'scroll' }}>
						<SongsCarousel
							{...{
								playSongRoom,
								spotifyData,
								id,
								user,
								roomState,
								setRoomState,
								player
							}}
						/>
					</div>
				</div>
				<Chatroom
					className={!songView ? 'active' : ''}
					messages={messages}
					roomId={id}
				/>
			</div>
		</MainRoom>
	);
}

let Loader = ({ loading }) => {
	let display = loading ? 'block' : 'none';
	let loaderStyle = { display: display };
	return (
		<div className='loader' style={loaderStyle}>
			Loading...
		</div>
	);
};
export default Room;
