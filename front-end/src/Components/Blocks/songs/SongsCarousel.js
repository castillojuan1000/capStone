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
  const settings = {
    className: "likes-container",
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => {
      setSlide({ activeSlide: next });
      setRoomState({ ...roomState, currentSong: { ...roomState.songs[next] } });
    },
    afterChange: current => setSlide({ activeSlide2: current })
  };
  return (
    <>
      <Slider {...settings}>
        {roomState.songs.map((songObj, i) => {
          const currentSong = songObj;
          return (
            <div key={i}>
              <div className="room-player">
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
            </div>
          );
        })}
      </Slider>
    </>
  );
}
