import React from 'react';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import * as Vibrant from 'node-vibrant';
import { connect } from 'react-redux';
import { getColor } from '../../utilityFunctions/util.js';
import Playlist from './playlist';
import Song from '../../Components/Blocks/songshort';
import Station from './station.js';

const query = `query{
    getAllRooms{
        id
        roomName
        host{
            id
        }
    }
}`;
const opts = {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ query })
};
let QueueFilter = ({ name, isActive, onClick, color }) => {
	let className = isActive === name ? 'active' : '';
	let border = isActive === name ? { borderBottom: `2px solid ${color}` } : {};
	return (
		<li style={border} onClick={() => onClick(name)} className={className}>
			{name}
		</li>
	);
};

class Queue extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeFilter: 'Queue',
			color: this.props.color,
			isActive: this.props.isActive,
			toggleQ: this.props.toggleQ,
			rooms: []
		};
		this.setSearchFilter = this.setSearchFilter.bind(this);
	}
	componentDidMount() {
		fetch('/graphql', opts)
			.then(res => res.json())
			.then(res => {
				debugger;
				const { getAllRooms: rooms } = res.data;
				this.setState({ rooms });
			});
	}
	setSearchFilter = name => {
		this.setState({
			...this.state,
			activeFilter: name
		});
	};

	getFilterItems = () => {
		let searchFilters = ['Queue', 'Playlists', 'Stations'];
		let ListItems = [];
		searchFilters.forEach(name => {
			ListItems.push(
				<QueueFilter
					onClick={this.setSearchFilter}
					name={name}
					isActive={this.state.activeFilter}
					color={this.props.color}
				/>
			);
		});
		return ListItems;
	};

	renderPlaylists = () => {
		let playlists = [];
		if (this.props.playlists !== undefined) {
			this.props.playlists.forEach((playlist, idx) => {
				playlists.push(
					<Playlist
						playlist={playlist}
						id={idx}
						getPlaylistTracks={this.props.getPlaylistTracks}
					/>
				);
			});
		}
		return playlists;
	};
	buildStations = () => {
		const rooms = this.state.rooms.map((room, i) => {
			const isHost = this.props.user.id === Number(room.host.id);
			return (
				<Station
					roomId={room.id}
					roomName={room.roomName}
					key={i}
					isHost={isHost ? 1 : 0}
				/>
			);
		});
		return rooms;
	};
	buildTracks = () => {
		let tracks = [];
		this.props.queue.forEach((track, idx) => {
			let active = this.props.currentURI === track.uri ? true : false;
			tracks.push(
				<Song
					handleClick={this.PlaySong}
					active={active}
					isPlaying={this.props.isPlaying}
					song={track}
					idx={idx}
				/>
			);
		});
		return tracks;
	};

	render() {
		let playlists = [];
		let tracks = [];
		let stations = [];
		let queueStyle = {
			opacity: this.props.isActive ? 1 : 0,
			height: this.props.isActive ? '' : 0
		};
		let arrowStyle = {
			background: this.props.isActive ? '' : 'transparent'
		};
		if (this.state.activeFilter === 'Playlists') {
			playlists = this.renderPlaylists();
		} else if (this.state.activeFilter === 'Queue') {
			tracks = this.buildTracks();
		} else if (this.state.activeFilter === 'Stations') {
			stations = this.buildStations();
		}
		let ListItems = this.getFilterItems();
		return (
			<div className='queue' style={queueStyle}>
				<div className='queue-header'>
					<div className='queue-list'>
						<ul>{ListItems}</ul>
					</div>
				</div>
				<div className='queue-playlist-holder'>
					{playlists}
					{tracks}
					{stations}
				</div>
				<div
					className='downward-arrow'
					style={arrowStyle}
					onClick={() => this.props.toggleQ()}>
					<QueueMusicIcon
						style={{
							fontSize: '1.7em',
							color: this.props.color,
							borderRadius: '50px',
							boxShadow: '1px 1px 10px 1px rgba(0,0,0, 0.6)'
						}}
					/>
				</div>
			</div>
		);
	}
}
const mapState = state => {
	return { ...state };
};
export default connect(
	mapState,
	null
)(Queue);
