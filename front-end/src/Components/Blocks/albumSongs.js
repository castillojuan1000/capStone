import React from 'react';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import { fontSize } from '@material-ui/system';


import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import LensIcon from '@material-ui/icons/Lens';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';


import {getSongSeconds} from '../../utilityFunctions/util.js';



let Song = ({song, idx, handleClick, active, isPlaying, albumName, image}) => {
    let hoverClass = (active) ? 'song-hover-state active' : 'song-hover-state'
    let playIcon = (active && isPlaying) ? <PauseRoundedIcon style={{fontSize: '.8em'}}/> : <PlayArrowRoundedIcon style={{fontSize: '.8em'}}/>
    let dotStyle = {fontSize: '.4em', paddingBottom: '.2em', marginLeft: '2em', marginRight: '2em'}
    let artist = song.artists.map( ( artist )  => {return artist.name});
    let explicit = (song.explicit) ? <span className="explicit-tag">EXPLICIT</span> : ''
    let backgroundStyle = {backgroundImage: `url(${image})`,}
    return (
            <div key={idx} className="song-block">
              <div style={backgroundStyle} className="song-img-item">
                  <div className={hoverClass} onClick={() => handleClick(song.uri, active)}>
                      <div className="song-icon-holder">
                        {playIcon}
                      </div>
                  </div>
              </div>
              <div className="song-description">
                <h3>{song.name}</h3>
                <h5>{explicit}{artist.toString().replace(',', ', ')}</h5>
              </div>
              <div className="song-action">
                <FavoriteRoundedIcon/>
                <MoreHorizRoundedIcon/>
              </div>
              <div className="song-duration">
                <div><h3>{getSongSeconds(song.duration_ms / 1000)}</h3></div>
              </div>
            </div>)
}

export default Song