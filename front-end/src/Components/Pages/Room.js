import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_ROOM, CREATE_LIKE } from "../../Apollo";
import SongsCarousel from "../Blocks/songs/SongsCarousel";
import SongFeatures from "../Blocks/songs/SongFeatures";

function Room(props) {
  const { player, user, spotifyData } = props;
  const [roomState, setRoomState] = useState({
    currentSong: {
      image: "",
      id: "",
      uri: "",
      name: "",
      artists: [],
      features: null
    },
    songs: [],
    playlistTracks: []
  });
  useEffect(() => {
    const aborter = new AbortController();
    const songsFetcher = spotifyData.player
      .GetPlaylistTracks(user.room.spotifyId)
      .then(results => {
        const songs = results.items.map(e => {
          const res = e.track;
          setRoomState(s => ({
            ...s,
            playlistTracks: [...s.playlistTracks, e]
          }));
          let image = "/music-placeholder.png";
          if (res.album && res.album.images.length > 1) {
            image = res.album.images[1].url;
          } else if (res.album.images.length === 1) {
            image = res.album.image[0].url;
          }
          return {
            duration: res.duration_ms,
            artists: res.artists,
            name: res.name,
            image,
            id: res.id,
            uri: res.uri
          };
        });
        return songs;
      })
      .then(songs => {
        spotifyData.player
          .getTrackFeatures(`?ids=${songs.map(e => e.id)}`)
          .then(res => {
            const newSongs = songs.map((e, i) => {
              e.features = res["audio_features"][i];
              return e;
            });
            setRoomState(s => ({
              ...s,
              currentSong: { ...songs[0] },
              songs: newSongs
            }));
          });
      });
    return () => aborter.abort(songsFetcher);
  }, [setRoomState, user, spotifyData]);
  const id = Number(props.match.params.id);
  const [createLike] = useMutation(CREATE_LIKE);
  const { loading, error, data } = useQuery(GET_ROOM, {
    variables: { id },
    pollInterval: 0,
    fetchPolicy: "cache-and-network"
  });
  if (error) {
    return <MainRoom>Error</MainRoom>;
  }
  if (loading) {
    return (
      <MainRoom style={{ display: "flex", alignItems: "center" }}>
        <Loader loading={true} />
      </MainRoom>
    );
  }
  const { getRoom } = data;
  const { host } = getRoom;
  // let messages = getRoom.messages.map(m => {
  //   return {
  //     author: m.user.username,
  //     message: m.message
  //   };
  // });
  const likes = getRoom.likes.map(like => {
    return {
      spotifyId: like.spotifyId,
      userId: like.user.id,
      roomId: like.room.id
    };
  });
  const playSongRoom = uri => {
    const idx = roomState.playlistTracks.findIndex(e => e.track.uri === uri);
    const selectedSong = roomState.playlistTracks[idx];
    setRoomState(s => ({ ...s, currentSong: { ...s.songs[idx] } }));
    const newQueue = [
      selectedSong,
      ...roomState.playlistTracks.slice(0, idx),
      ...roomState.playlistTracks.slice(idx + 1)
    ];
    const newQueueURI = JSON.stringify(newQueue.map(e => e.track.uri));
    props.spotifyData.player.playSong(newQueueURI);
    props.ResetQueue(newQueue);
  };
  const handleCreateLikeClick = (roomId, userId, spotifyId) => {
    const like = {
      roomId,
      userId,
      spotifyId
    };
    const idx = likes.findIndex(
      l => Number(l.userId) === userId && l.spotifyId === spotifyId
    );
    if (idx > -1) return;
    return createLike({ variables: { ...like } });
  };

  const { currentSong } = roomState;
  return (
    <MainRoom color={player.colors.darkVibrant}>
      {/* <div className="main_room_header">
        <h1>{user.room.roomName}</h1>
      </div> */}
      <div className="room-host">
        <HostInfo spotifyData={spotifyData} host={host} />
      </div>
      <div className="room-stats">
        <div className="room-songs" style={{ overflowY: "scroll" }}>
          <SongsCarousel
            {...{
              playSongRoom,
              spotifyData,
              likes,
              id,
              user,
              handleCreateLikeClick,
              roomState,
              setRoomState,
              player
            }}
          />
        </div>
        <SongFeatures song={currentSong} color={player.colors.darkVibrant} />
      </div>
    </MainRoom>
  );
}

