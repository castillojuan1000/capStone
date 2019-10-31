import React from 'react';
import { connect } from 'react-redux';
import Song from '../Blocks/albumSongs';
import styled from 'styled-components';
import Chatroom from './Chatroom';

function Main(props) {
	const [queue, setQueue] = React.useState([]);
	const { player } = props.spotifyData;
	React.useEffect(() => {
		setQueue([...props.player.queue]);
	}, [player]);
	return (
		<MainRoom>
			<div className='main_room_header'>
				<h1>SoungGoodMusic</h1>
			</div>
			<QueueContainer>
				<h1>Queue</h1>
				{queue.map((song, i) => {
					const active = props.player.currentSongId === song.id;
					return (
						<Song
							key={i}
							song={song}
							active={active}
							handleClick={() => {
								player.playSong(song.uri);
							}}
							idx={i}
							isPlaying={props.player.isPlaying}
						/>
					);
				})}
				<Chatroom />
			</QueueContainer>
		</MainRoom>
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
const QueueContainer = styled.div`
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

const mapState = state => {
	return { ...state };
};
export default connect(
	mapState,
	null
)(Main);
