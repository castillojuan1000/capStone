import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Song from '../../Components/Blocks/songshort';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_ROOM, CREATE_LIKE } from '../../Apollo';
import Chatroom from '../Pages/Chatroom';
function Room({ match, player, user, setRoom, spotifyData }) {
	const { playSong } = spotifyData.player;
	return (
		<MainRoom color={player.colors.darkVibrant}>
			<div className='main_room_header'>
				<h1>{user.room && user.room.roomName}</h1>
			</div>
			<QueryRoom
				id={Number(match.params.id)}
				queue={player.queue}
				user={user}
				setRoom={setRoom}
				player={player}
				playSong={playSong}
			/>
		</MainRoom>
	);
}

export function QueryRoom({ id, player, user, setRoom, playSong }) {
	const { loading, error, data } = useQuery(GET_ROOM, {
		variables: { id },
		pollInterval: 1500
	});
	let isHost;
	let host;
	let likes = [];
	let messages = [];
	let roomName = '';
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
		likes = getRoom.likes.map(like => {
			return {
				spotifyId: like.spotifyId,
				userId: like.user.id,
				roomId: like.room.id
			};
		});
		roomName = getRoom.roomName;
		host = getRoom.host;
		isHost = Number(getRoom.host.id) === user.id;
		console.log(likes);
	}
	return (
		<MainContainer>
			{isHost ? (
				<HostView
					queue={player.queue}
					messages={messages}
					roomId={id}
					isHost={isHost ? 1 : 0}
					setRoom={setRoom}
					host={host}
					player={player}
					likes={likes}
					playSong={playSong}
					roomName={roomName}
				/>
			) : (
				<ListenerView
					queue={player.queue}
					messages={messages}
					roomId={id}
					roomName={roomName}
					isHost={isHost ? 1 : 0}
					setRoom={setRoom}
					host={host}
					likes={likes}
					player={player}
					user={user}
					playSong={playSong}
				/>
			)}
		</MainContainer>
	);
}

function HostView({
	messages,
	queue,
	player,
	roomId,
	isHost,
	host,
	setRoom,
	likes,
	playSong,
	roomName
}) {
	useEffect(() => {
		setRoom({ roomId, roomName, host: { isHost, ...host } });
	}, [setRoom, roomId, isHost, host, roomName]);
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
							handleClick={() => {
								const newQueue = queue.filter(s => s.uri === song.uri);
								return playSong(
									JSON.stringify([
										song.uri,
										player.currentSong.uri,
										...newQueue.map(s => s.uri)
									])
								);
							}}
							idx={i}
							isPlaying={player.isPlaying}
							showLikes={1}
							likes={likes.filter(e => e.spotifyId === song.id).length}
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
	setRoom,
	likes,
	user,
	playSong,
	roomName
}) {
	useEffect(() => {
		setRoom({ roomId, roomName, host: { isHost, ...host } });
	}, [setRoom, roomId, isHost, host, roomName]);
	const [createLike] = useMutation(CREATE_LIKE);
	const handleClick = (roomId, userId, spotifyId) => {
		const like = {
			roomId,
			userId,
			spotifyId
		};
		if (
			likes.findIndex(
				l =>
					Number(l.userId) === userId &&
					l.spotifyId === spotifyId &&
					Number(l.roomId) === roomId
			) > -1
		) {
			console.log('Already Liked');
			return;
		} else {
			likes = [...likes, like];
			return createLike({ variables: { roomId, userId, spotifyId } });
		}
	};
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
							handleClick={() => {
								const newQueue = queue.filter(s => s.uri === song.uri);
								return playSong(
									JSON.stringify([
										song.uri,
										player.currentSong.uri,
										...newQueue.map(s => s.uri)
									])
								);
							}}
							idx={i}
							showLikes={1}
							likes={likes.filter(e => e.spotifyId === song.id).length}
							isPlaying={player.isPlaying}
							createLike={() => handleClick(roomId, user.id, song.id)}
						/>
					);
				})}
			</div>
			<Chatroom messages={messages} roomId={roomId} isHost={isHost ? 1 : 0} />
		</>
	);
}

const MainRoom = styled.div`
	width: 100vw;
	height: 100vh;
	margin: auto;
	padding-top: 30px;
	background: ${props =>
		`linear-gradient(160deg, ${props.color} 15%, rgba(0,0,0, 0.9) 70%)`};
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
	background: rgba(0, 0, 0, 0.5);
	margin-top: 5vh;
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
	::-webkit-scrollbar {
		background-color: rgba(255, 255, 255, 0.3) rgba(0, 0, 0, 0.1);
	}
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
