import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_ROOM } from '../../Apollo';
import { LiveTvRounded } from '@material-ui/icons';
export default function CreateRoomButton({ userId, playlistName, active }) {
	const [createRoom] = useMutation(CREATE_ROOM);
	return (
		<div
			className='start-station=btn'
			style={{ diaplay: active ? 'block' : 'none' }}
			onClick={() => {
				debugger;
				createRoom({ variables: { hostId: userId, roomName: playlistName } });
			}}>
			<LiveTvRounded style={{ fontSize: '1.5em' }} />
			Start Station
		</div>
	);
}
