import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Song from '../../Components/Blocks/songshort';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_ROOM, CREATE_LIKE } from '../../Apollo';
import Chatroom from '../Pages/Chatroom';

const buildTracks = (
	queue,
	PlaySong,
	handleClick,
	isPlaying,
	player,
	ResetQueue,
	likes,
	roomId,
	user,
	createLike,
	isHost
) => {
	let tracks = [];
	queue.forEach((track, idx) => {
		tracks.push(
			<Song
				key={`que-song-${idx}`}
				PlaySong={PlaySong}
				handleClick={() => handleClick(track.id, queue, player, ResetQueue)}
				active={false}
				isPlaying={isPlaying}
				song={track}
				idx={idx}
				showLikes={1}
				likes={likes.filter(e => e.spotifyId === track.id).length}
				createLike={() => !isHost && createLike(roomId, user.id, track.id)}
			/>
		);
	});
	return tracks;
};
const handleClick = (id, queue, player, ResetQueue) => {
	let index = queue.findIndex(track => {
		if ('added_at' in track) {
			track = track.track;
		}
		return track.id === id;
	});
	let currentSongs = queue.slice(index, queue.length).map(track => {
		if ('track' in track) {
			track = track.track;
		}
		return track.uri;
	});
	let newItems = [];
	queue.slice(index, queue.length).forEach((track, idx) => {
		if ('track' in track) {
			track = track.track;
		}
		track.order = idx;
		track.album = {
			images: track.album.images
		};
		newItems.push(track);
	});
	console.debug(newItems, 'newItems')
	ResetQueue(newItems);
	let uris = JSON.stringify([...currentSongs]);
	player.playSong(uris);
};

function Room({ match, player, user, setRoom, spotifyData, ResetQueue }) {
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
				ResetQueue={ResetQueue}
			/>
		</MainRoom>
	);
}

export function QueryRoom({ id, player, user, setRoom, playSong, ResetQueue }) {
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
					ResetQueue={ResetQueue}
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
					ResetQueue={ResetQueue}
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
	roomName,
	ResetQueue
}) {
	useEffect(() => {
		setRoom({ roomId, roomName, host: { isHost, ...host } });
	}, [setRoom, roomId, isHost, host, roomName]);
	return (
		<>
			<h1>Queue</h1>
			<div>
				{buildTracks(
					queue,
					playSong,
					handleClick,
					player.isPlaying,
					player,
					ResetQueue,
					likes,
					roomId,
					host,
					null,
					isHost
				)}
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
	roomName,
	ResetQueue
}) {
	useEffect(() => {
		setRoom({ roomId, roomName, host: { isHost, ...host } });
	}, [setRoom, roomId, isHost, host, roomName]);
	const [createLike] = useMutation(CREATE_LIKE);
	const handleCreateLikeClick = (roomId, userId, spotifyId) => {
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
				{buildTracks(
					queue,
					playSong,
					handleClick,
					player.isPlaying,
					player,
					ResetQueue,
					likes,
					roomId,
					user,
					handleCreateLikeClick,
					isHost
				)}
			</div>
			<Chatroom messages={messages} roomId={roomId} isHost={isHost ? 1 : 0} />
		</>
	);
}

const MainRoom = styled.div`
	width: 100vw;
	height: 100vh;
	margin: auto;
	padding: 30px;
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
	width: 30vw;
	height: 60vh;
	padding: 20px;
	border-radius: 10px;
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
