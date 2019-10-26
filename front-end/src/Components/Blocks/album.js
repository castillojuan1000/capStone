import React from 'react';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';

import { fontSize } from '@material-ui/system';
import { Link } from 'react-router-dom'



let Album = ({album, idx, active, isPlaying, handleClick}) => {
    let hoverClass = (active) ? 'album-hover-state active' : 'album-hover-state'
    let playIcon = (active && isPlaying) ? <PauseRoundedIcon style={{fontSize: '.8em'}}/> : <PlayArrowRoundedIcon style={{fontSize: '.8em'}}/>
    let image = (album.images.length > 0) ? album.images[1].url : 'https://via.placeholder.com/150'
    let backgroundStyle = {backgroundImage: `url(${image})`,}
    return (
            <div key={idx} className="album-block">
              <div style={backgroundStyle} className="album-img">
                  <div className={hoverClass} onClick={() => handleClick(album.id, active)}>
                      <div className="album-icon-holder">
                        {playIcon}
                      </div>
                  </div>
              </div>
              <div className="album-description">
                <Link className="album-link" to={'/album/'+ album.id}><h3>{album.name}</h3></Link>
                <h5>{album.artists[0].name}</h5>
              </div>
            </div>)
}

export default Album