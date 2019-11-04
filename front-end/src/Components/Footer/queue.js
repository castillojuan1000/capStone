import React from 'react';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import { connect } from 'react-redux';
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
                //debugger;
                if (res.data !== undefined) {
				const { getAllRooms: rooms } = res.data;
                this.setState({ rooms });
                }
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
		searchFilters.forEach((name, idx) => {
			ListItems.push(
				<QueueFilter
					key={`queue-filter-${idx}`}
					onClick={this.setSearchFilter}
					name={name}
					isActive={this.state.activeFilter}
					color={this.props.color}
				/>
			);
		});
		return ListItems;
    };
    
    handleClick = (id, active) => {
        if (!active) {
            let index = this.props.player.queue.findIndex(track => {
                if ('track' in track){
                    track = track.track;
                }
                return track.id === id
            });
                let currentSongs = this.props.player.queue
                    .slice(index, this.props.player.queue.length)
                    .map(track => {
                        if ('track' in track){
                            track = track.track;
                        }
                        return track.uri;
                    });
                let newItems = [];
                this.props.player.queue
                    .slice(index, this.props.player.queue.length)
                    .forEach((track, idx) => {
                    if ('track' in track){
                        track = track.track;
                    }
                    track.order = idx;
                    track.album = {
                        images: track.album.images,
                    }
                    newItems.push(track)
                })
                this.props.ResetQueue(newItems)
                let uris = JSON.stringify([...currentSongs])
                this.props.playSong(uris)
        } else if ((active, this.props.isPlaying === false)) {
			this.props.spotifyData.player.ResumePlayer();
		} else {
			this.props.spotifyData.player.StopPlayer();
		}
        }

	renderPlaylists = () => {
		let playlists = [];
		if (this.props.playlists !== undefined) {
			this.props.playlists.forEach((playlist, idx) => {

				playlists.push(
					<Playlist
                        player={this.props.spotifyData.player}
                        playlist={playlist}
                        isPlaying={this.props.isPlaying}
                        currentURI={this.props.currentURI}
                        id={idx}
                        playSong={this.props.playSong}
                        ResetQueue={this.props.ResetQueue}
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
            if ('track' in track){
                track = track.track
            }
            let active = this.props.currentURI === track.uri ? true : false;
			tracks.push(
				<Song
					key={`que-song-${idx}`}
                    PlaySong={this.props.PlaySong}
					handleClick={this.handleClick}
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
			opacity: this.props.isActive ? 1 : 1,
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
				<div className='queue-header' style={queueStyle}>
					<div className='queue-list' style={queueStyle}>
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
