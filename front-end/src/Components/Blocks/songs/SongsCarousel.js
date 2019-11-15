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
  const [state, setState] = useState({
    current: "",
    total: ""
  });
  const [slide, setSlide] = useState({
    activeSlide: 0,
    activeSlide2: 0
  });
  const ArtworkJSX = () => {
    return roomState.songs.map((songObj, i) => {
      const currentSong = songObj;
      return (
        <div className="room-player" key={i}>
          <div className="room-art">
            {currentSong && (
              <img
                className="room-art-image"
                src={currentSong.image}
                alt={`${currentSong.name} artwork`}
              />
            )}
          </div>
          <div className="room-currentsong-info">
            <h3>{currentSong.artists[0].name}</h3>
            <h3>{currentSong.name}</h3>
          </div>
        </div>
      );
    });
  };
  return (
    <>
      <ArtworkJSX />
    </>
  );
}
