import React from 'react';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import { fontSize } from '@material-ui/system';

import { Link } from 'react-router-dom'


let Artist = ({artist, idx, handleClick}) => {
    let image = (artist.images.length > 0) ? artist.images[1].url : 'https://via.placeholder.com/150'
    let backgroundStyle = {backgroundImage: `url(${image})`,}
    return (
            <div key={idx} className="artist-block">
              <div style={backgroundStyle} className="artist-img">
                  <div className="artist-hover-state" onClick={() => handleClick(artist.id)}>
                      <div className="artist-icon-holder">
                        <PlayArrowRoundedIcon style={{fontSize: '.8em'}}/>
                      </div>
                  </div>
              </div>
              <div className="artist-description">
                 <Link className="album-link" to={{pathname: '/artist/'+ artist.id}}><h3>{artist.name}</h3></Link>
              </div>
            </div>)
}

export default Artist