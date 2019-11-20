import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_ROOM } from '../../Apollo';
import { LiveTvRounded, AddCircleOutline } from '@material-ui/icons';
import { TextField, IconButton } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

function CreateRoomButton(props) {
	const { user, active, spotifyData, history, toggleQ, setRoom } = props;
	const [createRoom] = useMutation(CREATE_ROOM);
	const [isExpanded, setExpanded] = useState(false);
	const handleExpand = () => {
		setExpanded(!isExpanded);
	};
	const handleSubmit = e => {
		e.preventDefault();
		debugger;
		const userId = user.spotifyId;
		const newRoom = { hostId: user.id, roomName: e.target.elements[0].value };
		spotifyData.player
			.CreatePlaylist(userId, newRoom.roomName)
			.then(results => {
				debugger;
				const playlist = results.data;
				createRoom({
					variables: {
						hostId: user.id,
						roomName: playlist.name,
						spotifyId: playlist.id
					}
				}).then(({ data }) => {
					const { id: roomId, host, spotifyId } = data.createRoom;
					host.isHost = user.spotifyId === playlist.owner.id;
					setExpanded(!isExpanded);
					setRoom({
						roomId,
						host,
						spotifyId
					});
					history.push(`/room/${roomId}`);
					toggleQ();
				});
			});
	};
	return (
		<StartStationContainer>
			<div
				className='start-station=btn'
				style={{
					display: active ? 'flex' : 'none',
					flexDirection: 'column',
					alignItems: 'center',
					color: 'white'
				}}
				onClick={handleExpand}>
				<LiveTvRounded style={{ fontSize: '1.5em' }} />
				Start Station
			</div>
			<div className={`form ${isExpanded && 'active'}`}>
				<form action='POST' onSubmit={handleSubmit}>
					<TextField type='text' name='roomName' placeholder='Room Name' />
					<IconButton type='submit'>
						<AddCircleOutline />
					</IconButton>
				</form>
			</div>
		</StartStationContainer>
	);
}

const mapState = state => {
	return { ...state };
};
const mapDispatch = dispatch => {
	return {
		setRoom: payload => dispatch({ type: 'SET_ROOM', payload })
	};
};

export default connect(mapState, mapDispatch)(withRouter(CreateRoomButton));

const StartStationContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	.form {
		display: none;
		color: white;
		align-items: center;
		width: 100%;
		&.active {
			display: flex;
		}
		input {
			color: white;
			margin: 1em;
		}
		button {
			color: white;
			margin: 1em;
		}
	}
`;
