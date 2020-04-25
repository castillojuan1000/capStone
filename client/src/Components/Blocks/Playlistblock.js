import React from 'react';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';

import { withRouter } from 'react-router-dom';
// import '../albumPage.css';
import { Link } from 'react-router-dom';

let PlaylistBlock = ({ playlist, idx, active, isPlaying, handleClick, libraryState }) => {
    console.log(playlist, 'here i am ')
    let hoverClass = active ? 'playlist-hover-state active' : 'playlist-hover-state';
    let playIcon =
        active && isPlaying ? (
            <PauseRoundedIcon style={{ fontSize: '3em' }} />
        ) : (
                <PlayArrowRoundedIcon style={{ fontSize: '3em',  color: 'rgba(255,255,255,0.6)' }} />
            );

    let image =
        playlist.images.length > 1
            ? playlist.images[1].url
            : '/music-placeholder.png';
    let backgroundStyle = { backgroundImage: `url(${image})` };
    return (
        <div key={idx} className='playlist-block library-block'>
            <div style={backgroundStyle} className='playlist-img'>
                <div
                    className={hoverClass}
                    onClick={() => handleClick(playlist.id, active)}>
                    <div className='hover-state'>
                        <div className='playlist-icon-holder'>
                            {playIcon}
                        </div>

                    </div>

                </div>
            </div>
            <div className='playlist-description'>
                <Link className='playlist-link'
                    to={{ pathname: '/playlist/' + playlist.id, state: { ...libraryState } }}>
                    <h3>{playlist.name}</h3>
                </Link>
            </div>

        </div>
    );

};

export default withRouter(PlaylistBlock)
