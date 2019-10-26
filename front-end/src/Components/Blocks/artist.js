import React from 'react';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import { fontSize } from '@material-ui/system';




let Artist = ({artist, idx}) => {
    let image = (artist.images.length > 0) ? artist.images[1].url : 'https://via.placeholder.com/150'
    let backgroundStyle = {backgroundImage: `url(${image})`,}
    return (
            <div key={idx} className="artist-block">
              <div style={backgroundStyle} className="artist-img">
                  <div className="artist-hover-state">
                      <div className="artist-icon-holder">
                        <PlayArrowRoundedIcon style={{fontSize: '.8em'}}/>
                      </div>
                  </div>
              </div>
              <div className="artist-description">
                <h3>{artist.name}</h3>
              </div>
            </div>)
}

export default Artist