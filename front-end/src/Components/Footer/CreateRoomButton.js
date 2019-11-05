import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_ROOM } from '../../Apollo';
import { LiveTvRounded } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

function CreateRoomButton({
	userId,
	active,
	playlist,
	rooms,
	spotifyData,
	ResetQueue,
	history,
	toggleQ
}) {
	const [createRoom] = useMutation(CREATE_ROOM);
	const { player } = spotifyData;
	const addPlaylistToQueue = (playlistId, roomId) => {
		player.GetPlaylistTracks(playlistId).then(res => {
			const uris = res.items.map(e => {
				return e.track.uri;
			});
			const newQueue = res.items.map((track, idx) => {
				track.order = idx;
				return track;
			});
			player.playSong(JSON.stringify(uris)).then(() => {
				ResetQueue(newQueue);
				history.push('/room/' + roomId);
			});
		});
	};
	const handleClick = () => {
		debugger;
		const roomsArray = rooms.map(e => ({
			id: Number(e.id),
			hostId: e.host.id,
			roomName: e.roomName
		}));
		const newRoom = { hostId: userId, roomName: playlist.name };
		const idx = roomsArray.findIndex(
			e =>
				Number(e.hostId) === newRoom.hostId && e.roomName === newRoom.roomName
		);
		toggleQ();
		if (idx > -1) {
			const roomId = roomsArray[idx].id;
			return addPlaylistToQueue(playlist.id, roomId);
		} else {
			return createRoom({
				variables: { hostId: userId, roomName: playlist.name }
			}).then(({ data }) => {
				debugger;
				const { id: roomId } = data.createRoom;
				addPlaylistToQueue(playlist.id, roomId);
			});
		}
	};
	return (
		<div
			className='start-station=btn'
			style={{
				display: active ? 'flex' : 'none',
				flexDirection: 'column',
				alignItems: 'center'
			}}
			onClick={handleClick}>
			<LiveTvRounded style={{ fontSize: '1.5em' }} />
			Start Station
		</div>
	);
}

const mapState = state => {
	return { ...state };
};
const mapDispatch = dispatch => {
	return {
		ResetQueue: payload => {
			dispatch({ type: 'RESET_PLAYER_QUEUE', payload });
		}
	};
};

export default connect(
	mapState,
	mapDispatch
)(withRouter(CreateRoomButton));
