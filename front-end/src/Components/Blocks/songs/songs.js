import React from "react";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import LensIcon from "@material-ui/icons/Lens";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import MoreHorizRoundedIcon from "@material-ui/icons/MoreHorizRounded";
import PauseRoundedIcon from "@material-ui/icons/PauseRounded";
import { Link } from "react-router-dom";
import { getSongSeconds } from "../../../utilityFunctions/util.js";

let Song = ({ song, idx, handleClick, active, isPlaying }) => {
  let hoverClass = active ? "song-hover-state active" : "song-hover-state";
  let playIcon =
    active && isPlaying ? (
      <PauseRoundedIcon style={{ fontSize: ".8em" }} />
    ) : (
      <PlayArrowRoundedIcon style={{ fontSize: ".8em" }} />
    );
  let dotStyle = {
    fontSize: ".4em",
    paddingBottom: ".2em",
    marginLeft: "2em",
    marginRight: "2em"
  };
  let artist = song.artists.map((artist, ind) => {
    return (
      <Link
        className="album-link"
        key={`artist-link-${ind}`}
        to={{ pathname: "/artist/" + artist.id }}
      >
        <h5>{artist.name}</h5>
      </Link>
    );
  });
  let image =
    song.album.images.length > 0
      ? song.album.images[1].url
      : "/music-placeholder.png";
  let backgroundStyle = { backgroundImage: `url(${image})` };
  return (
    <div key={idx} className="song-block">
      <div style={backgroundStyle} className="song-img-item">
        <div
          className={hoverClass}
          onClick={() => handleClick(song.uri, active)}
        >
          <div className="song-icon-holder">{playIcon}</div>
        </div>
      </div>
      <div className="song-description">
        <h3>{song.name}</h3>
        <div className="featured-artists">
          {artist}
          <h5>
            <LensIcon style={dotStyle} />
          </h5>
          <Link
            key={`album-link2-${idx}`}
            className="album-link"
            to={{ pathname: "/album/" + song.album.id }}
          >
            <h5>{song.album.name}</h5>
          </Link>
        </div>
      </div>
      <div className="song-action">
        <FavoriteRoundedIcon />
        <MoreHorizRoundedIcon />
      </div>
      <div className="song-duration">
        <div>
          <h3>{getSongSeconds(song.duration_ms / 1000)}</h3>
        </div>
      </div>
    </div>
  );
};

export default Song;
