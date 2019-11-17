import React, { useState, useEffect } from "react";
import Slider from "react-slick";

export default function SongCarousel({
  spotifyData,
  songs,
  id,
  user,
  handleCreateLikeClick,
  roomState,
  setRoomState
}) {
  const ArtworkJSX = () => {
    return roomState.songs.map((songObj, i) => {
      const currentSong = songObj;
      return (
        <div
          key={i}
          onClick={() =>
            setRoomState({ ...roomState, currentSong: { ...songObj } })
          }
          className={
            songObj.id === roomState.currentSong.id
              ? "room-song active"
              : "room-song"
          }
        >
          <div className="song-image">
            <img src={currentSong.image} alt={`${currentSong.name} artwork`} />
          </div>
          <div className="song-name">
            <h3 className="name">{currentSong.name}</h3>
            <h3>
              <marquee direction="left" scrollamount="4" behavior="scroll">
                {currentSong.artists.map(e => ` ${e.name}`)}
              </marquee>
            </h3>
          </div>
          <div className="song-info"></div>
          <div className="song-length">
            <h3>{millisToMinutesAndSeconds(currentSong.duration)}</h3>
          </div>
        </div>
      );
    });
  };
  return <ArtworkJSX />;
}
function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
