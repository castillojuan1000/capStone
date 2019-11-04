import React from 'react';
import '../../App.css';

import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';





let Song = ({song, idx, handleClick, active, isPlaying, searchState}) => {
    let hoverClass = (active) ? 'song-hover-state active' : 'song-hover-state'
    let playIcon = (active && isPlaying) ? <PauseRoundedIcon style={{fontSize: '.8em'}}/> : <PlayArrowRoundedIcon style={{fontSize: '.8em'}}/>
    let artist = <h5>{song.artists[0].name}</h5>
    let image = (song.album !== undefined && song.album.images.length > 0)
            ? song.album.images[1].url : 'https://via.placeholder.com/150'
    let backgroundStyle = {backgroundImage: `url(${image})`,}
    return (
            <div key={idx} className="song-block">
              <div style={backgroundStyle} className="song-img-item">
                  <div className={hoverClass} onClick={() => handleClick(song.id, active)}>
                      <div className="song-icon-holder">
                        {playIcon}
                      </div>
                  </div>
              </div>
              <div className="song-description">
                <h3>{song.name}</h3>
                <div className="featured-artists">
                    {artist}
                </div>
              </div>
            </div>)
}

export default Song