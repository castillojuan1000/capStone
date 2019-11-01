import React from 'react';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import * as Vibrant from 'node-vibrant';

import {getColor} from '../../utilityFunctions/util.js'
import Playlist from './playlist'
import Song from '../../Components/Blocks/songshort';


let QueueFilter = ({ name, isActive, onClick, color}) => {
	let className =
		isActive === name ? 'active' : '';
	let border = 
		(isActive === name) ? {borderBottom: `2px solid ${color}`} : {};
	return (
		<li
			style={border}
			onClick={() => onClick(name)}
			className={className}>
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
        };
        this.setSearchFilter = this.setSearchFilter.bind(this)
    }
 
    setSearchFilter = name => {
        this.setState({
            ...this.state,
            activeFilter: name,
        })
    };

    getFilterItems = () => {
        let searchFilters = ['Queue', 'Playlists'];
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
        })
        return ListItems
    }

    renderPlaylists = () => {
        let playlists = [];
        if (this.props.playlists !== undefined){
            this.props.playlists.forEach(playlist => {   
                playlists.push(<Playlist playlist={playlist}/>)
            })
        }
        return playlists
    }

    buildTracks = () => {
		let tracks = [];
			this.props.queue.forEach((track, idx) => {
				let active = this.props.currentURI === track.uri ? true : false;
				tracks.push(
					<Song
						handleClick={this.PlaySong}
						active={active}
						isPlaying={this.state.isPlaying}
						song={track}
						idx={idx}
					/>
				);
			});
		return tracks;
	};

    render() {
        console.log(this.props.queue)
        let playlists = [];
        let tracks = [];
        let queueStyle = {
            opacity: (this.props.isActive) ? 1 : 0,
        }
        let arrowStyle = {
            background: (this.props.isActive) ? '' : 'transparent',
        }
        if (this.state.activeFilter === 'Playlists') {
            playlists = this.renderPlaylists()
        }
        else {
            tracks = this.buildTracks();
        }
        let ListItems  = this.getFilterItems()
        return (
            <div className="queue" style={queueStyle}>
                <div className="queue-header">
                    <div className='queue-list'>
                            <ul>{ListItems}</ul>
                    </div>
                </div>
                <div className="queue-playlist-holder">
                {playlists}
                {tracks}
                </div>
                <div className="downward-arrow" style={arrowStyle} onClick={() => this.props.toggleQ()}>
                    <QueueMusicIcon 
                        style={{
                            fontSize: '1.7em',
                            color: this.props.color,
                            borderRadius: '50px',
                            boxShadow: '1px 1px 10px 1px rgba(0,0,0, 0.6)'
                        }}
                    />
                </div>
            </div>)

    }
}



export default Queue