const HostInfo = ({ spotifyData, host }) => {
  const [state, setState] = useState({
    displayName: "",
    externalUrl: "",
    followers: 0,
    image: ""
  });
  useEffect(() => {
    spotifyData.player.getUserProfile(host.spotifyId).then(userData => {
      const image = userData.images.length
        ? userData.images[0].url
        : "https://avatars.dicebear.com/v2/initials/Na.svg?options[backgroundColors][]=grey&options[backgroundColorLevel]=500&options[fontSize]=29&options[bold]=1";
      const hostObject = {
        displayName: userData["display_name"],
        externalUrl: userData.externalUrl,
        followers: userData.followers.total,
        image: image
      };
      setState(hostObject);
    });
  }, [spotifyData, setState, host]);
  let bannerStyle = { backgroundImage: `url('${state.image}')` };
  return (
    <>
      <div className="host-top-section">
        <div className="host-left-section">
          <div className="host-banner" style={bannerStyle}></div>
        </div>
        <div className="host-description">
          <h1>{state.displayName}</h1>
          <div className="host-button">
            <div>
              <button className="btn btn-secondary">Follow</button>
            </div>
          </div>
          <h3>Followers {state.followers}</h3>
        </div>
      </div>
    </>
  );
};

const MainRoom = styled.div`
  height: 90vh;
  width: 100%;
  padding-left: 4%;
  padding-right: 1%;
  display: flex;
  flex-direction: row;
  transition: all 1s;
  background: ${props =>
    `linear-gradient(160deg, ${props.color} 15%, rgba(0,0,0, 0.9) 70%)`};
  h1,
  h3,
  h5 {
    color: rgba(255, 255, 255, 0.75);
    line-height: 1em;
    margin: 0 1rem;
    font-size: 1rem;
    color: white;
    text-transform: capitalize;
    font-weight: 200;
  }
  h1 {
    margin: 2rem;
    font-size: 2rem;
    font-weight: 500;
  }
  .main_room_hero {
    display: flex;
    justify-content: space-between;
  }
  .song-block {
    width: 100%;
  }
  .roomInfo {
    display: flex;
    align-items: flex-start;
  }
  .song-image {
    width: 60px;
    height: 60px;
    z-index: 2;
    img {
      border-radius: 5px;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .room-host {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .host-left-section {
      padding-top: 5%;
      height: 100%;
      .host-banner {
        height: 18em;
        width: 18em;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 50%;
      }
    }
    .host-top-section {
      width: 30vw;
      height: 90vh;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: rgba(0, 0, 0, 0);
    }
    .host-left-section {
      width: 100%;
      width: 30vw;
      height: 50%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .host-description {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .host-buttons {
      width: 70%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      padding-right: 10%;
      padding-top: 5%;
      padding-left: 10%;
      align-items: center;
      flex-wrap: nowrap;
    }
  }

  .room-stats {
    display: flex;
    height: 40vh;
    border-radius: 5px;
    .room-songs {
      flex-grow: 2;
      height: 100%;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      align-self: flex-start;
      margin: 2em 0;
      background-color: rgba(0, 0, 0, 0.5);
      .room-song {
        background-color: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        display: flex;
        margin: 1px 0;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #333;
        &.active {
          background-color: ${({ color }) => (color ? color : "red")};
        }
        .song-name {
          flex-grow: 2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          h3 {
            font-size: 1rem;
            font-weight: 200;
            &.name {
              width: fit-content;
              font-size: 1.5rem;
              font-weight: 300;
            }
          }
          a {
            color: inherit;
          }
        }
      }
    }
  }

  .likes-container {
    height: 40%;
    width: 40%;
    margin: auto;
  }
`;

let Loader = ({ loading }) => {
  let display = loading ? "block" : "none";
  let loaderStyle = { display: display };
  return (
    <div className="loader" style={loaderStyle}>
      Loading...
    </div>
  );
};
const mapState = state => {
  return { ...state };
};
const mapDispatch = dispatch => {
  return {
    setRoom: payload => dispatch({ type: "SET_ROOM", payload }),
    ResetQueue: payload => {
      dispatch({ type: "RESET_PLAYER_QUEUE", payload });
    }
  };
};
export default connect(mapState, mapDispatch)(Room);
