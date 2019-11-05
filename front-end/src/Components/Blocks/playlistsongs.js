import React from 'react';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import { fontSize } from '@material-ui/system';

import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import LensIcon from '@material-ui/icons/Lens';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import { Link } from 'react-router-dom';

import { getSongSeconds } from '../../utilityFunctions/util.js';

let Tracks = ({
    track,
    idx,
    handleClick,
    active,
    isPlaying,
    albumName,
    image,
    searchState
}) => {
    let hoverClass = active ? 'track-hover-state active' : 'track-hover-state';
    let playIcon =
        active && isPlaying ? (
            <PauseRoundedIcon style={{ fontSize: '.8em' }} />
        ) : (
                <PlayArrowRoundedIcon style={{ fontSize: '.8em' }} />
            );
    let dotStyle = {
        fontSize: '.4em',
        paddingBottom: '.2em',
        marginLeft: '2em',
        marginRight: '2em'
    };
    let list = track.track.artists.map(artist => {

        return (
            <Link className='album-link' to={{ pathname: '/track/' + track.id }}>
                <h5>{artist.name}</h5>
            </Link>
        );
    });

    let explicit = track.track.explicit ? (
        <h5 className='explicit-tag'>EXPLICIT</h5>
    ) : (
            ''
        );
    let backgroundStyle = { backgroundImage: `url(${image})` };
    return (
        <div key={idx} className='song-block'>
            <div style={backgroundStyle} className='song-img-item'>
                <div
                    className={hoverClass}
                    onClick={() => handleClick(track.track.uri, active)}>
                    <div className='song-icon-holder'>{playIcon}</div>
                </div>
            </div>
            <div className='song-description'>
                <h3>{track.name}</h3>
                <div className='featured-artists'>
                    {explicit}
                    {list}
                </div>
            </div>
            <div className='song-action'>
                <FavoriteRoundedIcon />
                <MoreHorizRoundedIcon />
            </div>
            <div className='song-duration'>
                <div>
                    <h3>{getSongSeconds(track.duration_ms / 1000)}</h3>
                </div>
            </div>
        </div>
    );
};

export default Tracks;