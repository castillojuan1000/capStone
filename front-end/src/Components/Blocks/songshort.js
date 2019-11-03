import React from 'react';
import '../../App.css';
import { PlayArrowRounded, PauseRounded, ThumbUpRounded } from '@material-ui/icons'




let Song = ({ song, idx, handleClick, active, isPlaying, searchState, likes, showLikes, createLike }) => {
  let hoverClass = (active) ? 'song-hover-state active' : 'song-hover-state'
  let playIcon = (active && isPlaying) ? <PauseRounded style={{ fontSize: '.8em' }} /> : <PlayArrowRounded style={{ fontSize: '.8em' }} />
  let artist = <h5>{song.artists[0].name}</h5>
  let image = (song.album !== undefined && song.album.images.length > 0)
    ? song.album.images[1].url : 'https://via.placeholder.com/150'
  let backgroundStyle = { backgroundImage: `url(${image})`, }
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
        <div className="featured-artists">
          {artist}
        </div>
      </div>
      {showLikes && (<div style={{ alignSelf: 'center', display: 'flex', justifyContent: 'flex-end', flexGrow: 1, padding: 5 }}>
        {likes && <h3>{likes}</h3>}
        <ThumbUpRounded style={{ color: '#28a745', fontSize: '1.8em', marginRight: 5, cursor: 'pointer' }} onClick={createLike} />
      </div>)}
    </div>)
}

export default Song