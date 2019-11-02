import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Song from '../Blocks/albumSongs';
import styled from 'styled-components';
import io from 'socket.io-client';
import { useQuery } from '@apollo/react-hooks';
import { GET_ROOM } from '../../Apollo';
import Chatroom from './Chatroom';

function Room({ match, spotifyData, user, setRoom }) {
	const [queue, setQueue] = React.useState([]);
	const [messages, setMessages] = React.useState([]);
	const { player } = spotifyData;
	return (
		<MainRoom>
			<div className='main_room_header'>
				<h1>SoungGoodMusic</h1>
			</div>
			<QueryRoom
				id={Number(match.params.id)}
				queue={queue}
				user={user}
				setRoom={setRoom}
			/>
		</MainRoom>
	);
}

export function QueryRoom({ id, queue, player, user, setRoom }) {
	const { loading, error, data, networkStatus } = useQuery(GET_ROOM, {
		variables: { id },
		pollInterval: 0
	});
	let isHost;
	let host;
	let messages = [];
	if (loading) {
		return (
			<MainContainer style={{ display: 'flex', alignItems: 'center' }}>
				<Loader loading={true} />
			</MainContainer>
		);
	}
	if (error) {
		return <MainContainer>Error</MainContainer>;
	}
	if (data) {
		const { getRoom } = data;
		messages = getRoom.messages.map(m => {
			return {
				author: m.user.username,
				message: m.message
			};
		});
		host = getRoom.host;
		isHost = Number(getRoom.host.id) === user.id;
	}
	return (
		<MainContainer>
			{isHost ? (
				<HostView
					queue={queue}
					messages={messages}
					roomId={id}
					isHost={isHost ? 1 : 0}
					setRoom={setRoom}
					host={host}
				/>
			) : (
				<ListenerView
					queue={queue}
					messages={messages}
					roomId={id}
					isHost={isHost ? 1 : 0}
					setRoom={setRoom}
					host={host}
				/>
			)}
		</MainContainer>
	);
}

function HostView({ messages, queue, player, roomId, isHost, host, setRoom }) {
	React.useEffect(() => {
		setRoom({ roomId, host: { isHost, ...host } });
	}, []);
	return (
		<>
			<h1>Host!</h1>
			<h1>Queue</h1>
			<div>
				{queue.map((song, i) => {
					const active = player.currentSongId === song.id;
					return (
						<Song
							key={i}
							song={song}
							active={active}
							image={queue.images[0]}
							handleClick={() => {
								player.playSong(song.uri);
							}}
							idx={i}
							isPlaying={player.isPlaying}
						/>
					);
				})}
			</div>
			<Chatroom messages={messages} roomId={roomId} isHost={isHost ? 1 : 0} />
		</>
	);
}

function ListenerView({
	messages,
	queue,
	player,
	roomId,
	isHost,
	host,
	setRoom
}) {
	React.useEffect(() => {
		setRoom({ roomId, host: { isHost, ...host } });
	}, []);
	return (
		<>
			<h1>Queue</h1>
			<div>
				{queue.map((song, i) => {
					const active = player.currentSongId === song.id;
					return (
						<Song
							key={i}
							song={song}
							active={active}
							image={queue.images[0]}
							handleClick={() => {
								player.playSong(song.uri);
							}}
							idx={i}
							isPlaying={player.isPlaying}
						/>
					);
				})}
			</div>
			<Chatroom messages={messages} roomId={roomId} isHost={isHost ? 1 : 0} />
		</>
	);
}

const MainRoom = styled.div`
	background: linear-gradient(#0b1313 25%, #000000 75%);
	width: 100vw;
	height: 100vh;
	margin: auto;
	padding-top: 30px;
	h1 {
		font-size: 25px;
		color: rgba(255, 255, 255, 0.75);
		line-height: 1em;
	}
	.main_room_hero {
		display: flex;
		justify-content: space-between;
	}
`;
const MainContainer = styled.div`
	width: 60vw;
	height: 60vh;
	padding: 20px;
	background-color: linear-gradient(#0b1313 25%, #000000 75%);
	margin-top: 5vh;
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
	.song-block {
		width: 100%;
	}
`;

let Loader = ({ loading }) => {
	let display = loading ? 'block' : 'none';
	let loaderStyle = { display: display };
	return (
		<div className='loader' style={loaderStyle}>
			Loading...
		</div>
	);
};
const mapState = state => {
	return { ...state };
};
const mapDispatch = dispatch => {
	return {
		setRoom: payload => dispatch({ type: 'SET_ROOM', payload })
	};
};
export default connect(
	mapState,
	mapDispatch
)(Room);
